import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

interface PortalRequestBody {
  email: string;
  returnUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PortalRequestBody = await request.json();
    const { email, returnUrl } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Look up customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (!customers.data.length) {
      return NextResponse.json(
        { error: "No subscriptions found for this email" },
        { status: 404 }
      );
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: returnUrl || `${origin}/shop`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Customer portal error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
