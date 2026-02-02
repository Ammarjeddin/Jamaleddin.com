"use client";

import { useState, useEffect } from "react";
import { Rocket, Loader2, Check, AlertCircle, GitCommit } from "lucide-react";

interface PendingChange {
  sha: string;
  message: string;
  date: string;
  author: string;
}

interface DeployStatus {
  configured: boolean;
  pendingChanges?: PendingChange[];
  hasPendingChanges?: boolean;
  error?: string;
}

export function DeployButton() {
  const [status, setStatus] = useState<DeployStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showChanges, setShowChanges] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/deploy");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ configured: false, error: "Failed to check deploy status" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleDeploy = async () => {
    if (deploying) return;

    setDeploying(true);
    setDeployResult(null);

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setDeployResult({ success: true, message: data.message });
        // Refresh status after deploy
        await fetchStatus();
      } else {
        setDeployResult({
          success: false,
          message: data.error || "Deployment failed",
        });
      }
    } catch (error) {
      setDeployResult({
        success: false,
        message: "Network error - please try again",
      });
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="bg-gray-100 text-gray-400 font-medium py-2 px-6 rounded-lg flex items-center gap-2"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Checking...
      </button>
    );
  }

  if (!status?.configured) {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">GitHub not configured</span>
      </div>
    );
  }

  const pendingCount = status.pendingChanges?.length || 0;

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        {pendingCount > 0 && (
          <button
            onClick={() => setShowChanges(!showChanges)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <GitCommit className="w-4 h-4" />
            {pendingCount} pending change{pendingCount !== 1 ? "s" : ""}
          </button>
        )}
        <button
          onClick={handleDeploy}
          disabled={deploying || pendingCount === 0}
          className={`font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-colors ${
            pendingCount === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : deploying
              ? "bg-emerald-400 text-white cursor-wait"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {deploying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deploying...
            </>
          ) : pendingCount === 0 ? (
            <>
              <Check className="w-4 h-4" />
              Up to Date
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Deploy to Live
            </>
          )}
        </button>
      </div>

      {/* Deploy result message */}
      {deployResult && (
        <div
          className={`text-sm flex items-center gap-1 ${
            deployResult.success ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {deployResult.success ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {deployResult.message}
        </div>
      )}

      {/* Pending changes list */}
      {showChanges && status.pendingChanges && status.pendingChanges.length > 0 && (
        <div className="w-full mt-4 bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Changes to deploy:
          </h5>
          <ul className="space-y-2">
            {status.pendingChanges.map((change) => (
              <li
                key={change.sha}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <code className="text-xs bg-gray-200 px-1 rounded">
                  {change.sha}
                </code>
                <span className="flex-1">{change.message}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(change.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
