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
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import type { Subscription, SubscriptionStatus } from "@/lib/subscriptions";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
}

type SortField = "date" | "amount" | "status" | "customer";
type SortDirection = "asc" | "desc";

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  active: "bg-green-100 text-green-800",
  trialing: "bg-blue-100 text-blue-800",
  past_due: "bg-yellow-100 text-yellow-800",
  canceled: "bg-red-100 text-red-800",
  paused: "bg-gray-100 text-gray-800",
};

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedSubscription, setExpandedSubscription] = useState<string | null>(null);

  // Get unique products for filter dropdown
  const uniqueProducts = useMemo(() => {
    const products = new Map<string, string>();
    subscriptions.forEach((sub) => {
      products.set(sub.productSlug, sub.productName);
    });
    return Array.from(products.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [subscriptions]);

  // Filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sub) =>
          sub.id.toLowerCase().includes(query) ||
          sub.customer.email.toLowerCase().includes(query) ||
          sub.customer.name?.toLowerCase().includes(query) ||
          sub.productName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    // Product filter
    if (productFilter !== "all") {
      result = result.filter((sub) => sub.productSlug === productFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
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
  }, [subscriptions, searchQuery, statusFilter, productFilter, sortField, sortDirection]);

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
    });
  };

  const formatInterval = (interval: string, intervalCount: number) => {
    if (intervalCount === 1) {
      return interval === "month" ? "Monthly" : "Yearly";
    }
    return `Every ${intervalCount} ${interval}s`;
  };

  // Build export data for all export formats
  const buildExportData = () => {
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

    const rows: (string | number)[][] = [];

    for (const sub of filteredSubscriptions) {
      rows.push([
        sub.id,
        sub.status,
        sub.customer.email,
        sub.customer.name || "",
        sub.productName,
        sub.productSlug,
        sub.amount / 100,
        sub.currency,
        sub.interval,
        sub.intervalCount,
        sub.currentPeriodStart,
        sub.currentPeriodEnd,
        sub.trialEnd || "",
        sub.canceledAt || "",
        sub.createdAt,
      ]);
    }

    return { headers, rows };
  };

  // Generate filename based on filters
  const getExportFilename = (extension: string) => {
    let filename = "subscriptions";
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
      { wch: 25 }, // Subscription ID
      { wch: 12 }, // Status
      { wch: 30 }, // Email
      { wch: 20 }, // Name
      { wch: 30 }, // Product
      { wch: 20 }, // Slug
      { wch: 12 }, // Amount
      { wch: 10 }, // Currency
      { wch: 10 }, // Interval
      { wch: 15 }, // Interval Count
      { wch: 20 }, // Period Start
      { wch: 20 }, // Period End
      { wch: 20 }, // Trial End
      { wch: 20 }, // Canceled At
      { wch: 20 }, // Created At
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");

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
    const googleSheetsUrl = "https://docs.google.com/spreadsheets/create";
    window.open(googleSheetsUrl, "_blank");

    // Show a helpful alert
    setTimeout(() => {
      alert(
        "A CSV file has been downloaded and Google Sheets has been opened.\n\n" +
        "To import your subscriptions:\n" +
        "1. In Google Sheets, go to File -> Import\n" +
        "2. Select 'Upload' and choose the downloaded file\n" +
        "3. Click 'Import data'\n\n" +
        "Your subscriptions will be added to the spreadsheet!"
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
              placeholder="Search subscriptions, customers, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | "all")}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:text-purple-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="hover:text-purple-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {productFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                Product: {uniqueProducts.find(([slug]) => slug === productFilter)?.[1]}
                <button onClick={() => setProductFilter("all")} className="hover:text-purple-600">
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
          Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
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
                  Subscription
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
                Product
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1">
                  Amount
                  <SortIcon field="amount" />
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
            {filteredSubscriptions.map((sub) => (
              <>
                <tr
                  key={sub.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    setExpandedSubscription(expandedSubscription === sub.id ? null : sub.id)
                  }
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {expandedSubscription === sub.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{sub.id}</p>
                        <p className="text-sm text-gray-500">Started {formatDate(sub.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-gray-900">{sub.customer.name || "—"}</p>
                      <p className="text-sm text-gray-500">{sub.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-900">{sub.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatPrice(sub.amount, sub.currency)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatInterval(sub.interval, sub.intervalCount)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        STATUS_COLORS[sub.status]
                      }`}
                    >
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${sub.customer.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Email customer"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={`https://dashboard.stripe.com/subscriptions/${sub.stripeSubscriptionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View in Stripe"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedSubscription === sub.id && (
                  <tr key={`${sub.id}-details`}>
                    <td colSpan={6} className="px-4 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Billing Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Billing Details</h4>
                          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount</span>
                              <span>{formatPrice(sub.amount, sub.currency)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Billing</span>
                              <span>{formatInterval(sub.interval, sub.intervalCount)}</span>
                            </div>
                            {sub.trialEnd && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Trial Ends</span>
                                <span>{formatDate(sub.trialEnd)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Period Info */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Current Period</h4>
                          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Start</span>
                              <span>{formatDate(sub.currentPeriodStart)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">End</span>
                              <span>{formatDate(sub.currentPeriodEnd)}</span>
                            </div>
                            {sub.canceledAt && (
                              <div className="flex justify-between text-red-600">
                                <span>Canceled</span>
                                <span>{formatDate(sub.canceledAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* IDs */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">References</h4>
                          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2 text-xs">
                            <div>
                              <span className="text-gray-500">Stripe Sub ID:</span>
                              <p className="font-mono text-gray-700 break-all">{sub.stripeSubscriptionId}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Stripe Customer:</span>
                              <p className="font-mono text-gray-700 break-all">{sub.stripeCustomerId}</p>
                            </div>
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

      {filteredSubscriptions.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No subscriptions match your filters.
        </div>
      )}
    </div>
  );
}
