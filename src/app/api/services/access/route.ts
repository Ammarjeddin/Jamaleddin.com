import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Access code is required" }, { status: 400 });
  }

  // The code is the product slug
  const product = await getProduct(code);

  if (!product) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Only return if the product is unlisted and active
  if (!product.unlisted) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 404 });
  }

  if (product.status !== "active") {
    return NextResponse.json({ error: "This service is not available" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
