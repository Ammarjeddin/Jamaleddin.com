"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileEdit,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  Settings,
  ShoppingBag,
  Home,
  Layout,
} from "lucide-react";

interface DraftInfo {
  filePath: string;
  collection: string;
  slug: string;
  title?: string;
  draftModified: string;
  liveModified?: string;
  hasDraft: boolean;
  hasLive: boolean;
}

const COLLECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pages: FileText,
  settings: Settings,
  products: ShoppingBag,
  home: Home,
  programs: Layout,
};

const COLLECTION_LABELS: Record<string, string> = {
  pages: "Pages",
  settings: "Settings",
  products: "Products",
  home: "Homepage",
  programs: "Programs",
};

export default function PublishPage() {
  const [drafts, setDrafts] = useState<DraftInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishingFile, setPublishingFile] = useState<string | null>(null);
  const [discardingFile, setDiscardingFile] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: string[];
  } | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/drafts");
      const data = await response.json();
      if (response.ok) {
        setDrafts(data.drafts || []);
      }
    } catch (err) {
      console.error("Error fetching drafts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handlePublishAll = async () => {
    setPublishing(true);
    setResult(null);

    try {
      const response = await fetch("/api/content/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish-all" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to publish",
        });
      } else {
        const publishedCount = data.published?.length || 0;
        const failedCount = data.failed?.length || 0;

        if (failedCount > 0) {
          setResult({
            success: false,
            message: `Published ${publishedCount} files, but ${failedCount} failed`,
            details: data.failed,
          });
        } else {
          setResult({
            success: true,
            message:
              publishedCount > 0
                ? `Successfully published ${publishedCount} changes!`
                : "No drafts to publish",
          });
        }

        // Refresh drafts list
        fetchDrafts();
      }
    } catch (err) {
      setResult({
        success: false,
        message: "An error occurred while publishing",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handlePublishSingle = async (filePath: string) => {
    setPublishingFile(filePath);
    setResult(null);

    try {
      const response = await fetch("/api/content/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", filePath }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to publish",
        });
      } else {
        setResult({
          success: true,
          message: "Draft published successfully!",
        });
        fetchDrafts();
      }
    } catch (err) {
      setResult({
        success: false,
        message: "An error occurred while publishing",
      });
    } finally {
      setPublishingFile(null);
    }
  };

  const handleDiscardDraft = async (filePath: string) => {
    if (!confirm("Are you sure you want to discard this draft? This cannot be undone.")) {
      return;
    }

    setDiscardingFile(filePath);
    setResult(null);

    try {
      const response = await fetch("/api/content/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "discard", filePath }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to discard draft",
        });
      } else {
        setResult({
          success: true,
          message: "Draft discarded",
        });
        fetchDrafts();
      }
    } catch (err) {
      setResult({
        success: false,
        message: "An error occurred while discarding",
      });
    } finally {
      setDiscardingFile(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getEditLink = (draft: DraftInfo) => {
    if (draft.collection === "home") {
      return `/dashboard/edit?collection=home&slug=index`;
    }
    if (draft.collection === "settings") {
      return `/dashboard/edit?collection=settings&slug=site`;
    }
    if (draft.collection === "products") {
      return `/dashboard/edit?collection=products&slug=${draft.slug}`;
    }
    return `/dashboard/edit?collection=${draft.collection}&slug=${draft.slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-2xl font-bold text-gray-900">Publish Changes</h1>
            </div>
            <button
              onClick={fetchDrafts}
              disabled={loading}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileEdit className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Draft & Publish Workflow
                  </h2>
                  <p className="text-gray-600 mt-1">
                    When you save content as a <strong>draft</strong>, changes are stored
                    separately and won&apos;t appear on your live site. Review your changes
                    below and publish when you&apos;re ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`rounded-xl p-6 ${
                  result.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${
                        result.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.success ? "Success" : "Error"}
                    </h3>
                    <p
                      className={`mt-1 ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.message}
                    </p>
                    {result.details && result.details.length > 0 && (
                      <ul className="mt-2 text-sm list-disc list-inside text-red-600">
                        {result.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Drafts */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Pending Changes</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {drafts.length === 0
                        ? "No pending drafts"
                        : `${drafts.length} draft${drafts.length !== 1 ? "s" : ""} awaiting publication`}
                    </p>
                  </div>
                  {drafts.length > 0 && (
                    <button
                      onClick={handlePublishAll}
                      disabled={publishing}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {publishing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Publish All
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  <p className="text-gray-500 mt-2">Loading drafts...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    All changes published
                  </h4>
                  <p className="text-gray-500">
                    Your site is up to date. No pending drafts to publish.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {drafts.map((draft) => {
                    const IconComponent =
                      COLLECTION_ICONS[draft.collection] || FileText;
                    const collectionLabel =
                      COLLECTION_LABELS[draft.collection] || draft.collection;

                    return (
                      <div
                        key={draft.filePath}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {draft.title || draft.slug}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {collectionLabel}
                                </span>
                                {!draft.hasLive && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                Modified {formatDate(draft.draftModified)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={getEditLink(draft)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDiscardDraft(draft.filePath)}
                              disabled={discardingFile === draft.filePath}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Discard draft"
                            >
                              {discardingFile === draft.filePath ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handlePublishSingle(draft.filePath)}
                              disabled={publishingFile === draft.filePath}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {publishingFile === draft.filePath ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              Publish
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    1
                  </div>
                  <p>
                    <strong>Save as Draft</strong> — When editing content, click
                    &quot;Save Draft&quot; to save your changes without making them live.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    2
                  </div>
                  <p>
                    <strong>Review Changes</strong> — All your drafts appear on this
                    page. You can review, edit, or discard them.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                    3
                  </div>
                  <p>
                    <strong>Publish</strong> — When ready, publish individual
                    changes or all at once to make them live on your site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
