import fs from "fs";
import path from "path";
import type { BillingInterval } from "@/lib/types/product";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "paused" | "trialing";

export interface SubscriptionCustomer {
  email: string;
  name?: string;
}

export interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  customer: SubscriptionCustomer;
  productSlug: string;
  productName: string;
  amount: number; // in cents
  currency: string;
  interval: BillingInterval;
  intervalCount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}

const SUBSCRIPTIONS_DIR = path.join(process.cwd(), "content/subscriptions");

// Ensure subscriptions directory exists
function ensureSubscriptionsDir() {
  if (!fs.existsSync(SUBSCRIPTIONS_DIR)) {
    fs.mkdirSync(SUBSCRIPTIONS_DIR, { recursive: true });
  }
}

// Generate a unique subscription ID
export function generateSubscriptionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SUB-${timestamp}-${random}`.toUpperCase();
}

// Save a subscription to file
export function saveSubscription(subscription: Subscription): void {
  ensureSubscriptionsDir();
  const filePath = path.join(SUBSCRIPTIONS_DIR, `${subscription.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(subscription, null, 2));
}

// Get a single subscription by ID
export function getSubscription(subscriptionId: string): Subscription | null {
  const filePath = path.join(SUBSCRIPTIONS_DIR, `${subscriptionId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// Get subscription by Stripe subscription ID
export function getSubscriptionByStripeId(stripeSubscriptionId: string): Subscription | null {
  const subscriptions = getAllSubscriptions();
  return subscriptions.find((sub) => sub.stripeSubscriptionId === stripeSubscriptionId) || null;
}

// Get subscriptions by customer email
export function getSubscriptionsByEmail(email: string): Subscription[] {
  const subscriptions = getAllSubscriptions();
  return subscriptions.filter((sub) => sub.customer.email.toLowerCase() === email.toLowerCase());
}

// Get subscriptions by Stripe customer ID
export function getSubscriptionsByCustomerId(stripeCustomerId: string): Subscription[] {
  const subscriptions = getAllSubscriptions();
  return subscriptions.filter((sub) => sub.stripeCustomerId === stripeCustomerId);
}

// Get all subscriptions
export function getAllSubscriptions(): Subscription[] {
  ensureSubscriptionsDir();
  const files = fs.readdirSync(SUBSCRIPTIONS_DIR).filter((f) => f.endsWith(".json"));

  const subscriptions: Subscription[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(SUBSCRIPTIONS_DIR, file), "utf-8");
      subscriptions.push(JSON.parse(content));
    } catch {
      // Skip invalid files
    }
  }

  // Sort by date, newest first
  return subscriptions.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Get subscriptions for a specific product
export function getSubscriptionsByProduct(productSlug: string): Subscription[] {
  const subscriptions = getAllSubscriptions();
  return subscriptions.filter((sub) => sub.productSlug === productSlug);
}

// Update a subscription
export function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Subscription | null {
  const subscription = getSubscription(subscriptionId);
  if (!subscription) return null;

  const updatedSubscription: Subscription = {
    ...subscription,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveSubscription(updatedSubscription);
  return updatedSubscription;
}

// Get subscription statistics
export function getSubscriptionStats() {
  const subscriptions = getAllSubscriptions();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active" || sub.status === "trialing");
  const recentCancellations = subscriptions.filter(
    (sub) => sub.status === "canceled" && sub.canceledAt && new Date(sub.canceledAt) >= thirtyDaysAgo
  );

  // Calculate Monthly Recurring Revenue (MRR)
  // Normalize all subscriptions to monthly amounts
  const mrr = activeSubscriptions.reduce((total, sub) => {
    const monthlyAmount = sub.interval === "year"
      ? sub.amount / (12 * sub.intervalCount)
      : sub.amount / sub.intervalCount;
    return total + monthlyAmount;
  }, 0);

  // Calculate Annual Recurring Revenue (ARR)
  const arr = mrr * 12;

  return {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: activeSubscriptions.length,
    trialingSubscriptions: subscriptions.filter((sub) => sub.status === "trialing").length,
    canceledSubscriptions: subscriptions.filter((sub) => sub.status === "canceled").length,
    pastDueSubscriptions: subscriptions.filter((sub) => sub.status === "past_due").length,
    recentCancellations: recentCancellations.length,
    mrr: Math.round(mrr), // Monthly recurring revenue in cents
    arr: Math.round(arr), // Annual recurring revenue in cents
    subscriptionsByStatus: {
      active: subscriptions.filter((sub) => sub.status === "active").length,
      trialing: subscriptions.filter((sub) => sub.status === "trialing").length,
      past_due: subscriptions.filter((sub) => sub.status === "past_due").length,
      canceled: subscriptions.filter((sub) => sub.status === "canceled").length,
      paused: subscriptions.filter((sub) => sub.status === "paused").length,
    },
  };
}

// Format price from cents to dollars
export function formatSubscriptionAmount(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(cents / 100);
}

// Export subscriptions to CSV format
export function exportSubscriptionsToCSV(subscriptions: Subscription[]): string {
  const headers = [
    "Subscription ID",
    "Status",
    "Customer Email",
    "Customer Name",
    "Product",
    "Product Slug",
    "Amount",
    "Currency",
    "Interval",
    "Interval Count",
    "Current Period Start",
    "Current Period End",
    "Trial End",
    "Canceled At",
    "Created At",
  ];

  const rows: string[][] = [];

  for (const sub of subscriptions) {
    rows.push([
      sub.id,
      sub.status,
      sub.customer.email,
      sub.customer.name || "",
      sub.productName,
      sub.productSlug,
      (sub.amount / 100).toFixed(2),
      sub.currency,
      sub.interval,
      sub.intervalCount.toString(),
      sub.currentPeriodStart,
      sub.currentPeriodEnd,
      sub.trialEnd || "",
      sub.canceledAt || "",
      sub.createdAt,
    ]);
  }

  const escapeCSV = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return csvContent;
}
