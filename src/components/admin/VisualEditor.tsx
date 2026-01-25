"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  X,
  Maximize2,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
} from "lucide-react";

// Import all block components for live preview
import { TextBlock } from "@/components/blocks/TextBlock";
import { HeroBanner } from "@/components/blocks/HeroBanner";
import { ImageTextLeft } from "@/components/blocks/ImageTextLeft";
import { ImageTextRight } from "@/components/blocks/ImageTextRight";
import { CardsGrid } from "@/components/blocks/CardsGrid";
import { CtaBox } from "@/components/blocks/CtaBox";
import { Faq } from "@/components/blocks/Faq";
import { Stats } from "@/components/blocks/Stats";
import { Testimonials } from "@/components/blocks/Testimonials";
import { Video } from "@/components/blocks/Video";
import { Timeline } from "@/components/blocks/Timeline";
import { Team } from "@/components/blocks/Team";
import { Divider } from "@/components/blocks/Divider";
import { ImageGallery } from "@/components/blocks/ImageGallery";
import { ContactInfo } from "@/components/blocks/ContactInfo";

interface VisualEditorProps {
  collection: string;
  slug: string;
  initialContent: Record<string, unknown>;
  filePath: string;
}

interface Block {
  _template: string;
  [key: string]: unknown;
}

// All available block types with categories
const BLOCK_TYPES = [
  // Hero & Headers
  { type: "heroBanner", label: "Hero Banner", icon: "🎯", category: "Headers", description: "Large hero section with background image" },

  // Content
  { type: "textBlock", label: "Text Block", icon: "📝", category: "Content", description: "Rich text content section" },
  { type: "imageTextRight", label: "Image Left, Text Right", icon: "◧", category: "Content", description: "Image on left side with text" },
  { type: "imageTextLeft", label: "Text Left, Image Right", icon: "◨", category: "Content", description: "Text on left side with image" },

  // Grids & Lists
  { type: "cardsGrid", label: "Cards Grid", icon: "📦", category: "Grids", description: "Grid of feature cards with icons" },
  { type: "stats", label: "Statistics", icon: "📊", category: "Grids", description: "Display key numbers and metrics" },
  { type: "imageGallery", label: "Image Gallery", icon: "🖼️", category: "Grids", description: "Photo gallery with lightbox" },

  // Social Proof
  { type: "testimonials", label: "Testimonials", icon: "💬", category: "Social Proof", description: "Customer quotes and reviews" },
  { type: "team", label: "Team Members", icon: "👥", category: "Social Proof", description: "Display team profiles" },

  // Interactive
  { type: "faq", label: "FAQ Accordion", icon: "❓", category: "Interactive", description: "Expandable Q&A section" },
  { type: "video", label: "Video Embed", icon: "🎥", category: "Interactive", description: "YouTube or Vimeo video" },
  { type: "contactInfo", label: "Contact Info", icon: "📧", category: "Interactive", description: "Contact details with optional form" },

  // Timeline & History
  { type: "timeline", label: "Timeline", icon: "📅", category: "Timeline", description: "Chronological events display" },

  // Call to Action
  { type: "ctaBox", label: "Call to Action", icon: "🎬", category: "CTA", description: "Prominent action section" },

  // Utility
  { type: "divider", label: "Divider", icon: "➖", category: "Utility", description: "Visual section separator" },

  // E-commerce
  { type: "productGrid", label: "Product Grid", icon: "🛍️", category: "E-commerce", description: "Display products from shop" },
  { type: "productShowcase", label: "Product Showcase", icon: "✨", category: "E-commerce", description: "Feature a single product" },
];

