"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Palette,
  Globe,
  Mail,
  Share2,
  Layout,
  Settings,
  Navigation,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Info,
  FileEdit,
  Upload,
} from "lucide-react";

interface SettingsEditorProps {
  initialContent: Record<string, unknown>;
  filePath: string;
}

export function SettingsEditor({ initialContent, filePath }: SettingsEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [showNavExamples, setShowNavExamples] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const handleSave = async (saveAsDraft: boolean = false) => {
    setSaving(true);
    setError("");
    setSaved(false);
    setSavedAsDraft(false);
    setShowSaveMenu(false);

    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: filePath,
          content,
          commitMessage: "Update site settings",
          saveAsDraft,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save");
      }

      if (saveAsDraft) {
        setSavedAsDraft(true);
        setTimeout(() => setSavedAsDraft(false), 3000);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (parent: string, field: string, value: unknown) => {
    const current = (content[parent] as Record<string, unknown>) || {};
    updateField(parent, { ...current, [field]: value });
  };

  const updateDeepNested = (parent: string, child: string, field: string, value: unknown) => {
    const currentParent = (content[parent] as Record<string, unknown>) || {};
    const currentChild = (currentParent[child] as Record<string, unknown>) || {};
    updateField(parent, {
      ...currentParent,
      [child]: { ...currentChild, [field]: value },
    });
  };

  const theme = (content.theme as Record<string, string>) || {};
  const contact = (content.contact as Record<string, string>) || {};
  const social = (content.social as Record<string, string>) || {};
  const logo = (content.logo as Record<string, string>) || {};
  const layout = (content.layout as Record<string, unknown>) || {};
  const template = (content.template as Record<string, unknown>) || {};
  const features = (template.features as Record<string, unknown>) || {};

  const navigation = (content.navigation as Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>) || [];

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "navigation", label: "Navigation", icon: Navigation },
    { id: "theme", label: "Theme & Colors", icon: Palette },
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "layout", label: "Layout", icon: Layout },
    { id: "features", label: "Features", icon: Globe },
  ];

  const addNavItem = () => {
    updateField("navigation", [
      ...navigation,
      { label: "New Link", href: "/" },
    ]);
  };

  const updateNavItem = (index: number, field: string, value: string) => {
    const updated = [...navigation];
    updated[index] = { ...updated[index], [field]: value };
    updateField("navigation", updated);
  };

  const removeNavItem = (index: number) => {
    updateField("navigation", navigation.filter((_, i) => i !== index));
  };

  const moveNavItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= navigation.length) return;
    const updated = [...navigation];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateField("navigation", updated);
  };

  const addChildNavItem = (parentIndex: number) => {
    const updated = [...navigation];
    const children = updated[parentIndex].children || [];
    updated[parentIndex] = {
      ...updated[parentIndex],
      children: [...children, { label: "New Sub-link", href: "/" }],
    };
    updateField("navigation", updated);
  };

  const updateChildNavItem = (parentIndex: number, childIndex: number, field: string, value: string) => {
    const updated = [...navigation];
    const children = [...(updated[parentIndex].children || [])];
    children[childIndex] = { ...children[childIndex], [field]: value };
    updated[parentIndex] = { ...updated[parentIndex], children };
    updateField("navigation", updated);
  };

  const removeChildNavItem = (parentIndex: number, childIndex: number) => {
    const updated = [...navigation];
    const children = updated[parentIndex].children?.filter((_, i) => i !== childIndex) || [];
    updated[parentIndex] = { ...updated[parentIndex], children: children.length > 0 ? children : undefined };
    updateField("navigation", updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
            <span className="text-gray-300 dark:text-zinc-600">|</span>
            <h1 className="font-semibold text-gray-900 dark:text-white">Site Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {saved && <span className="text-sm text-green-600 font-medium">✓ Published</span>}
            {savedAsDraft && <span className="text-sm text-blue-600 font-medium">✓ Draft saved</span>}
            {/* Save Options Dropdown */}
            <div className="relative">
              <div className="flex">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-l-lg transition-colors disabled:opacity-50"
                  title="Save and publish immediately"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Publish
                </button>
                <button
                  onClick={() => setShowSaveMenu(!showSaveMenu)}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded-r-lg border-l border-emerald-500 transition-colors disabled:opacity-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              {showSaveMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-50">
                  <button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-t-lg"
                  >
                    <Upload className="w-4 h-4" />
                    Save & Publish
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 rounded-b-lg border-t border-gray-100 dark:border-zinc-700"
                  >
                    <FileEdit className="w-4 h-4" />
                    Save as Draft
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-48 flex-shrink-0">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                        : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={(content.siteName as string) || ""}
                    onChange={(e) => updateField("siteName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={(content.tagline as string) || ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Main Logo</label>
                    <input
                      type="text"
                      value={logo.main || ""}
                      onChange={(e) => updateNested("logo", "main", e.target.value)}
                      placeholder="/images/logo.png"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Light Logo (for dark backgrounds)</label>
                    <input
                      type="text"
                      value={logo.light || ""}
                      onChange={(e) => updateNested("logo", "light", e.target.value)}
                      placeholder="/images/logo-light.png"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Settings */}
            {activeTab === "navigation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation Menu</h2>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Customize your site&apos;s navigation links</p>
                  </div>
                  <button
                    onClick={addNavItem}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </div>

                {/* Demo Site Navigation Examples */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowNavExamples(!showNavExamples)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Demo Site Navigation Examples</span>
                    </div>
                    {showNavExamples ? (
                      <ChevronUp className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                  {showNavExamples && (
                    <div className="px-4 pb-4 border-t border-blue-200 bg-white">
                      <p className="text-xs text-gray-500 mt-3 mb-3">
                        Here are example navigation items from a typical nonprofit or community site:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Home</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/</code>
                        </div>
                        <div className="flex items-start gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Programs</span>
                          <span className="text-gray-400">&rarr;</span>
                          <div>
                            <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/programs</code>
                            <div className="mt-1 ml-2 text-xs text-gray-500">
                              <span className="text-gray-400">Dropdown:</span> Youth Leadership, Adult Education, Community Wellness, Digital Skills
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Shop</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/shop</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">About</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/about</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Gallery</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/gallery</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Get Involved</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/get-involved</code>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-zinc-300">
                          <span className="font-medium w-24">Contact</span>
                          <span className="text-gray-400">&rarr;</span>
                          <code className="bg-gray-100 dark:bg-zinc-600 px-2 py-0.5 rounded text-xs dark:text-zinc-300">/contact</code>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                        <strong>Tip:</strong> Use dropdown items to organize related pages under a parent menu item.
                        For example, individual program pages can be nested under &quot;Programs&quot;.
                      </div>
                    </div>
                  )}
                </div>

                {navigation.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-zinc-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-zinc-600">
                    <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No custom navigation items</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Leave empty to use default navigation based on enabled features
                    </p>
                    <button
                      onClick={addNavItem}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {navigation.map((item, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1 pt-2">
                            <button
                              onClick={() => moveNavItem(index, "up")}
                              disabled={index === 0}
                              className="p-1 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <GripVertical className="w-4 h-4 text-gray-300" />
                            <button
                              onClick={() => moveNavItem(index, "down")}
                              disabled={index === navigation.length - 1}
                              className="p-1 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Label</label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => updateNavItem(index, "label", e.target.value)}
                                  placeholder="Link text"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">URL</label>
                                <input
                                  type="text"
                                  value={item.href}
                                  onChange={(e) => updateNavItem(index, "href", e.target.value)}
                                  placeholder="/page-url"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                                />
                              </div>
                            </div>

                            {/* Sub-items */}
                            {item.children && item.children.length > 0 && (
                              <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-zinc-600 space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dropdown Items</p>
                                {item.children.map((child, childIndex) => (
                                  <div key={childIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={child.label}
                                      onChange={(e) => updateChildNavItem(index, childIndex, "label", e.target.value)}
                                      placeholder="Sub-link text"
                                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-zinc-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                                    />
                                    <input
                                      type="text"
                                      value={child.href}
                                      onChange={(e) => updateChildNavItem(index, childIndex, "href", e.target.value)}
                                      placeholder="/sub-page"
                                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-zinc-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                                    />
                                    <button
                                      onClick={() => removeChildNavItem(index, childIndex)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => addChildNavItem(index)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              + Add dropdown item
                            </button>
                          </div>

                          <button
                            onClick={() => removeNavItem(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    <strong>Tip:</strong> If navigation is empty, the site will use automatic navigation based on enabled features (Programs, Shop, Events, etc.).
                  </p>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme & Colors</h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "primaryColor", label: "Primary Color" },
                    { field: "secondaryColor", label: "Secondary Color" },
                    { field: "accentColor", label: "Accent Color" },
                    { field: "backgroundColor", label: "Background Color" },
                    { field: "textColor", label: "Text Color" },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">{label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme[field] || "#000000"}
                          onChange={(e) => updateNested("theme", field, e.target.value)}
                          className="w-10 h-10 rounded border border-gray-300 dark:border-zinc-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={theme[field] || ""}
                          onChange={(e) => updateNested("theme", field, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-zinc-700 dark:text-white"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Font Pairing</label>
                  <select
                    value={(content.fonts as Record<string, string>)?.pairing || "modern"}
                    onChange={(e) => updateNested("fonts", "pairing", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="modern">Modern (Inter + Source Sans)</option>
                    <option value="classic">Classic (Merriweather + Open Sans)</option>
                    <option value="minimal">Minimal (Helvetica + Arial)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={contact.email || ""}
                    onChange={(e) => updateNested("contact", "email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={contact.phone || ""}
                    onChange={(e) => updateNested("contact", "phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Address</label>
                  <textarea
                    value={contact.address || ""}
                    onChange={(e) => updateNested("contact", "address", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-zinc-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Social Settings */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>

                {[
                  { field: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
                  { field: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
                  { field: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/..." },
                  { field: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/..." },
                  { field: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
                  { field: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/..." },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">{label}</label>
                    <input
                      type="url"
                      value={social[field] || ""}
                      onChange={(e) => updateNested("social", field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Layout Settings */}
            {activeTab === "layout" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Layout Options</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Homepage Style</label>
                  <select
                    value={(layout.homepage as string) || "standard"}
                    onChange={(e) => updateNested("layout", "homepage", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Navbar Style</label>
                  <select
                    value={(layout.navbar as string) || "floating"}
                    onChange={(e) => updateNested("layout", "navbar", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="floating">Floating</option>
                    <option value="fixed">Fixed</option>
                    <option value="static">Static</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Footer Style</label>
                  <select
                    value={(layout.footer as string) || "full"}
                    onChange={(e) => updateNested("layout", "footer", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="full">Full</option>
                    <option value="centered">Centered</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>

                {/* Navbar Button Settings */}
                <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Navbar Button</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Customize the call-to-action button that appears in your navigation bar.
                  </p>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={(layout.navbarButton as Record<string, unknown>)?.enabled !== false}
                      onChange={(e) => updateNested("layout", "navbarButton", {
                        ...((layout.navbarButton as Record<string, unknown>) || {}),
                        enabled: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Show Navbar Button</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">Display a CTA button in the navigation bar</p>
                    </div>
                  </label>

                  {(layout.navbarButton as Record<string, unknown>)?.enabled !== false && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={(layout.navbarButton as Record<string, string>)?.text || "Get Involved"}
                          onChange={(e) => updateNested("layout", "navbarButton", {
                            ...((layout.navbarButton as Record<string, unknown>) || {}),
                            text: e.target.value
                          })}
                          placeholder="Get Involved"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Button Link</label>
                        <input
                          type="text"
                          value={(layout.navbarButton as Record<string, string>)?.href || "/get-involved"}
                          onChange={(e) => updateNested("layout", "navbarButton", {
                            ...((layout.navbarButton as Record<string, unknown>) || {}),
                            href: e.target.value
                          })}
                          placeholder="/get-involved"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Settings */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Toggles</h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(features.shop as Record<string, unknown>)?.enabled === true}
                      onChange={(e) => updateDeepNested("template", "features", "shop", {
                        ...((features.shop as Record<string, unknown>) || {}),
                        enabled: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Shop / E-commerce</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">Enable product listings and checkout</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(features.programs as Record<string, unknown>)?.enabled !== false}
                      onChange={(e) => updateDeepNested("template", "features", "programs", { enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Programs</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">Display programs and services</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(features.events as Record<string, unknown>)?.enabled !== false}
                      onChange={(e) => updateDeepNested("template", "features", "events", { enabled: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 dark:border-zinc-600 rounded focus:ring-blue-500 dark:bg-zinc-700"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Events</p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400">Show events calendar</p>
                    </div>
                  </label>
                </div>

                {(features.shop as Record<string, unknown>)?.enabled === true && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Shop Settings</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Currency</label>
                        <select
                          value={(features.shop as Record<string, unknown>)?.currency as string || "USD"}
                          onChange={(e) => updateDeepNested("template", "features", "shop", {
                            ...((features.shop as Record<string, unknown>) || {}),
                            currency: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD ($)</option>
                          <option value="AUD">AUD ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Products Per Page</label>
                        <input
                          type="number"
                          value={(features.shop as Record<string, unknown>)?.productsPerPage as number || 12}
                          onChange={(e) => updateDeepNested("template", "features", "shop", {
                            ...((features.shop as Record<string, unknown>) || {}),
                            productsPerPage: parseInt(e.target.value) || 12
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
