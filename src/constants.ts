// src/constants.ts
// Centralised immutable data used across the app. Exported as named constants.

export const NAV_LINKS = [
  { label: "About",          href: "#about" },
  { label: "Experience",     href: "#experience" },
  { label: "Education",      href: "#education" },
  { label: "Toolkit",        href: "#toolkit" },
  { label: "Projects",       href: "#work" },
  { label: "Certifications", href: "#certifications" },
  { label: "Honors",         href: "#honors" },
  { label: "Contact",        href: "#contact" },
] as const;

export const MARQUEE_SKILLS = [
  "POWER APPS",
  "POWER AUTOMATE",
  "COPILOT STUDIO",
  "POWER BI",
  "SHAREPOINT ONLINE",
  "LEAN SIX SIGMA",
  "AI AGENTS",
  "ADVANCED EXCEL & VBA",
  "PROCESS AUTOMATION",
  "DATA MODELING",
  "ENTERPRISE GOVERNANCE",
] as const;

export const STORY_METRICS = [
  { label: "EXPERIENCE",     val: "3+ YRS",   sub: "Enterprise Automation" },
  { label: "HOURS SAVED",   val: "2,000+",   sub: "Annual Process Gains" },
  { label: "ASSETS MANAGED",val: "30,000+", sub: "Enterprise Knowledge Base" },
  { label: "SECTORS SERVED",val: "13 GLOBAL", sub: "Cross-Industry Practice" },
  { label: "HONORS WON",    val: "5×",       sub: "KPMG Excellence Awards" },
] as const;

export const TOOLKIT_BENTO = [
  {
    category: "Microsoft Power Platform",
    tagline: "High-Scale Low-Code Engineering",
    // Icon placeholders – actual JSX will import the icon where used
    icon: null,
    items: ["Power Apps", "Power Automate", "Power BI"],
    metric: "1,700+ hrs / yr",
  },
  {
    category: "Copilot & Agentic GenAI",
    tagline: "Autonomous Workflow Intelligence",
    icon: null,
    items: ["Microsoft Copilot Studio", "Agentic Orchestration", "Prompt Engineering & Testing"],
    metric: "325 hrs drafted",
  },
  {
    category: "Enterprise Ecosystem",
    tagline: "Collaborative Data Backbones",
    icon: null,
    items: ["SharePoint Online Ecosystem", "Advanced Excel and VBA Macros", "Teams Webhook Workflows"],
    metric: "30,000+ assets",
  },
  {
    category: "Lean Six Sigma & Delivery",
    tagline: "Quantified Process Excellence",
    icon: null,
    items: ["DMAIC Process Re-engineering", "RFP & RFI Bid Management", "Taxonomy & Governance"],
    metric: "2× Kudos Awards",
  },
] as const;

export const CERTIFICATIONS = [
  {
    id: "ai901",
    issuer: "Microsoft",
    accent: "#0F6CBD",
    name: "Azure AI Fundamentals",
    code: "AI-901",
    image: "/ai-901.webp",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/KartikBhatt-9674/36CD65E522C4D856?sharingId",
  },
  {
    id: "agenticaioracle",
    issuer: "Oracle",
    accent: "#C74634",
    name: "Agentic AI Certified Foundations Associate",
    code: "Oracle",
    image: "/oracle.png",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=FC5EEEF261EFB38E89BA1D693D13D762945C8B8DA908F314D2CFB18501BFAD70",
  },
  // Add more certifications as needed
];

export const AWARDS = [
  { num: "01", title: "Kudos Award × 2", org: "KPMG", desc: "Awarded twice for Lean Six Sigma process re‑engineering saving 2,000+ hours annually, and migrating legacy Excel trackers to automated GenAI Copilot workflows." },
  { num: "02", title: "Super Team Award", org: "KPMG", desc: "Recognized for organizing and hosting employee council events, uniting cross‑functional teams and fostering firm‑wide collaboration." },
  { num: "03", title: "Ally of Inclusion", org: "KPMG", desc: "Honored for championing a culture of diversity, accessibility, and mutual respect across KPMG Global Services." },
  { num: "04", title: "Gurus@Work", org: "KPMG", desc: "Acknowledged for contributions to the firm's learning ecosystem, mentoring peers on automation tooling." },
] as const;
