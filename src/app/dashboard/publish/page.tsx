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
  Info,
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
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
        <Container>
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="h-5 w-px bg-[var(--color-border)]" />
              <h1 className="text-xl font-semibold text-zinc-100">Publish Changes</h1>
            </div>
            <button
              onClick={fetchDrafts}
              disabled={loading}
              className="flex items-center gap-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Info Card */}
            <div className="dashboard-card rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl icon-container-emerald flex items-center justify-center flex-shrink-0">
                  <FileEdit className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-100">
                    Draft & Publish Workflow
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    When you save content as a <strong className="text-zinc-200">draft</strong>, changes are stored
                    separately and won&apos;t appear on your live site. Review your changes
                    below and publish when you&apos;re ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`rounded-xl p-5 ${
                  result.success
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${
                        result.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.success ? "Success" : "Error"}
                    </h3>
                    <p
                      className={`mt-1 ${
                        result.success ? "text-green-300/80" : "text-red-300/80"
                      }`}
                    >
                      {result.message}
                    </p>
                    {result.details && result.details.length > 0 && (
                      <ul className="mt-2 text-sm list-disc list-inside text-red-300/70">
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
            <div className="dashboard-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-100">Pending Changes</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      {drafts.length === 0
                        ? "No pending drafts"
                        : `${drafts.length} draft${drafts.length !== 1 ? "s" : ""} awaiting publication`}
                    </p>
                  </div>
                  {drafts.length > 0 && (
                    <button
                      onClick={handlePublishAll}
                      disabled={publishing}
                      className="flex items-center gap-2 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mx-auto" />
                  <p className="text-zinc-500 mt-2">Loading drafts...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[var(--color-accent)]" />
                  </div>
                  <h4 className="text-lg font-medium text-zinc-100 mb-2">
                    All changes published
                  </h4>
                  <p className="text-zinc-500">
                    Your site is up to date. No pending drafts to publish.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {drafts.map((draft) => {
                    const IconComponent =
                      COLLECTION_ICONS[draft.collection] || FileText;
                    const collectionLabel =
                      COLLECTION_LABELS[draft.collection] || draft.collection;

                    return (
                      <div
                        key={draft.filePath}
                        className="p-4 hover:bg-[var(--color-surface-elevated)] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl icon-container-blue flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-100">
                                  {draft.title || draft.slug}
                                </span>
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                                  {collectionLabel}
                                </span>
                                {!draft.hasLive && (
                                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-500">
                                Modified {formatDate(draft.draftModified)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={getEditLink(draft)}
                              className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDiscardDraft(draft.filePath)}
                              disabled={discardingFile === draft.filePath}
                              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
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
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-lg transition-colors disabled:opacity-50 border border-emerald-500/20"
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
            <div className="dashboard-card rounded-xl p-5 border-l-4 border-l-[var(--color-accent)]">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-zinc-100">How it works</h3>
              </div>
              <div className="space-y-3 text-sm text-zinc-400 ml-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border border-[var(--color-accent)]/20">
                    1
                  </div>
                  <p>
                    <strong className="text-zinc-200">Save as Draft</strong> — When editing content, click
                    &quot;Save Draft&quot; to save your changes without making them live.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border border-[var(--color-accent)]/20">
                    2
                  </div>
                  <p>
                    <strong className="text-zinc-200">Review Changes</strong> — All your drafts appear on this
                    page. You can review, edit, or discard them.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border border-[var(--color-accent)]/20">
                    3
                  </div>
                  <p>
                    <strong className="text-zinc-200">Publish</strong> — When ready, publish individual
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
