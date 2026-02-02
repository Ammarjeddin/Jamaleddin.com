import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, Image, Upload, Folder, Info } from "lucide-react";

export const metadata = {
  title: "Media Library - Admin Dashboard",
  description: "Manage your media files.",
};

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

interface MediaFile {
  name: string;
  path: string;
  type: "image" | "file";
  size: number;
  url: string;
}

function getMediaFiles(): MediaFile[] {
  const publicDir = path.join(process.cwd(), "public");
  const uploadsDir = path.join(publicDir, "uploads");
  const imagesDir = path.join(publicDir, "images");

  const files: MediaFile[] = [];

  // Scan uploads directory
  if (fs.existsSync(uploadsDir)) {
    scanDirectory(uploadsDir, "/uploads", files);
  }

  // Scan images directory
  if (fs.existsSync(imagesDir)) {
    scanDirectory(imagesDir, "/images", files);
  }

  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function scanDirectory(dir: string, urlPrefix: string, files: MediaFile[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      const filePath = path.join(dir, entry.name);
      const stats = fs.statSync(filePath);
      const ext = path.extname(entry.name).toLowerCase();
      const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext);

      files.push({
        name: entry.name,
        path: filePath,
        type: isImage ? "image" : "file",
        size: stats.size,
        url: `${urlPrefix}/${entry.name}`,
      });
    } else if (entry.isDirectory()) {
      scanDirectory(path.join(dir, entry.name), `${urlPrefix}/${entry.name}`, files);
    }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default async function MediaLibraryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/media");
  }

  const files = getMediaFiles();
  const images = files.filter((f) => f.type === "image");

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
              <h1 className="text-xl font-semibold text-zinc-100">Media Library</h1>
            </div>
            <div className="text-sm text-zinc-500">
              {files.length} files
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Info Box */}
          <div className="dashboard-card rounded-xl p-4 mb-8 border-l-4 border-l-[var(--color-accent)]">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-zinc-100">Media Storage</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Media files are stored in <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">/public/uploads</code> and{" "}
                  <code className="bg-[var(--color-surface-elevated)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-xs">/public/images</code> directories.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="dashboard-card rounded-xl p-8 mb-8 border-2 border-dashed border-[var(--color-border)]">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-7 h-7 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-medium text-zinc-100 mb-2">Upload Files</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-zinc-600">
                Upload feature coming soon. For now, add files directly to <code className="text-[var(--color-accent)]">/public/uploads</code>
              </p>
            </div>
          </div>

          {/* Image Grid */}
          {images.length === 0 ? (
            <div className="dashboard-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">No media files yet</h2>
              <p className="text-zinc-400">
                Add images to <code className="text-[var(--color-accent)]">/public/uploads</code> or{" "}
                <code className="text-[var(--color-accent)]">/public/images</code>
              </p>
            </div>
          ) : (
            <div className="dashboard-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-[var(--color-border)]">
                <h2 className="font-semibold text-zinc-100">Images ({images.length})</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {images.map((file) => (
                  <div
                    key={file.url}
                    className="group relative aspect-square bg-[var(--color-surface-elevated)] rounded-lg overflow-hidden border border-[var(--color-border)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-zinc-100 text-xs text-center truncate w-full mb-1">{file.name}</p>
                      <p className="text-zinc-400 text-xs">{formatFileSize(file.size)}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.url);
                        }}
                        className="mt-2 px-3 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-black text-xs font-medium rounded transition-colors"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
