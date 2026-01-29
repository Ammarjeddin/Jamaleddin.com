import fs from "fs";
import path from "path";

export interface OrderItem {
  productSlug: string;
  productName: string;
  productType: "physical" | "digital" | "service";
  quantity: number;
  unitPrice: number; // in cents
  totalPrice: number; // in cents
  sku?: string;
}

export interface OrderCustomer {
  email: string;
  name?: string;
  phone?: string;
}

export interface OrderShipping {
  name?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface Order {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  status: "pending" | "paid" | "fulfilled" | "refunded" | "cancelled";
  customer: OrderCustomer;
  items: OrderItem[];
  shipping?: OrderShipping;
  subtotal: number; // in cents
  total: number; // in cents
  currency: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  metadata?: Record<string, string>;
}

const ORDERS_DIR = path.join(process.cwd(), "content/orders");

// Ensure orders directory exists
function ensureOrdersDir() {
  if (!fs.existsSync(ORDERS_DIR)) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
  }
}

// Generate a unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Save an order to file
export function saveOrder(order: Order): void {
  ensureOrdersDir();
  const filePath = path.join(ORDERS_DIR, `${order.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(order, null, 2));
}

// Get a single order by ID
export function getOrder(orderId: string): Order | null {
  const filePath = path.join(ORDERS_DIR, `${orderId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// Get order by Stripe session ID
export function getOrderBySessionId(sessionId: string): Order | null {
  const orders = getAllOrders();
  return orders.find((order) => order.stripeSessionId === sessionId) || null;
}

// Get all orders
export function getAllOrders(): Order[] {
  ensureOrdersDir();
  const files = fs.readdirSync(ORDERS_DIR).filter((f) => f.endsWith(".json"));

  const orders: Order[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(ORDERS_DIR, file), "utf-8");
      orders.push(JSON.parse(content));
    } catch {
      // Skip invalid files
    }
  }

  // Sort by date, newest first
  return orders.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Get orders for a specific product
export function getOrdersByProduct(productSlug: string): Order[] {
  const orders = getAllOrders();
  return orders.filter((order) =>
    order.items.some((item) => item.productSlug === productSlug)
  );
}

// Update an order
export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const order = getOrder(orderId);
  if (!order) return null;

  const updatedOrder: Order = {
    ...order,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveOrder(updatedOrder);
  return updatedOrder;
}

// Get order statistics
export function getOrderStats() {
  const orders = getAllOrders();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentOrders = orders.filter(
    (order) => new Date(order.createdAt) >= thirtyDaysAgo
  );

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, order) => sum + order.total, 0);

  const recentRevenue = recentOrders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, order) => sum + order.total, 0);

  const paidOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "fulfilled"
  );

  return {
    totalOrders: orders.length,
    recentOrders: recentOrders.length,
    totalRevenue,
    recentRevenue,
    averageOrderValue: paidOrders.length > 0
      ? Math.round(totalRevenue / paidOrders.length)
      : 0,
    ordersByStatus: {
      pending: orders.filter((o) => o.status === "pending").length,
      paid: orders.filter((o) => o.status === "paid").length,
      fulfilled: orders.filter((o) => o.status === "fulfilled").length,
      refunded: orders.filter((o) => o.status === "refunded").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    },
  };
}

// Format price from cents to dollars
export function formatOrderPrice(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(cents / 100);
}

// Export orders to CSV format
export function exportOrdersToCSV(orders: Order[]): string {
  const headers = [
    "Order ID",
    "Date",
    "Status",
    "Customer Email",
    "Customer Name",
    "Product",
    "Product Slug",
    "Quantity",
    "Unit Price",
    "Line Total",
    "Order Total",
    "Currency",
    "Shipping Name",
    "Shipping Address",
    "Shipping City",
    "Shipping State",
    "Shipping Postal Code",
    "Shipping Country",
  ];

  const rows: string[][] = [];

  for (const order of orders) {
    for (const item of order.items) {
      rows.push([
        order.id,
        new Date(order.createdAt).toISOString(),
        order.status,
        order.customer.email,
        order.customer.name || "",
        item.productName,
        item.productSlug,
        item.quantity.toString(),
        (item.unitPrice / 100).toFixed(2),
        (item.totalPrice / 100).toFixed(2),
        (order.total / 100).toFixed(2),
        order.currency,
        order.shipping?.name || "",
        order.shipping?.address?.line1 || "",
        order.shipping?.address?.city || "",
        order.shipping?.address?.state || "",
        order.shipping?.address?.postalCode || "",
        order.shipping?.address?.country || "",
      ]);
    }
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
