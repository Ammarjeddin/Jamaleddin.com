import { BlockRenderer, Block } from "@/components/blocks";

// Demo blocks showcasing all available block types
const demoBlocks: Block[] = [
  {
    _template: "heroBanner",
    title: "Block Components Demo",
    subtitle: "Showcasing all 15 block types available in this template",
    height: "small",
  },
  {
    _template: "textBlock",
    heading: "Welcome to the Demo",
    content:
      "<p>This page demonstrates all the block components available in the template. Each block is fully customizable through the TinaCMS admin panel.</p>",
    alignment: "center",
  },
  {
    _template: "divider",
    style: "dots",
    size: "medium",
  },
  {
    _template: "stats",
    heading: "Statistics Block",
    stats: [
      { number: "2,500+", label: "Users", icon: "users" },
      { number: "15", label: "Years", icon: "calendar" },
      { number: "50+", label: "Partners", icon: "building" },
      { number: "95%", label: "Satisfaction", icon: "star" },
    ],
  },
  {
    _template: "cardsGrid",
    heading: "Cards Grid Block",
    subheading: "Display content in a responsive grid layout",
    columns: "3",
    cards: [
      {
        title: "Feature One",
        description: "Cards can display icons, images, or just text content.",
        icon: "zap",
      },
      {
        title: "Feature Two",
        description: "Perfect for services, features, or product highlights.",
        icon: "shield",
      },
      {
        title: "Feature Three",
        description: "Fully responsive and adapts to different screen sizes.",
        icon: "heart",
      },
    ],
  },
  {
    _template: "testimonials",
    heading: "Testimonials Block",
    layout: "grid",
    items: [
      {
        quote:
          "This template has everything we needed to launch our website quickly.",
        author: "Sarah Johnson",
        role: "Marketing Director",
      },
      {
        quote:
          "The admin panel makes it so easy to update content without any coding.",
        author: "Michael Chen",
        role: "Business Owner",
      },
      {
        quote:
          "Beautiful design and excellent performance out of the box.",
        author: "Emily Williams",
        role: "Designer",
      },
    ],
  },
  {
    _template: "ctaBox",
    heading: "Call to Action Block",
    text: "Encourage users to take action with prominent CTA sections.",
    buttonText: "Get Started",
    buttonLink: "/contact",
    style: "primary",
  },
  {
    _template: "faq",
    heading: "FAQ Block",
    items: [
      {
        question: "How do I customize the template?",
        answer:
          "You can customize colors, fonts, and layouts through the admin panel. No coding required!",
      },
      {
        question: "Is this template mobile responsive?",
        answer:
          "Yes! All components are fully responsive and work great on all devices.",
      },
      {
        question: "Can I add more blocks to pages?",
        answer:
          "Absolutely. The block system allows you to mix and match any blocks on any page.",
      },
    ],
  },
  {
    _template: "timeline",
    heading: "Timeline Block",
    items: [
      {
        year: "2020",
        title: "Company Founded",
        description: "Started with a vision to help communities thrive.",
      },
      {
        year: "2022",
        title: "Major Milestone",
        description: "Reached 1,000 members and expanded programs.",
      },
      {
        year: "2024",
        title: "New Initiatives",
        description: "Launched digital skills training and wellness programs.",
      },
    ],
  },
  {
    _template: "team",
    heading: "Team Block",
    subheading: "Meet our amazing team members",
    members: [
      {
        name: "John Smith",
        role: "Executive Director",
        bio: "Leading the organization with 20 years of nonprofit experience.",
        email: "john@example.com",
        linkedin: "https://linkedin.com",
      },
      {
        name: "Jane Doe",
        role: "Program Manager",
        bio: "Overseeing all community programs and partnerships.",
        email: "jane@example.com",
      },
      {
        name: "Bob Wilson",
        role: "Outreach Coordinator",
        bio: "Building relationships with community members and partners.",
        email: "bob@example.com",
      },
    ],
  },
  {
    _template: "video",
    heading: "Video Block",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "Embed YouTube or Vimeo videos with custom thumbnails",
  },
  {
    _template: "divider",
    style: "wave",
    size: "large",
  },
  {
    _template: "ctaBox",
    heading: "Ready to Build Your Site?",
    text: "Get started with this template today and launch your website in no time.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
    style: "accent",
  },
];

export default function DemoPage() {
  return <BlockRenderer blocks={demoBlocks} />;
}
