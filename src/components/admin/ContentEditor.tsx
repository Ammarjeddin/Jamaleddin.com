"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
} from "lucide-react";

interface ContentEditorProps {
  collection: string;
  slug: string;
  initialContent: Record<string, unknown>;
  filePath: string;
}

interface Block {
  _template: string;
  [key: string]: unknown;
}

// Block type definitions for the editor
const BLOCK_TYPES = [
  { type: "heroBanner", label: "Hero Banner", description: "Large hero section with title and CTA" },
  { type: "textBlock", label: "Text Block", description: "Rich text content section" },
  { type: "imageTextRight", label: "Image + Text (Right)", description: "Image on left, text on right" },
  { type: "imageTextLeft", label: "Image + Text (Left)", description: "Text on left, image on right" },
  { type: "cardsGrid", label: "Cards Grid", description: "Grid of feature cards" },
  { type: "stats", label: "Statistics", description: "Display key numbers and metrics" },
  { type: "testimonials", label: "Testimonials", description: "Customer quotes and reviews" },
  { type: "ctaBox", label: "Call to Action", description: "Prominent action section" },
  { type: "faq", label: "FAQ", description: "Frequently asked questions" },
  { type: "team", label: "Team Members", description: "Display team profiles" },
  { type: "timeline", label: "Timeline", description: "Chronological events or milestones" },
  { type: "video", label: "Video", description: "Embedded video section" },
  { type: "gallery", label: "Gallery", description: "Image gallery grid" },
  { type: "divider", label: "Divider", description: "Visual section separator" },
  { type: "programList", label: "Programs List", description: "Display programs collection" },
  { type: "productShowcase", label: "Products Showcase", description: "Display featured products" },
  { type: "contactForm", label: "Contact Form", description: "Contact form section" },
];

