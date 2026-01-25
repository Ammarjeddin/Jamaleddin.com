/**
 * GitHub API client for content management
 * Supports draft branch workflow: edit → draft branch → preview → publish to main
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_API = "https://api.github.com";

export interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

export interface CommitResult {
  success: boolean;
  sha?: string;
  error?: string;
}

// Check if GitHub is configured
export function isGitHubConfigured(): boolean {
  return !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

// Get file from GitHub
export async function getFileFromGitHub(
  filePath: string,
  branch: string = "main"
): Promise<{ content: string; sha: string } | null> {
  if (!isGitHubConfigured()) {
    return null;
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return { content, sha: data.sha };
  } catch (error) {
    console.error("Error fetching file from GitHub:", error);
    return null;
  }
}

// Create or update file on GitHub
export async function saveFileToGitHub(
  filePath: string,
  content: string,
  message: string,
  branch: string = "draft",
  sha?: string
): Promise<CommitResult> {
  if (!isGitHubConfigured()) {
    return { success: false, error: "GitHub not configured" };
  }

  try {
    // Ensure branch exists
    await ensureBranchExists(branch);

    // Get current file SHA if not provided (needed for updates)
    let currentSha = sha;
    if (!currentSha) {
      const existing = await getFileFromGitHub(filePath, branch);
      currentSha = existing?.sha;
    }

    const body: Record<string, unknown> = {
      message,
      content: Buffer.from(content).toString("base64"),
      branch,
    };

    if (currentSha) {
      body.sha = currentSha;
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, sha: data.content.sha };
  } catch (error) {
    console.error("Error saving file to GitHub:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Ensure a branch exists (create from main if not)
export async function ensureBranchExists(branch: string): Promise<boolean> {
  if (!isGitHubConfigured() || branch === "main") {
    return true;
  }

  try {
    // Check if branch exists
    const checkResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${branch}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (checkResponse.ok) {
      return true;
    }

    // Get main branch SHA
    const mainResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/main`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!mainResponse.ok) {
      throw new Error("Could not get main branch");
    }

    const mainData = await mainResponse.json();

    // Create new branch
    const createResponse = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: `refs/heads/${branch}`,
          sha: mainData.object.sha,
        }),
      }
    );

    return createResponse.ok;
  } catch (error) {
    console.error("Error ensuring branch exists:", error);
    return false;
  }
}

// Merge draft branch to main (publish)
export async function publishDraftToMain(): Promise<CommitResult> {
  if (!isGitHubConfigured()) {
    return { success: false, error: "GitHub not configured" };
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/merges`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base: "main",
          head: "draft",
          commit_message: "Publish content changes from draft",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, sha: data.sha };
  } catch (error) {
    console.error("Error publishing draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get list of files in a directory from GitHub
export async function listFilesInDirectory(
  dirPath: string,
  branch: string = "main"
): Promise<string[]> {
  if (!isGitHubConfigured()) {
    return [];
  }

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dirPath}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.filter((item: { type: string }) => item.type === "file")
      .map((item: { name: string }) => item.name);
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
}

// Delete file from GitHub
export async function deleteFileFromGitHub(
  filePath: string,
  message: string,
  branch: string = "draft"
): Promise<CommitResult> {
  if (!isGitHubConfigured()) {
    return { success: false, error: "GitHub not configured" };
  }

  try {
    // Get current file SHA
    const existing = await getFileFromGitHub(filePath, branch);
    if (!existing) {
      return { success: false, error: "File not found" };
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sha: existing.sha,
          branch,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