// Default block content
const DEFAULT_BLOCK_CONTENT: Record<string, Partial<Block>> = {
  heroBanner: {
    title: "Your Headline Here",
    subtitle: "Add a compelling subtitle that captures attention",
    height: "medium",
    buttonText: "Get Started",
    buttonLink: "/contact",
  },
  textBlock: {
    heading: "Section Heading",
    content: "<p>Your content goes here. You can add paragraphs, lists, and other formatted text.</p>",
    alignment: "left",
  },
  imageTextRight: {
    heading: "Feature Heading",
    content: "<p>Describe your feature or service here. Explain the benefits and value you provide.</p>",
    image: "/images/placeholder.jpg",
    imageAlt: "Feature image",
    buttonText: "Learn More",
    buttonLink: "#",
  },
  imageTextLeft: {
    heading: "Feature Heading",
    content: "<p>Describe your feature or service here. Explain the benefits and value you provide.</p>",
    image: "/images/placeholder.jpg",
    imageAlt: "Feature image",
    buttonText: "Learn More",
    buttonLink: "#",
  },
  cardsGrid: {
    heading: "Our Features",
    subheading: "Discover what makes us different",
    columns: "3",
    cards: [
      { title: "Feature One", description: "Description of your first feature", icon: "star" },
      { title: "Feature Two", description: "Description of your second feature", icon: "heart" },
      { title: "Feature Three", description: "Description of your third feature", icon: "zap" },
    ],
  },
  stats: {
    heading: "Our Impact",
    stats: [
      { number: "100+", label: "Happy Customers", icon: "users" },
      { number: "50+", label: "Projects Completed", icon: "briefcase" },
      { number: "10+", label: "Years Experience", icon: "calendar" },
      { number: "24/7", label: "Support Available", icon: "headphones" },
    ],
  },
  testimonials: {
    heading: "What People Say",
    layout: "grid",
    items: [
      { quote: "This is an amazing service! Highly recommend to everyone.", author: "John Smith", role: "CEO, Company" },
      { quote: "Professional team and excellent results. Will work with them again.", author: "Jane Doe", role: "Marketing Director" },
    ],
  },
  ctaBox: {
    heading: "Ready to Get Started?",
    text: "Join thousands of satisfied customers and take your business to the next level.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
    style: "primary",
  },
  faq: {
    heading: "Frequently Asked Questions",
    items: [
      { question: "What services do you offer?", answer: "We offer a wide range of services to meet your needs. Contact us for more details." },
      { question: "How can I get started?", answer: "Simply reach out through our contact form or give us a call. We'll guide you through the process." },
      { question: "What are your pricing options?", answer: "We offer flexible pricing plans to suit different budgets. Request a quote for custom pricing." },
    ],
  },
  team: {
    heading: "Meet Our Team",
    subheading: "The people behind our success",
    members: [
      { name: "John Smith", role: "CEO & Founder", bio: "Leading our vision with 15+ years of experience.", email: "john@example.com" },
      { name: "Jane Doe", role: "Creative Director", bio: "Bringing creative ideas to life.", email: "jane@example.com" },
    ],
  },
  timeline: {
    heading: "Our Journey",
    items: [
      { year: "2020", title: "Company Founded", description: "Started with a vision to make a difference." },
      { year: "2022", title: "Major Milestone", description: "Reached 1,000 customers and expanded our team." },
      { year: "2024", title: "New Horizons", description: "Launched new products and entered new markets." },
    ],
  },
  video: {
    heading: "Watch Our Story",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "Learn more about what we do",
  },
  divider: {
    style: "line",
    size: "medium",
  },
  imageGallery: {
    heading: "Gallery",
    layout: "grid",
    images: [
      { src: "/images/placeholder.jpg", alt: "Gallery image 1", caption: "Image caption" },
      { src: "/images/placeholder.jpg", alt: "Gallery image 2", caption: "Image caption" },
      { src: "/images/placeholder.jpg", alt: "Gallery image 3", caption: "Image caption" },
    ],
  },
  contactInfo: {
    heading: "Get In Touch",
    showForm: true,
    showMap: false,
    email: "contact@example.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, City, State 12345",
  },
  productGrid: {
    heading: "Our Products",
    subheading: "Browse our collection",
    displayMode: "featured",
    columns: "3",
    maxProducts: 6,
  },
  productShowcase: {
    heading: "Featured Product",
    productSlug: "",
    layout: "left",
    backgroundColor: "white",
  },
};

