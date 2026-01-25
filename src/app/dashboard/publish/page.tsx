"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  Loader2,
  GitBranch,
  ExternalLink,
} from "lucide-react";

interface PublishStatus {
  hasGitHub: boolean;
  previewUrl?: string;
  lastPublished?: string;
}

export default function PublishPage() {
  const router = useRouter();
  const [status, setStatus] = useState<PublishStatus | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Check if GitHub is configured
    // For now, we'll assume it's not configured in development
    setStatus({
      hasGitHub: false,
      previewUrl: undefined,
      lastPublished: undefined,
    });
  }, []);

  const handlePublish = async () => {
    setPublishing(true);
    setResult(null);

    try {
      const response = await fetch("/api/content/publish", {
        method: "POST",
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
          message: "Changes published successfully!",
        });
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
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GitBranch className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">Publishing Workflow</h2>
                  <p className="text-gray-600 mt-1">
                    When you save content changes, they are saved to the <strong>draft</strong> branch.
                    Publishing merges those changes to the <strong>main</strong> branch, triggering a
                    new deployment.
                  </p>
                </div>
              </div>
            </div>

            {/* GitHub Status */}
            {status && !status.hasGitHub && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">GitHub Not Configured</h3>
                    <p className="text-yellow-700 mt-1">
                      To enable the full draft/publish workflow, configure the following environment variables:
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-yellow-700 font-mono">
                      <li>GITHUB_TOKEN</li>
                      <li>GITHUB_OWNER</li>
                      <li>GITHUB_REPO</li>
                    </ul>
                    <p className="text-yellow-700 mt-3">
                      Without GitHub integration, changes are saved locally only and will be included
                      in your next git commit.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                      {result.success ? "Published!" : "Error"}
                    </h3>
                    <p
                      className={`mt-1 ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Publish Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Ready to publish?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {status?.hasGitHub
                      ? "This will merge your draft changes to the main branch."
                      : "GitHub is not configured. Commit your changes manually."}
                  </p>
                </div>
                <button
                  onClick={handlePublish}
                  disabled={publishing || !status?.hasGitHub}
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
                      Publish to Live
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Link */}
            {status?.previewUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Preview Deployment</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      View your draft changes on the preview URL
                    </p>
                  </div>
                  <a
                    href={status.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open Preview
                  </a>
                </div>
              </div>
            )}

            {/* Manual Workflow Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Manual Workflow</h3>
              <p className="text-sm text-gray-600 mb-4">
                If GitHub integration is not configured, use these git commands to publish:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                <div className="text-gray-400"># Stage and commit your changes</div>
                <div>git add content/</div>
                <div>git commit -m &quot;Update content&quot;</div>
                <div className="mt-2 text-gray-400"># Push to trigger deployment</div>
                <div>git push origin main</div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
