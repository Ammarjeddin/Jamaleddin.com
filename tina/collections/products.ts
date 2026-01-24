import type { Collection } from "tinacms";

export const productsCollection: Collection = {
  name: "products",
  label: "Products",
  path: "content/products",
  format: "json",
  fields: [
    // Basic Info
    {
      type: "string",
      name: "name",
      label: "Product Name",
      required: true,
      isTitle: true,
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Short Description",
      ui: { component: "textarea" },
    },
    {
      type: "rich-text",
      name: "longDescription",
      label: "Full Description",
    },

    // Product Type
    {
      type: "string",
      name: "productType",
      label: "Product Type",
      required: true,
      options: [
        { value: "physical", label: "Physical Product" },
        { value: "digital", label: "Digital Download" },
        { value: "service", label: "Service" },
      ],
    },

    // Pricing
    {
      type: "object",
      name: "pricing",
      label: "Pricing",
      fields: [
        {
          type: "number",
          name: "price",
          label: "Price",
          required: true,
        },
        {
          type: "number",
          name: "compareAtPrice",
          label: "Compare At Price (original/sale)",
        },
        {
          type: "boolean",
          name: "taxable",
          label: "Taxable",
        },
      ],
    },

    // Images
    {
      type: "object",
      name: "images",
      label: "Product Images",
      list: true,
      fields: [
        { type: "image", name: "src", label: "Image" },
        { type: "string", name: "alt", label: "Alt Text" },
      ],
    },

    // Organization
    {
      type: "string",
      name: "category",
      label: "Category",
    },
    {
      type: "string",
      name: "tags",
      label: "Tags (comma-separated)",
    },

    // Inventory
    {
      type: "object",
      name: "inventory",
      label: "Inventory",
      fields: [
        {
          type: "boolean",
          name: "trackInventory",
          label: "Track Inventory",
        },
        {
          type: "number",
          name: "quantity",
          label: "Quantity in Stock",
        },
        {
          type: "string",
          name: "sku",
          label: "SKU",
        },
        {
          type: "boolean",
          name: "allowBackorder",
          label: "Allow Backorders",
        },
      ],
    },

    // Physical Product Fields
    {
      type: "object",
      name: "physical",
      label: "Physical Product Details",
      fields: [
        { type: "number", name: "weight", label: "Weight (oz)" },
        { type: "number", name: "length", label: "Length (in)" },
        { type: "number", name: "width", label: "Width (in)" },
        { type: "number", name: "height", label: "Height (in)" },
        { type: "boolean", name: "requiresShipping", label: "Requires Shipping" },
      ],
    },

    // Digital Product Fields
    {
      type: "object",
      name: "digital",
      label: "Digital Product Details",
      fields: [
        { type: "string", name: "downloadUrl", label: "Download URL" },
        { type: "string", name: "fileType", label: "File Type" },
        { type: "string", name: "fileSize", label: "File Size" },
        { type: "number", name: "downloadLimit", label: "Download Limit" },
      ],
    },

    // Service Fields
    {
      type: "object",
      name: "service",
      label: "Service Details",
      fields: [
        { type: "string", name: "duration", label: "Duration (e.g., 1 hour)" },
        { type: "boolean", name: "requiresBooking", label: "Requires Booking" },
        { type: "string", name: "bookingUrl", label: "Booking URL" },
      ],
    },

    // Variants (optional)
    {
      type: "object",
      name: "variants",
      label: "Product Variants",
      list: true,
      fields: [
        { type: "string", name: "name", label: "Variant Name" },
        { type: "string", name: "sku", label: "SKU" },
        { type: "number", name: "price", label: "Price (if different)" },
        { type: "number", name: "quantity", label: "Quantity" },
        { type: "image", name: "image", label: "Variant Image" },
      ],
    },

    // SEO
    {
      type: "object",
      name: "seo",
      label: "SEO",
      fields: [
        { type: "string", name: "metaTitle", label: "Meta Title" },
        { type: "string", name: "metaDescription", label: "Meta Description", ui: { component: "textarea" } },
        { type: "image", name: "ogImage", label: "Social Share Image" },
      ],
    },

    // Status
    {
      type: "string",
      name: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
      ],
    },
    {
      type: "boolean",
      name: "featured",
      label: "Featured Product",
    },
  ],
};