export function VisualEditor({ collection, slug, initialContent, filePath }: VisualEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number>(0);
  const [showPanel, setShowPanel] = useState(true);
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const previewRef = useRef<HTMLDivElement>(null);

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

  const updateBlock = useCallback((index: number, field: string, value: unknown) => {
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const updateBlockFull = useCallback((index: number, updates: Partial<Block>) => {
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks[index] = { ...newBlocks[index], ...updates };
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const addBlock = useCallback((type: string, index: number) => {
    const defaultContent = DEFAULT_BLOCK_CONTENT[type] || {};
    const newBlock: Block = { _template: type, ...defaultContent };
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[] || [])];
      newBlocks.splice(index, 0, newBlock);
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlock(index);
    setShowBlockPicker(false);
  }, []);

  const duplicateBlock = useCallback((index: number) => {
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      const duplicate = JSON.parse(JSON.stringify(newBlocks[index]));
      newBlocks.splice(index + 1, 0, duplicate);
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlock(index + 1);
  }, []);

  const removeBlock = useCallback((index: number) => {
    if (!confirm("Delete this block?")) return;
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      newBlocks.splice(index, 1);
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlock(null);
  }, []);

  const moveBlock = useCallback((from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    setContent((prev) => {
      const newBlocks = [...(prev.blocks as Block[])];
      const [removed] = newBlocks.splice(from, 1);
      newBlocks.splice(to, 0, removed);
      return { ...prev, blocks: newBlocks };
    });
    setSelectedBlock(to);
  }, [blocks.length]);

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

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  // Group blocks by category for the picker
  const blocksByCategory = BLOCK_TYPES.reduce((acc, block) => {
    if (!acc[block.category]) acc[block.category] = [];
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof BLOCK_TYPES>);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href={backLink}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{collectionLabels[collection]}</span>
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="font-semibold text-gray-900 truncate max-w-[200px]">
            {(content.title as string) || (content.name as string) || slug}
          </h1>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewportSize("desktop")}
            className={`p-2 rounded transition-colors ${viewportSize === "desktop" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportSize("tablet")}
            className={`p-2 rounded transition-colors ${viewportSize === "tablet" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewportSize("mobile")}
            className={`p-2 rounded transition-colors ${viewportSize === "mobile" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-red-600">{error}</span>}
          {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}

          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`p-2 rounded-lg border transition-colors ${showPanel ? "bg-gray-100 border-gray-300" : "border-gray-200 hover:bg-gray-50"}`}
            title={showPanel ? "Hide Panel" : "Show Panel"}
          >
            {showPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <a
            href={collection === "home" ? "/" : `/${collection === "settings" ? "" : collection + "/"}${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Preview in new tab"
          >
            <Maximize2 className="w-4 h-4" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Live Preview */}
        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          <div
            ref={previewRef}
            className="mx-auto bg-white min-h-full shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
            style={{
              width: viewportWidths[viewportSize],
              maxWidth: "100%",
            }}
          >
            {/* Page Title/Description for non-home pages */}
            {collection !== "home" && collection !== "settings" && (
              <div
                className={`p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b cursor-pointer transition-all ${
                  selectedBlock === -1 ? "ring-2 ring-blue-500 ring-inset" : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedBlock(-1)}
              >
                <div className="max-w-3xl">
                  <h1
                    className="text-3xl md:text-4xl font-bold text-gray-900 outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const field = collection === "products" ? "name" : "title";
                      setContent(prev => ({ ...prev, [field]: e.currentTarget.textContent }));
                    }}
                  >
                    {(content.title as string) || (content.name as string) || "Untitled"}
                  </h1>
                  {(content.description as string) ? (
                    <p
                      className="mt-3 text-lg text-gray-600 outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        setContent(prev => ({ ...prev, description: e.currentTarget.textContent }));
                      }}
                    >
                      {content.description as string}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {/* Blocks */}
            {blocks.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content blocks yet</h3>
                <p className="text-gray-500 mb-6">Add your first block to start building this page</p>
                <button
                  onClick={() => {
                    setInsertIndex(0);
                    setShowBlockPicker(true);
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add First Block
                </button>
              </div>
            ) : (
              <div className="relative">
                {blocks.map((block, index) => (
                  <div key={index} className="relative group">
                    {/* Add Block Button (Between blocks) */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setInsertIndex(index);
                          setShowBlockPicker(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-lg transition-colors"
                        title="Add block here"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Block Wrapper */}
                    <div
                      className={`relative transition-all cursor-pointer ${
                        selectedBlock === index
                          ? "ring-2 ring-blue-500 ring-inset"
                          : "hover:ring-2 hover:ring-blue-300 hover:ring-inset"
                      }`}
                      onClick={() => setSelectedBlock(index)}
                    >
                      {/* Block Controls Overlay */}
                      <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1 transition-opacity ${
                        selectedBlock === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1); }}
                          disabled={index === 0}
                          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1); }}
                          disabled={index === blocks.length - 1}
                          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-gray-200" />
                        <button
                          onClick={(e) => { e.stopPropagation(); duplicateBlock(index); }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Duplicate block"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                          className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                          title="Delete block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Block Type Label */}
                      <div className={`absolute top-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded transition-opacity ${
                        selectedBlock === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                        {BLOCK_TYPES.find(t => t.type === block._template)?.label || block._template}
                      </div>

                      {/* Render Block */}
                      <LiveBlockRenderer block={block} />
                    </div>

                    {/* Add Block Button (After last block) */}
                    {index === blocks.length - 1 && (
                      <div className="py-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setInsertIndex(blocks.length);
                            setShowBlockPicker(true);
                          }}
                          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Add Block
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Block Editor */}
        {showPanel && selectedBlock !== null && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-900">
                {selectedBlock === -1
                  ? "Page Settings"
                  : BLOCK_TYPES.find(t => t.type === blocks[selectedBlock]?._template)?.label || "Edit Block"
                }
              </h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto min-h-0">
              {selectedBlock === -1 ? (
                <PageSettingsEditor content={content} setContent={setContent} collection={collection} />
              ) : (
                <BlockFieldEditor
                  block={blocks[selectedBlock]}
                  onChange={(field, value) => updateBlock(selectedBlock, field, value)}
                  onChangeFull={(updates) => updateBlockFull(selectedBlock, updates)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowBlockPicker(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-4 flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }} onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold">Add Block</h3>
              <button onClick={() => setShowBlockPicker(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {Object.entries(blocksByCategory).map(([category, categoryBlocks]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-white py-1">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryBlocks.map((blockType) => (
                      <button
                        key={blockType.type}
                        onClick={() => addBlock(blockType.type, insertIndex)}
                        className="flex items-start gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <span className="text-2xl flex-shrink-0">{blockType.icon}</span>
                        <div className="min-w-0">
                          <span className="font-medium text-sm text-gray-900 group-hover:text-blue-700">{blockType.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{blockType.description}</p>
                        </div>
                      </button>
                    ))}
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

// Live Block Renderer - Renders actual block components
function LiveBlockRenderer({ block }: { block: Block }) {
  const { _template, ...props } = block;
  const blockProps = props as unknown;

  switch (_template) {
    case "textBlock":
      return <TextBlock {...(blockProps as React.ComponentProps<typeof TextBlock>)} />;
    case "heroBanner":
      return <HeroBanner {...(blockProps as React.ComponentProps<typeof HeroBanner>)} />;
    case "imageTextLeft":
      return <ImageTextLeft {...(blockProps as React.ComponentProps<typeof ImageTextLeft>)} />;
    case "imageTextRight":
      return <ImageTextRight {...(blockProps as React.ComponentProps<typeof ImageTextRight>)} />;
    case "cardsGrid":
      return <CardsGrid {...(blockProps as React.ComponentProps<typeof CardsGrid>)} />;
    case "ctaBox":
      return <CtaBox {...(blockProps as React.ComponentProps<typeof CtaBox>)} />;
    case "faq":
      return <Faq {...(blockProps as React.ComponentProps<typeof Faq>)} />;
    case "stats":
      return <Stats {...(blockProps as React.ComponentProps<typeof Stats>)} />;
    case "testimonials":
      return <Testimonials {...(blockProps as React.ComponentProps<typeof Testimonials>)} />;
    case "video":
      return <Video {...(blockProps as React.ComponentProps<typeof Video>)} />;
    case "timeline":
      return <Timeline {...(blockProps as React.ComponentProps<typeof Timeline>)} />;
    case "team":
      return <Team {...(blockProps as React.ComponentProps<typeof Team>)} />;
    case "divider":
      return <Divider {...(blockProps as React.ComponentProps<typeof Divider>)} />;
    case "imageGallery":
      return <ImageGallery {...(blockProps as React.ComponentProps<typeof ImageGallery>)} />;
    case "contactInfo":
      return <ContactInfo {...(blockProps as React.ComponentProps<typeof ContactInfo>)} />;
    case "productGrid":
    case "productShowcase":
      // These require server-side data, show placeholder in editor
      return (
        <div className="p-12 bg-gradient-to-r from-orange-50 to-amber-50 text-center border-2 border-dashed border-orange-200">
          <div className="text-4xl mb-3">🛍️</div>
          <p className="font-medium text-orange-800">{_template === "productGrid" ? "Product Grid" : "Product Showcase"}</p>
          <p className="text-sm text-orange-600 mt-1">Products will load from your shop on the live site</p>
        </div>
      );
    default:
      return (
        <div className="p-8 bg-gray-100 text-center text-gray-500">
          <p className="font-medium">Unknown block: {_template}</p>
        </div>
      );
  }
}

// Page Settings Editor
function PageSettingsEditor({
  content,
  setContent,
  collection
}: {
  content: Record<string, unknown>;
  setContent: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  collection: string;
}) {
  const updateField = (field: string, value: unknown) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {collection === "products" ? "Product Name" : "Page Title"}
        </label>
        <input
          type="text"
          value={(content.title as string) || (content.name as string) || ""}
          onChange={(e) => updateField(collection === "products" ? "name" : "title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={(content.description as string) || ""}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
          placeholder="Brief description for SEO and previews"
        />
      </div>
      {collection === "programs" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <input
            type="text"
            value={(content.icon as string) || ""}
            onChange={(e) => updateField("icon", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="e.g., book, users, star"
          />
        </div>
      )}
    </div>
  );
}

// Block Field Editor - Dynamic form for each block type
function BlockFieldEditor({
  block,
  onChange,
  onChangeFull,
}: {
  block: Block;
  onChange: (field: string, value: unknown) => void;
  onChangeFull: (updates: Partial<Block>) => void;
}) {
  const template = block._template;

  // Reusable field components
  const TextField = ({ field, label, placeholder = "", multiline = false }: { field: string; label: string; placeholder?: string; multiline?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={(block[field] as string) || ""}
          onChange={(e) => onChange(field, e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          value={(block[field] as string) || ""}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      )}
    </div>
  );

  const SelectField = ({ field, label, options }: { field: string; label: string; options: { value: string; label: string }[] }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={(block[field] as string) || options[0]?.value || ""}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const CheckboxField = ({ field, label, description }: { field: string; label: string; description?: string }) => (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={(block[field] as boolean) || false}
        onChange={(e) => onChange(field, e.target.checked)}
        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </label>
  );

  const ImageField = ({ field, label }: { field: string; label: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={(block[field] as string) || ""}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder="/images/your-image.jpg"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
      />
      {(block[field] as string) ? (
        <div className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block[field] as string} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}
    </div>
  );

  const NumberField = ({ field, label, min, max }: { field: string; label: string; min?: number; max?: number }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        value={(block[field] as number) || ""}
        onChange={(e) => onChange(field, parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
      />
    </div>
  );

  // Render fields based on block type
  switch (template) {
    case "heroBanner":
      return (
        <div className="space-y-4">
          <TextField field="title" label="Title" placeholder="Your headline here" />
          <TextField field="subtitle" label="Subtitle" placeholder="Supporting text" multiline />
          <ImageField field="backgroundImage" label="Background Image" />
          <div className="grid grid-cols-2 gap-3">
            <TextField field="buttonText" label="Button Text" placeholder="Get Started" />
            <TextField field="buttonLink" label="Button Link" placeholder="/contact" />
          </div>
          <SelectField field="height" label="Height" options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "full", label: "Full Screen" },
          ]} />
          <SelectField field="textAlign" label="Text Alignment" options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]} />
        </div>
      );

    case "textBlock":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="content" label="Content (HTML)" multiline />
          <SelectField field="alignment" label="Alignment" options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]} />
        </div>
      );

    case "ctaBox":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="text" label="Text" multiline />
          <div className="grid grid-cols-2 gap-3">
            <TextField field="buttonText" label="Button Text" />
            <TextField field="buttonLink" label="Button Link" />
          </div>
          <SelectField field="style" label="Style" options={[
            { value: "primary", label: "Primary Color" },
            { value: "secondary", label: "Secondary Color" },
            { value: "accent", label: "Accent Color" },
            { value: "dark", label: "Dark" },
          ]} />
        </div>
      );

    case "imageTextRight":
    case "imageTextLeft":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="content" label="Content (HTML)" multiline />
          <ImageField field="image" label="Image" />
          <TextField field="imageAlt" label="Image Alt Text" placeholder="Describe the image" />
          <div className="grid grid-cols-2 gap-3">
            <TextField field="buttonText" label="Button Text" />
            <TextField field="buttonLink" label="Button Link" />
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="space-y-4">
          <SelectField field="style" label="Style" options={[
            { value: "line", label: "Simple Line" },
            { value: "dots", label: "Dots" },
            { value: "wave", label: "Wave" },
            { value: "gradient", label: "Gradient" },
          ]} />
          <SelectField field="size" label="Spacing" options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]} />
        </div>
      );

    case "video":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="videoUrl" label="Video URL" placeholder="https://youtube.com/watch?v=..." />
          <ImageField field="thumbnail" label="Custom Thumbnail (optional)" />
          <TextField field="caption" label="Caption" />
        </div>
      );

    case "stats":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
            <ArrayEditor
              items={(block.stats as Array<{ number: string; label: string; icon?: string }>) || []}
              onChange={(items) => onChange("stats", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.number || ""}
                    onChange={(e) => updateItem({ ...item, number: e.target.value })}
                    placeholder="Number (e.g., 100+)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={item.label || ""}
                    onChange={(e) => updateItem({ ...item, label: e.target.value })}
                    placeholder="Label (e.g., Happy Customers)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={item.icon || ""}
                    onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                    placeholder="Icon (e.g., users, star, heart)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
              newItem={{ number: "", label: "", icon: "" }}
            />
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
            <ArrayEditor
              items={(block.items as Array<{ question: string; answer: string }>) || []}
              onChange={(items) => onChange("items", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.question || ""}
                    onChange={(e) => updateItem({ ...item, question: e.target.value })}
                    placeholder="Question"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    value={item.answer || ""}
                    onChange={(e) => updateItem({ ...item, answer: e.target.value })}
                    placeholder="Answer"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
              )}
              newItem={{ question: "", answer: "" }}
            />
          </div>
        </div>
      );

    case "cardsGrid":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="subheading" label="Subheading" />
          <SelectField field="columns" label="Columns" options={[
            { value: "2", label: "2 Columns" },
            { value: "3", label: "3 Columns" },
            { value: "4", label: "4 Columns" },
          ]} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cards</label>
            <ArrayEditor
              items={(block.cards as Array<{ title: string; description: string; icon?: string; image?: string; link?: string }>) || []}
              onChange={(items) => onChange("cards", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => updateItem({ ...item, title: e.target.value })}
                    placeholder="Card Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    value={item.description || ""}
                    onChange={(e) => updateItem({ ...item, description: e.target.value })}
                    placeholder="Card Description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.icon || ""}
                      onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                      placeholder="Icon name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => updateItem({ ...item, link: e.target.value })}
                      placeholder="Link URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
              newItem={{ title: "", description: "", icon: "" }}
            />
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <SelectField field="layout" label="Layout" options={[
            { value: "grid", label: "Grid" },
            { value: "carousel", label: "Carousel" },
          ]} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Testimonials</label>
            <ArrayEditor
              items={(block.items as Array<{ quote: string; author: string; role?: string; avatar?: string }>) || []}
              onChange={(items) => onChange("items", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <textarea
                    value={item.quote || ""}
                    onChange={(e) => updateItem({ ...item, quote: e.target.value })}
                    placeholder="Testimonial quote"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.author || ""}
                      onChange={(e) => updateItem({ ...item, author: e.target.value })}
                      placeholder="Author name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.role || ""}
                      onChange={(e) => updateItem({ ...item, role: e.target.value })}
                      placeholder="Role / Company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.avatar || ""}
                    onChange={(e) => updateItem({ ...item, avatar: e.target.value })}
                    placeholder="Avatar image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
              newItem={{ quote: "", author: "", role: "" }}
            />
          </div>
        </div>
      );

    case "team":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="subheading" label="Subheading" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <ArrayEditor
              items={(block.members as Array<{ name: string; role?: string; photo?: string; bio?: string; email?: string; linkedin?: string; twitter?: string }>) || []}
              onChange={(items) => onChange("members", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.name || ""}
                      onChange={(e) => updateItem({ ...item, name: e.target.value })}
                      placeholder="Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.role || ""}
                      onChange={(e) => updateItem({ ...item, role: e.target.value })}
                      placeholder="Role / Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.photo || ""}
                    onChange={(e) => updateItem({ ...item, photo: e.target.value })}
                    placeholder="Photo URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <textarea
                    value={item.bio || ""}
                    onChange={(e) => updateItem({ ...item, bio: e.target.value })}
                    placeholder="Short bio"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="email"
                      value={item.email || ""}
                      onChange={(e) => updateItem({ ...item, email: e.target.value })}
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.linkedin || ""}
                      onChange={(e) => updateItem({ ...item, linkedin: e.target.value })}
                      placeholder="LinkedIn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.twitter || ""}
                      onChange={(e) => updateItem({ ...item, twitter: e.target.value })}
                      placeholder="Twitter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
              newItem={{ name: "", role: "", bio: "" }}
            />
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeline Events</label>
            <ArrayEditor
              items={(block.items as Array<{ year: string; title: string; description?: string; image?: string }>) || []}
              onChange={(items) => onChange("items", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.year || ""}
                      onChange={(e) => updateItem({ ...item, year: e.target.value })}
                      placeholder="Year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => updateItem({ ...item, title: e.target.value })}
                      placeholder="Event Title"
                      className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <textarea
                    value={item.description || ""}
                    onChange={(e) => updateItem({ ...item, description: e.target.value })}
                    placeholder="Event description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                  <input
                    type="text"
                    value={item.image || ""}
                    onChange={(e) => updateItem({ ...item, image: e.target.value })}
                    placeholder="Image URL (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
              newItem={{ year: "", title: "", description: "" }}
            />
          </div>
        </div>
      );

    case "imageGallery":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <SelectField field="layout" label="Layout" options={[
            { value: "grid", label: "Grid" },
            { value: "masonry", label: "Masonry" },
            { value: "carousel", label: "Carousel" },
          ]} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <ArrayEditor
              items={(block.images as Array<{ src: string; alt?: string; caption?: string }>) || []}
              onChange={(items) => onChange("images", items)}
              renderItem={(item, idx, updateItem) => (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.src || ""}
                    onChange={(e) => updateItem({ ...item, src: e.target.value })}
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.alt || ""}
                      onChange={(e) => updateItem({ ...item, alt: e.target.value })}
                      placeholder="Alt text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={item.caption || ""}
                      onChange={(e) => updateItem({ ...item, caption: e.target.value })}
                      placeholder="Caption"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  {item.src && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt={item.alt || ""} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
              newItem={{ src: "", alt: "", caption: "" }}
            />
          </div>
        </div>
      );

    case "contactInfo":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <CheckboxField field="showForm" label="Show Contact Form" description="Display a contact form" />
          <CheckboxField field="showMap" label="Show Map" description="Display an embedded map" />
          {(block.showMap as boolean) && (
            <TextField field="mapEmbedUrl" label="Map Embed URL" placeholder="Google Maps embed URL" />
          )}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Contact Details</p>
            <div className="space-y-3">
              <TextField field="email" label="Email" placeholder="contact@example.com" />
              <TextField field="phone" label="Phone" placeholder="(555) 123-4567" />
              <TextField field="address" label="Address" placeholder="123 Main St, City, State" multiline />
            </div>
          </div>
        </div>
      );

    case "productGrid":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="subheading" label="Subheading" />
          <SelectField field="displayMode" label="Display Mode" options={[
            { value: "all", label: "All Products" },
            { value: "featured", label: "Featured Only" },
            { value: "category", label: "By Category" },
          ]} />
          {(block.displayMode as string) === "category" && (
            <TextField field="category" label="Category" placeholder="Category name" />
          )}
          <NumberField field="maxProducts" label="Max Products" min={1} max={24} />
          <SelectField field="columns" label="Columns" options={[
            { value: "2", label: "2 Columns" },
            { value: "3", label: "3 Columns" },
            { value: "4", label: "4 Columns" },
          ]} />
        </div>
      );

    case "productShowcase":
      return (
        <div className="space-y-4">
          <TextField field="heading" label="Heading" />
          <TextField field="productSlug" label="Product Slug" placeholder="your-product-slug" />
          <SelectField field="layout" label="Image Position" options={[
            { value: "left", label: "Image Left" },
            { value: "right", label: "Image Right" },
          ]} />
          <SelectField field="backgroundColor" label="Background" options={[
            { value: "white", label: "White" },
            { value: "gray", label: "Gray" },
            { value: "primary", label: "Primary Color" },
          ]} />
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">Edit raw JSON for this block:</p>
          <textarea
            value={JSON.stringify(block, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChangeFull(parsed);
              } catch {
                // Invalid JSON
              }
            }}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs"
          />
        </div>
      );
  }
}

// Array Editor Component for lists
function ArrayEditor<T extends Record<string, unknown>>({
  items,
  onChange,
  renderItem,
  newItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, updateItem: (item: T) => void) => React.ReactNode;
  newItem: T;
}) {
  const addItem = () => onChange([...items, { ...newItem }]);
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, item: T) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };
  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const newItems = [...items];
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="relative p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              onClick={() => moveItem(index, index - 1)}
              disabled={index === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="Move up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => moveItem(index, index + 1)}
              disabled={index === items.length - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="Move down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => removeItem(index)}
              className="p-1 text-gray-400 hover:text-red-500"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="pr-16">
            {renderItem(item, index, (updated) => updateItem(index, updated))}
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors text-sm font-medium"
      >
        + Add Item
      </button>
    </div>
  );
}