export function ContentEditor({ collection, slug, initialContent, filePath }: ContentEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set([0]));
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const blocks = (content.blocks as Block[]) || [];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content,
          commitMessage: `Update ${collection}/${slug}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = useCallback((field: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateBlock = useCallback((index: number, updates: Partial<Block>) => {
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks[index] = { ...newBlocks[index], ...updates };
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const updateBlockField = useCallback((blockIndex: number, field: string, value: unknown) => {
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks[blockIndex] = { ...newBlocks[blockIndex], [field]: value };
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const addBlock = useCallback((type: string, index: number) => {
    const newBlock: Block = { _template: type };
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[] || [])];
      newBlocks.splice(index, 0, newBlock);
      return { ...prev, blocks: newBlocks };
    });
    setExpandedBlocks((prev) => new Set([...prev, index]));
    setShowBlockPicker(false);
    setInsertIndex(null);
  }, []);

  const removeBlock = useCallback((index: number) => {
    if (!confirm("Are you sure you want to remove this block?")) return;
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks.splice(index, 1);
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const moveBlock = useCallback((from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      const [removed] = newBlocks.splice(from, 1);
      newBlocks.splice(to, 0, removed);
      return { ...prev, blocks: newBlocks };
    });
    // Update expanded state
    setExpandedBlocks((prev) => {
      const newSet = new Set<number>();
      prev.forEach((i) => {
        if (i === from) newSet.add(to);
        else if (from < to && i > from && i <= to) newSet.add(i - 1);
        else if (from > to && i >= to && i < from) newSet.add(i + 1);
        else newSet.add(i);
      });
      return newSet;
    });
  }, [blocks.length]);

  const toggleBlockExpanded = useCallback((index: number) => {
    setExpandedBlocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const collectionLabels: Record<string, string> = {
    pages: "Pages",
    programs: "Programs",
    products: "Products",
    settings: "Settings",
    home: "Homepage",
  };

  const backLink = collection === "settings" || collection === "home"
    ? "/dashboard"
    : `/dashboard/${collection}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={backLink}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {collectionLabels[collection] || "Back"}
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-900">
                {(content.title as string) || (content.name as string) || (content.siteName as string) || slug}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <span className="text-sm text-red-600">{error}</span>
              )}
              {saved && (
                <span className="text-sm text-green-600">Saved!</span>
              )}
              <a
                href={collection === "home" ? "/" : `/${collection === "settings" ? "" : collection + "/"}${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-300 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Basic Fields */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                {/* Title/Name field */}
                {("title" in content || "name" in content || "siteName" in content) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {collection === "products" ? "Name" : collection === "settings" ? "Site Name" : "Title"}
                    </label>
                    <input
                      type="text"
                      value={
                        (content.title as string) ||
                        (content.name as string) ||
                        (content.siteName as string) ||
                        ""
                      }
                      onChange={(e) => {
                        const field = collection === "products" ? "name" : collection === "settings" ? "siteName" : "title";
                        updateField(field, e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                  </div>
                )}

                {/* Description/Tagline */}
                {("description" in content || "tagline" in content) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {collection === "settings" ? "Tagline" : "Description"}
                    </label>
                    <textarea
                      value={(content.description as string) || (content.tagline as string) || ""}
                      onChange={(e) => {
                        const field = collection === "settings" ? "tagline" : "description";
                        updateField(field, e.target.value);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Blocks Editor */}
            {Array.isArray(content.blocks) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Content Blocks</h2>
                  <button
                    onClick={() => {
                      setInsertIndex(blocks.length);
                      setShowBlockPicker(true);
                    }}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Block
                  </button>
                </div>

                {blocks.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-gray-500 mb-4">No blocks yet. Add your first content block.</p>
                    <button
                      onClick={() => {
                        setInsertIndex(0);
                        setShowBlockPicker(true);
                      }}
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Block
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map((block, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Block Header */}
                        <div
                          className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                          onClick={() => toggleBlockExpanded(index)}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {BLOCK_TYPES.find((t) => t.type === block._template)?.label || block._template}
                            </span>
                            <span className="text-sm text-gray-500">#{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, index - 1);
                              }}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronUp className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, index + 1);
                              }}
                              disabled={index === blocks.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronDown className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBlock(index);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Block Content */}
                        {expandedBlocks.has(index) && (
                          <div className="p-4 border-t border-gray-200">
                            <BlockEditor
                              block={block}
                              onChange={(field, value) => updateBlockField(index, field, value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings-specific fields */}
            {collection === "settings" && (
              <SettingsEditor content={content} updateField={updateField} />
            )}

            {/* Product-specific fields */}
            {collection === "products" && (
              <ProductEditor content={content} updateField={updateField} />
            )}
          </div>
        </Container>
      </main>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Block</h3>
              <button
                onClick={() => setShowBlockPicker(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid sm:grid-cols-2 gap-3">
                {BLOCK_TYPES.map((blockType) => (
                  <button
                    key={blockType.type}
                    onClick={() => insertIndex !== null && addBlock(blockType.type, insertIndex)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">{blockType.label}</h4>
                    <p className="text-sm text-gray-500 mt-1">{blockType.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Block Editor Component
function BlockEditor({
  block,
  onChange,
}: {
  block: Block;
  onChange: (field: string, value: unknown) => void;
}) {
  const template = block._template;

  // Common fields for many block types
  const renderTextField = (field: string, label: string, multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={(block[field] as string) || ""}
          onChange={(e) => onChange(field, e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
        />
      ) : (
        <input
          type="text"
          value={(block[field] as string) || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      )}
    </div>
  );

  const renderSelectField = (field: string, label: string, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={(block[field] as string) || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  // Render fields based on block type
  switch (template) {
    case "heroBanner":
      return (
        <div className="space-y-4">
          {renderTextField("title", "Title")}
          {renderTextField("subtitle", "Subtitle")}
          {renderTextField("backgroundImage", "Background Image URL")}
          {renderTextField("buttonText", "Button Text")}
          {renderTextField("buttonLink", "Button Link")}
          {renderSelectField("height", "Height", [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "full", label: "Full Screen" },
          ])}
        </div>
      );

    case "textBlock":
      return (
        <div className="space-y-4">
          {renderTextField("heading", "Heading")}
          {renderTextField("content", "Content (HTML)", true)}
          {renderSelectField("alignment", "Alignment", [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ])}
        </div>
      );

    case "ctaBox":
      return (
        <div className="space-y-4">
          {renderTextField("heading", "Heading")}
          {renderTextField("text", "Text")}
          {renderTextField("buttonText", "Button Text")}
          {renderTextField("buttonLink", "Button Link")}
          {renderSelectField("style", "Style", [
            { value: "primary", label: "Primary" },
            { value: "secondary", label: "Secondary" },
            { value: "accent", label: "Accent" },
          ])}
        </div>
      );

    case "divider":
      return (
        <div className="space-y-4">
          {renderSelectField("style", "Style", [
            { value: "line", label: "Line" },
            { value: "dots", label: "Dots" },
            { value: "wave", label: "Wave" },
            { value: "gradient", label: "Gradient" },
          ])}
          {renderSelectField("size", "Size", [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ])}
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          {renderTextField("heading", "Heading")}
          {renderTextField("videoUrl", "Video URL (YouTube/Vimeo)")}
          {renderTextField("thumbnail", "Thumbnail Image URL")}
          {renderTextField("caption", "Caption")}
        </div>
      );

    case "imageTextRight":
    case "imageTextLeft":
      return (
        <div className="space-y-4">
          {renderTextField("heading", "Heading")}
          {renderTextField("content", "Content (HTML)", true)}
          {renderTextField("image", "Image URL")}
          {renderTextField("imageAlt", "Image Alt Text")}
          {renderTextField("buttonText", "Button Text")}
          {renderTextField("buttonLink", "Button Link")}
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Edit the raw JSON for this block type. Full visual editing coming soon.
          </p>
          <textarea
            value={JSON.stringify(block, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach((key) => {
                  if (key !== "_template") {
                    onChange(key, parsed[key]);
                  }
                });
              } catch {
                // Invalid JSON, ignore
              }
            }}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none font-mono text-sm"
          />
        </div>
      );
  }
}

// Settings Editor Component
function SettingsEditor({
  content,
  updateField,
}: {
  content: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}) {
  const theme = (content.theme as Record<string, string>) || {};
  const contact = (content.contact as Record<string, string>) || {};
  const social = (content.social as Record<string, string>) || {};

  const updateNested = (parent: string, field: string, value: string) => {
    const current = (content[parent] as Record<string, string>) || {};
    updateField(parent, { ...current, [field]: value });
  };

  return (
    <>
      {/* Theme Colors */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Colors</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { field: "primaryColor", label: "Primary Color" },
            { field: "secondaryColor", label: "Secondary Color" },
            { field: "accentColor", label: "Accent Color" },
            { field: "backgroundColor", label: "Background Color" },
            { field: "textColor", label: "Text Color" },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[field] || "#000000"}
                  onChange={(e) => updateNested("theme", field, e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={theme[field] || ""}
                  onChange={(e) => updateNested("theme", field, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-4">
          {[
            { field: "email", label: "Email", type: "email" },
            { field: "phone", label: "Phone", type: "tel" },
            { field: "address", label: "Address", type: "text" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={contact[field] || ""}
                onChange={(e) => updateNested("contact", field, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "facebook",
            "instagram",
            "twitter",
            "linkedin",
            "youtube",
            "tiktok",
          ].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
              <input
                type="url"
                value={social[platform] || ""}
                onChange={(e) => updateNested("social", platform, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Product Editor Component
function ProductEditor({
  content,
  updateField,
}: {
  content: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
}) {
  const pricing = (content.pricing as Record<string, number>) || {};
  const inventory = (content.inventory as Record<string, unknown>) || {};

  const updateNested = (parent: string, field: string, value: unknown) => {
    const current = (content[parent] as Record<string, unknown>) || {};
    updateField(parent, { ...current, [field]: value });
  };

  return (
    <>
      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={pricing.price || ""}
              onChange={(e) => updateNested("pricing", "price", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
            <input
              type="number"
              step="0.01"
              value={pricing.compareAtPrice || ""}
              onChange={(e) => updateNested("pricing", "compareAtPrice", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Original price (for sale items)"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="trackInventory"
              checked={(inventory.trackInventory as boolean) || false}
              onChange={(e) => updateNested("inventory", "trackInventory", e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="trackInventory" className="text-sm text-gray-700">Track inventory</label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={(inventory.sku as string) || ""}
                onChange={(e) => updateNested("inventory", "sku", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={(inventory.quantity as number) || ""}
                onChange={(e) => updateNested("inventory", "quantity", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
            <select
              value={(content.status as string) || "active"}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={(content.featured as boolean) || false}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">Featured product</label>
          </div>
        </div>
      </div>
    </>
  );
}
