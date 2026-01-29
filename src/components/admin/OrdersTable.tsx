"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  ExternalLink,
  Mail,
  Package,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { Order } from "@/lib/orders";

interface OrdersTableProps {
  orders: Order[];
}

type SortField = "date" | "total" | "status" | "customer";
type SortDirection = "asc" | "desc";

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  fulfilled: "bg-blue-100 text-blue-800",
  refunded: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Get unique products for filter dropdown
  const uniqueProducts = useMemo(() => {
    const products = new Map<string, string>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        products.set(item.productSlug, item.productName);
      });
    });
    return Array.from(products.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [orders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.customer.name?.toLowerCase().includes(query) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(query)
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Product filter
    if (productFilter !== "all") {
      result = result.filter((order) =>
        order.items.some((item) => item.productSlug === productFilter)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "customer":
          comparison = (a.customer.email || "").localeCompare(b.customer.email || "");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [orders, searchQuery, statusFilter, productFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatPrice = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Build export data for all export formats
  const buildExportData = () => {
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

    const rows: (string | number)[][] = [];

    for (const order of filteredOrders) {
      for (const item of order.items) {
        rows.push([
          order.id,
          new Date(order.createdAt).toISOString(),
          order.status,
          order.customer.email,
          order.customer.name || "",
          item.productName,
          item.productSlug,
          item.quantity,
          item.unitPrice / 100,
          item.totalPrice / 100,
          order.total / 100,
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

    return { headers, rows };
  };

  // Generate filename based on filters
  const getExportFilename = (extension: string) => {
    let filename = "orders";
    if (productFilter !== "all") {
      filename += `-${productFilter}`;
    }
    if (statusFilter !== "all") {
      filename += `-${statusFilter}`;
    }
    filename += `-${new Date().toISOString().split("T")[0]}.${extension}`;
    return filename;
  };

  // Export to XLSX format
  const exportToXLSX = () => {
    const { headers, rows } = buildExportData();

    // Create worksheet data with headers
    const wsData = [headers, ...rows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readability
    ws["!cols"] = [
      { wch: 20 }, // Order ID
      { wch: 25 }, // Date
      { wch: 10 }, // Status
      { wch: 30 }, // Email
      { wch: 20 }, // Name
      { wch: 30 }, // Product
      { wch: 20 }, // Slug
      { wch: 10 }, // Quantity
      { wch: 12 }, // Unit Price
      { wch: 12 }, // Line Total
      { wch: 12 }, // Order Total
      { wch: 10 }, // Currency
      { wch: 20 }, // Shipping Name
      { wch: 30 }, // Shipping Address
      { wch: 15 }, // City
      { wch: 15 }, // State
      { wch: 12 }, // Postal Code
      { wch: 15 }, // Country
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate and download file
    XLSX.writeFile(wb, getExportFilename("xlsx"));
  };

  // Export to Google Sheets (opens in new tab)
  const exportToGoogleSheets = () => {
    const { headers, rows } = buildExportData();

    // Create CSV content for Google Sheets import
    const escapeCSV = (value: string | number) => {
      const strValue = String(value);
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Create a blob and get data URL
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary download link first so user has the data
    const downloadLink = document.createElement("a");
    const downloadUrl = URL.createObjectURL(blob);
    downloadLink.setAttribute("href", downloadUrl);
    downloadLink.setAttribute("download", getExportFilename("csv"));
    downloadLink.style.visibility = "hidden";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Open Google Sheets with import instructions
    // Google Sheets can import CSV files directly
    const googleSheetsUrl = "https://docs.google.com/spreadsheets/create";
    window.open(googleSheetsUrl, "_blank");

    // Show a helpful alert
    setTimeout(() => {
      alert(
        "A CSV file has been downloaded and Google Sheets has been opened.\n\n" +
        "To import your orders:\n" +
        "1. In Google Sheets, go to File → Import\n" +
        "2. Select 'Upload' and choose the downloaded file\n" +
        "3. Click 'Import data'\n\n" +
        "Your orders will be added to the spreadsheet!"
      );
    }, 500);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "all")}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Products</option>
            {uniqueProducts.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToXLSX}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              title="Download as Excel file"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">XLSX</span>
            </button>
            <button
              onClick={exportToGoogleSheets}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              title="Export to Google Sheets"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="hidden sm:inline">Google Sheets</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(statusFilter !== "all" || productFilter !== "all" || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {productFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Product: {uniqueProducts.find(([slug]) => slug === productFilter)?.[1]}
                <button onClick={() => setProductFilter("all")} className="hover:text-blue-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setProductFilter("all");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Order
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("customer")}
              >
                <div className="flex items-center gap-1">
                  Customer
                  <SortIcon field="customer" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center gap-1">
                  Total
                  <SortIcon field="total" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <>
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-gray-900">{order.customer.name || "—"}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {formatPrice(order.total, order.currency)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${order.customer.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Email customer"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      {order.stripeSessionId && (
                        <a
                          href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId || order.stripeSessionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="View in Stripe"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <tr key={`${order.id}-details`}>
                    <td colSpan={6} className="px-4 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">{item.productName}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.productSlug} • {item.quantity} × {formatPrice(item.unitPrice, order.currency)}
                                  </p>
                                </div>
                                <p className="font-medium text-gray-900">
                                  {formatPrice(item.totalPrice, order.currency)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Info */}
                        {order.shipping && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                              {order.shipping.name && (
                                <p className="text-gray-900">{order.shipping.name}</p>
                              )}
                              {order.shipping.address && (
                                <div className="text-gray-600 text-sm">
                                  {order.shipping.address.line1 && (
                                    <p>{order.shipping.address.line1}</p>
                                  )}
                                  {order.shipping.address.line2 && (
                                    <p>{order.shipping.address.line2}</p>
                                  )}
                                  <p>
                                    {[
                                      order.shipping.address.city,
                                      order.shipping.address.state,
                                      order.shipping.address.postalCode,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                  {order.shipping.address.country && (
                                    <p>{order.shipping.address.country}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Subtotal</span>
                              <span>{formatPrice(order.subtotal, order.currency)}</span>
                            </div>
                            <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
                              <span>Total</span>
                              <span>{formatPrice(order.total, order.currency)}</span>
                            </div>
                            {order.stripeSessionId && (
                              <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                                Stripe Session: {order.stripeSessionId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No orders match your filters.
        </div>
      )}
    </div>
  );
}
