import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, Image, Upload, Folder } from "lucide-react";

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
              <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            </div>
            <div className="text-sm text-gray-500">
              {files.length} files
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Folder className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Media Storage</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Media files are stored in the <code className="bg-blue-100 px-1 rounded">/public/uploads</code> and{" "}
                  <code className="bg-blue-100 px-1 rounded">/public/images</code> directories.
                  To add files, place them directly in these folders or use the upload feature below.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Upload Files</h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-400">
                Upload feature coming soon. For now, add files directly to <code>/public/uploads</code>
              </p>
            </div>
          </div>

          {/* Image Grid */}
          {images.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No media files yet</h2>
              <p className="text-gray-600">
                Add images to <code className="bg-gray-100 px-1 rounded">/public/uploads</code> or{" "}
                <code className="bg-gray-100 px-1 rounded">/public/images</code>
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Images ({images.length})</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                {images.map((file) => (
                  <div
                    key={file.url}
                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                      <p className="text-white text-xs text-center truncate w-full mb-1">{file.name}</p>
                      <p className="text-white/70 text-xs">{formatFileSize(file.size)}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.url);
                        }}
                        className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded transition-colors"
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
