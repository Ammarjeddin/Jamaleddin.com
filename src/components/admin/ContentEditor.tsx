"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  Palette,
  Image as ImageIcon,
} from "lucide-react";

interface ContentEditorProps {
  collection: string;
  slug: string;
  initialContent: Record<string, unknown>;
  filePath: string;
}

interface BlockColorSettings {
  light?: {
    textColor?: string;
    backgroundColor?: string;
    headingColor?: string;
  };
  dark?: {
    textColor?: string;
    backgroundColor?: string;
    headingColor?: string;
  };
}

interface Block {
  _template: string;
  colorSettings?: BlockColorSettings;
  [key: string]: unknown;
}

interface HeroSlide {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface HeroConfig {
  slides: HeroSlide[];
}

// Debounced Input Component - prevents losing focus on every keystroke
function DebouncedInput({
  value,
  onChange,
  type = "text",
  className,
  placeholder,
  rows,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url" | "email" | "tel" | "number";
  className?: string;
  placeholder?: string;
  rows?: number;
  [key: string]: unknown;
}) {
  const [localValue, setLocalValue] = useState(value);
  const isFirstRender = useRef(true);

  // Sync local value when external value changes (but not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  if (rows) {
    return (
      <textarea
        value={localValue}
        onChange={handleChange}
        className={className}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      value={localValue}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      {...props}
    />
  );
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
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={backLink}
                className="group flex items-center gap-2 text-zinc-400 hover:text-[var(--color-accent)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm font-medium">{collectionLabels[collection] || "Back"}</span>
              </Link>
              <div className="h-5 w-px bg-[var(--color-border)]" />
              <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
                {(content.title as string) || (content.name as string) || (content.siteName as string) || slug}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <span className="text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded-lg">{error}</span>
              )}
              {saved && (
                <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">Saved!</span>
              )}
              <a
                href={collection === "home" ? "/" : `/${collection === "settings" ? "" : collection + "/"}${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors px-4 py-2 border border-[var(--color-border)] hover:border-zinc-600 rounded-lg bg-[var(--color-surface)]"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-accent flex items-center gap-2 py-2 px-4 rounded-lg font-medium disabled:opacity-50"
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
            <div className="dashboard-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Basic Information</h2>
              <div className="space-y-4">
                {/* Title/Name field */}
                {("title" in content || "name" in content || "siteName" in content) && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      {collection === "products" ? "Name" : collection === "settings" ? "Site Name" : "Title"}
                    </label>
                    <DebouncedInput
                      value={
                        (content.title as string) ||
                        (content.name as string) ||
                        (content.siteName as string) ||
                        ""
                      }
                      onChange={(value) => {
                        const field = collection === "products" ? "name" : collection === "settings" ? "siteName" : "title";
                        updateField(field, value);
                      }}
                      className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
                    />
                  </div>
                )}

                {/* Description/Tagline */}
                {("description" in content || "tagline" in content) && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">
                      {collection === "settings" ? "Tagline" : "Description"}
                    </label>
                    <DebouncedInput
                      value={(content.description as string) || (content.tagline as string) || ""}
                      onChange={(value) => {
                        const field = collection === "settings" ? "tagline" : "description";
                        updateField(field, value);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Hero Section Editor - Only show for pages with hero */}
            {"hero" in content && (
              <HeroEditor
                hero={(content.hero as HeroConfig) || { slides: [] }}
                onChange={(hero) => updateField("hero", hero)}
              />
            )}

            {/* Blocks Editor */}
            {Array.isArray(content.blocks) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-zinc-100">Content Blocks</h2>
                  <button
                    onClick={() => {
                      setInsertIndex(blocks.length);
                      setShowBlockPicker(true);
                    }}
                    className="flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Block
                  </button>
                </div>

                {blocks.length === 0 ? (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-12 text-center">
                    <p className="text-zinc-400 mb-4">No blocks yet. Add your first content block.</p>
                    <button
                      onClick={() => {
                        setInsertIndex(0);
                        setShowBlockPicker(true);
                      }}
                      className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Block
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {blocks.map((block, index) => (
                      <div key={index} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                        {/* Block Header */}
                        <div
                          className="flex items-center justify-between p-4 bg-[var(--color-surface-elevated)] cursor-pointer"
                          onClick={() => toggleBlockExpanded(index)}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-zinc-500" />
                            <span className="font-medium text-zinc-100">
                              {BLOCK_TYPES.find((t) => t.type === block._template)?.label || block._template}
                            </span>
                            <span className="text-sm text-zinc-400">#{index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, index - 1);
                              }}
                              disabled={index === 0}
                              className="p-1 text-zinc-500 hover:text-zinc-400 disabled:opacity-30"
                            >
                              <ChevronUp className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, index + 1);
                              }}
                              disabled={index === blocks.length - 1}
                              className="p-1 text-zinc-500 hover:text-zinc-400 disabled:opacity-30"
                            >
                              <ChevronDown className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBlock(index);
                              }}
                              className="p-1 text-zinc-500 hover:text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Block Content */}
                        {expandedBlocks.has(index) && (
                          <div className="p-4 border-t border-[var(--color-border)]">
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
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-100">Add Block</h3>
              <button
                onClick={() => setShowBlockPicker(false)}
                className="p-2 text-zinc-500 hover:text-zinc-400"
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
                    className="text-left p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors"
                  >
                    <h4 className="font-medium text-zinc-100">{blockType.label}</h4>
                    <p className="text-sm text-zinc-400 mt-1">{blockType.description}</p>
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

  // Color settings handler
  const handleColorSettingsChange = (colorSettings: BlockColorSettings) => {
    onChange("colorSettings", colorSettings);
  };

  // Common fields for many block types
  const renderTextField = (field: string, label: string, multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
      <DebouncedInput
        value={(block[field] as string) || ""}
        onChange={(value) => onChange(field, value)}
        rows={multiline ? 4 : undefined}
        className={`w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none ${multiline ? "resize-none" : ""}`}
      />
    </div>
  );

  const renderSelectField = (field: string, label: string, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
      <select
        value={(block[field] as string) || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
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
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
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
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
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
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
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
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          {renderTextField("heading", "Heading")}
          {renderTextField("videoUrl", "Video URL (YouTube/Vimeo)")}
          {renderTextField("thumbnail", "Thumbnail Image URL")}
          {renderTextField("caption", "Caption")}
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
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
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
          />
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
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
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none font-mono text-sm"
          />
          <ColorSettingsEditor
            colorSettings={block.colorSettings}
            onChange={handleColorSettingsChange}
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
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Theme Colors</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { field: "primaryColor", label: "Primary Color" },
            { field: "secondaryColor", label: "Secondary Color" },
            { field: "accentColor", label: "Accent Color" },
            { field: "backgroundColor", label: "Background Color" },
            { field: "textColor", label: "Text Color" },
          ].map(({ field, label }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme[field] || "#000000"}
                  onChange={(e) => updateNested("theme", field, e.target.value)}
                  className="w-10 h-10 rounded border border-[var(--color-border)] cursor-pointer"
                />
                <input
                  type="text"
                  value={theme[field] || ""}
                  onChange={(e) => updateNested("theme", field, e.target.value)}
                  className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Contact Information</h2>
        <div className="space-y-4">
          {[
            { field: "email", label: "Email", type: "email" },
            { field: "phone", label: "Phone", type: "tel" },
            { field: "address", label: "Address", type: "text" },
          ].map(({ field, label, type }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
              <input
                type={type}
                value={contact[field] || ""}
                onChange={(e) => updateNested("contact", field, e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Social Media Links</h2>
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
              <label className="block text-sm font-medium text-zinc-300 mb-1 capitalize">{platform}</label>
              <input
                type="url"
                value={social[platform] || ""}
                onChange={(e) => updateNested("social", platform, e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
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
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={pricing.price || ""}
              onChange={(e) => updateNested("pricing", "price", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Compare at Price</label>
            <input
              type="number"
              step="0.01"
              value={pricing.compareAtPrice || ""}
              onChange={(e) => updateNested("pricing", "compareAtPrice", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
              placeholder="Original price (for sale items)"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Inventory</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="trackInventory"
              checked={(inventory.trackInventory as boolean) || false}
              onChange={(e) => updateNested("inventory", "trackInventory", e.target.checked)}
              className="w-4 h-4 text-[var(--color-accent)] border-[var(--color-border)] rounded focus:ring-[var(--color-accent)]/30"
            />
            <label htmlFor="trackInventory" className="text-sm text-zinc-300">Track inventory</label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">SKU</label>
              <input
                type="text"
                value={(inventory.sku as string) || ""}
                onChange={(e) => updateNested("inventory", "sku", e.target.value)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Quantity</label>
              <input
                type="number"
                value={(inventory.quantity as number) || ""}
                onChange={(e) => updateNested("inventory", "quantity", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="dashboard-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Status</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Product Status</label>
            <select
              value={(content.status as string) || "active"}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition-all"
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
              className="w-4 h-4 text-[var(--color-accent)] border-[var(--color-border)] rounded focus:ring-[var(--color-accent)]/30"
            />
            <label htmlFor="featured" className="text-sm text-zinc-300">Featured product</label>
          </div>
        </div>
      </div>
    </>
  );
}

// Hero Section Editor Component
function HeroEditor({
  hero,
  onChange,
}: {
  hero: HeroConfig;
  onChange: (hero: HeroConfig) => void;
}) {
  const slides = hero?.slides || [];

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    onChange({ ...hero, slides: newSlides });
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      title: "New Slide",
      subtitle: "",
      backgroundImage: "",
      buttonText: "",
      buttonLink: "",
    };
    onChange({ ...hero, slides: [...slides, newSlide] });
  };

  const removeSlide = (index: number) => {
    if (!confirm("Are you sure you want to remove this slide?")) return;
    const newSlides = slides.filter((_, i) => i !== index);
    onChange({ ...hero, slides: newSlides });
  };

  const moveSlide = (from: number, to: number) => {
    if (to < 0 || to >= slides.length) return;
    const newSlides = [...slides];
    const [removed] = newSlides.splice(from, 1);
    newSlides.splice(to, 0, removed);
    onChange({ ...hero, slides: newSlides });
  };

  return (
    <div className="dashboard-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Hero Section
        </h2>
        <button
          onClick={addSlide}
          className="flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          <p className="mb-4">No hero slides yet.</p>
          <button
            onClick={addSlide}
            className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div key={index} className="border border-[var(--color-border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-zinc-300">Slide {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSlide(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 text-zinc-500 hover:text-zinc-400 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, index + 1)}
                    disabled={index === slides.length - 1}
                    className="p-1 text-zinc-500 hover:text-zinc-400 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeSlide(index)}
                    className="p-1 text-zinc-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
                  <DebouncedInput
                    value={slide.title || ""}
                    onChange={(value) => updateSlide(index, "title", value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Subtitle</label>
                  <DebouncedInput
                    value={slide.subtitle || ""}
                    onChange={(value) => updateSlide(index, "subtitle", value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none text-sm resize-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Background Image URL</label>
                  <DebouncedInput
                    value={slide.backgroundImage || ""}
                    onChange={(value) => updateSlide(index, "backgroundImage", value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none text-sm transition-all placeholder:text-zinc-500"
                  />
                  {slide.backgroundImage && (
                    <div className="mt-2 relative h-24 rounded-lg overflow-hidden">
                      <img
                        src={slide.backgroundImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Button Text</label>
                    <DebouncedInput
                      value={slide.buttonText || ""}
                      onChange={(value) => updateSlide(index, "buttonText", value)}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Button Link</label>
                    <DebouncedInput
                      value={slide.buttonLink || ""}
                      onChange={(value) => updateSlide(index, "buttonLink", value)}
                      placeholder="/contact"
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-zinc-100 focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none text-sm transition-all placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Color Settings Component for blocks
function ColorSettingsEditor({
  colorSettings,
  onChange,
}: {
  colorSettings?: BlockColorSettings;
  onChange: (settings: BlockColorSettings) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const settings = colorSettings || { light: {}, dark: {} };

  const updateColor = (mode: "light" | "dark", field: string, value: string) => {
    const newSettings = {
      ...settings,
      [mode]: {
        ...settings[mode],
        [field]: value || undefined,
      },
    };
    // Clean up empty values
    if (!value) {
      delete newSettings[mode]![field as keyof typeof newSettings.light];
    }
    onChange(newSettings);
  };

  const hasColors = Boolean(
    settings.light?.textColor ||
    settings.light?.backgroundColor ||
    settings.light?.headingColor ||
    settings.dark?.textColor ||
    settings.dark?.backgroundColor ||
    settings.dark?.headingColor
  );

  return (
    <div className="border-t border-[var(--color-border)] pt-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100"
      >
        <Palette className="w-4 h-4" />
        Color Settings
        {hasColors && <span className="w-2 h-2 rounded-full bg-primary-500" />}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Light Mode Colors */}
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Light Mode</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { field: "textColor", label: "Text" },
                { field: "headingColor", label: "Heading" },
                { field: "backgroundColor", label: "Background" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-xs text-zinc-400 mb-1">{label}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={settings.light?.[field as keyof typeof settings.light] || "#000000"}
                      onChange={(e) => updateColor("light", field, e.target.value)}
                      className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                    />
                    <DebouncedInput
                      value={settings.light?.[field as keyof typeof settings.light] || ""}
                      onChange={(value) => updateColor("light", field, value)}
                      className="flex-1 px-2 py-1 border border-[var(--color-border)] rounded text-xs"
                      placeholder="Default"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dark Mode Colors */}
          <div>
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Dark Mode</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { field: "textColor", label: "Text" },
                { field: "headingColor", label: "Heading" },
                { field: "backgroundColor", label: "Background" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-xs text-zinc-400 mb-1">{label}</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={settings.dark?.[field as keyof typeof settings.dark] || "#ffffff"}
                      onChange={(e) => updateColor("dark", field, e.target.value)}
                      className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer"
                    />
                    <DebouncedInput
                      value={settings.dark?.[field as keyof typeof settings.dark] || ""}
                      onChange={(value) => updateColor("dark", field, value)}
                      className="flex-1 px-2 py-1 border border-[var(--color-border)] rounded text-xs"
                      placeholder="Default"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
