/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useMemo, ReactNode, useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import {
  Download,
  Mail,
  Smartphone,
  Linkedin,
  X,
  Menu,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Refined Editorial Easing (Understated, Cinematic, Smooth) ─────────────────
const EASE_DECEL = [0.16, 1, 0.3, 1] as const;
const EASE_EXIT  = [0.4, 0, 1, 1] as const;
const SPRING_SNAPPY = { type: "spring", stiffness: 350, damping: 28 } as const;
const SPRING_BOUNCY = { type: "spring", stiffness: 260, damping: 22 } as const;

// ─── Canonical Navigation Links (Identical across Desktop & Mobile) ───────────
const navLinks = [
  { label: "About",          href: "#about" },
  { label: "Experience",     href: "#experience" },
  { label: "Education",      href: "#education" },
  { label: "Toolkit",        href: "#toolkit" },
  { label: "Projects",       href: "#work" },
  { label: "Certifications", href: "#certifications" },
  { label: "Honors",         href: "#honors" },
  { label: "Contact",        href: "#contact" },
] as const;

// ─── Continuous Marquee Skills Array ──────────────────────────────────────────
const marqueeSkills = [
  "POWER APPS",
  "POWER AUTOMATE",
  "COPILOT STUDIO",
  "POWER BI & DAX",
  "SHAREPOINT ONLINE",
  "LEAN SIX SIGMA",
  "AZURE AI",
  "AGENTIC AI",
  "ADVANCED EXCEL & VBA",
  "PROCESS AUTOMATION",
  "DATA MODELING",
  "ENTERPRISE GOVERNANCE",
] as const;

// ─── Real-time tenure calculation ─────────────────────────────────────────────
function calcTenure(start: Date, end: Date = new Date()): string {
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth()    - start.getMonth();
  if (m < 0) { y--; m += 12; }
  const parts: string[] = [];
  if (y > 0) parts.push(y + (y === 1 ? " YR"  : " YRS"));
  if (m > 0) parts.push(m + (m === 1 ? " MO" : " MOS"));
  return parts.join(" ") || "< 1 MO";
}

// ─── Cinematic Editorial Preloader (Atmospheric, Warm Silver, Telling A Story) ──
const LoadingScreen = memo(function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState("GATHERING ARCHITECTURAL ASSETS");
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();
    const duration = 1350; // Balanced 1.35s runtime: allows animations to pre-render smoothly

    const tick = () => {
      if (cancelled) return;
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      // Smooth cubic ease out
      const eased = 1 - Math.pow(1 - p, 2.5);
      const currentPct = Math.round(eased * 100);
      setProgress(currentPct);

      if (currentPct < 28) {
        setPhaseText("GATHERING ARCHITECTURAL ASSETS");
      } else if (currentPct < 60) {
        setPhaseText("SYNCHRONIZING POWER PLATFORM & COPILOT ECOSYSTEMS");
      } else if (currentPct < 88) {
        setPhaseText("ORCHESTRATING KNOWLEDGE TAXONOMY & SECTOR METRICS");
      } else {
        setPhaseText("KARTIK BHATT // SYSTEM READY");
      }

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          if (!cancelled) {
            setExiting(true);
            setTimeout(() => {
              if (!cancelled) onComplete();
            }, 400);
          }
        }, 150);
      }
    };

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#040404] text-white overflow-hidden select-none"
          exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: EASE_DECEL }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Subtle warm silver ambient glow (No harsh green blob) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-white/[0.025] rounded-full blur-[160px] pointer-events-none" />

          {/* Top telemetry status bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-[0.25em] text-white/40 uppercase">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
              <span>KB // SYSTEM RUNTIME</span>
            </div>
            <div className="hidden sm:block text-white/30">
              DELHI NCR · ENTERPRISE PRACTICE
            </div>
          </div>

          {/* Centerpiece: Cinematic typography + smooth counter */}
          <div className="relative z-10 my-auto text-center max-w-2xl mx-auto w-full">
            <div className="text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tighter text-white tabular-nums mb-3">
              {String(progress).padStart(2, "0")}
              <span className="text-white/30 text-3xl sm:text-5xl ml-1">%</span>
            </div>

            <div className="h-4 flex items-center justify-center">
              <p className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.22em] text-white/60 uppercase transition-all duration-300">
                {phaseText}
              </p>
            </div>

            {/* Micro hairline progress indicator */}
            <div className="mt-8 w-48 sm:w-64 h-[1px] bg-white/10 mx-auto overflow-hidden relative">
              <div
                className="h-full bg-white/80 transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom telemetry line */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/35 tracking-widest uppercase">
            <div>POWER PLATFORM · COPILOT STUDIO</div>
            <div>© {new Date().getFullYear()} KARTIK BHATT</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Custom Magnetic Cursor ───────────────────────────────────────────────────
const CustomCursor = memo(function CustomCursor() {
  const dotX  = useMotionValue(-200);
  const dotY  = useMotionValue(-200);
  const ringX = useSpring(useMotionValue(-200), { stiffness: 180, damping: 24, mass: 0.4 });
  const ringY = useSpring(useMotionValue(-200), { stiffness: 180, damping: 24, mass: 0.4 });
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX); dotY.set(e.clientY);
      ringX.set(e.clientX); ringY.set(e.clientY);
    };
    const over  = (e: MouseEvent) =>
      setHovered(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    const down  = () => setClicking(true);
    const up    = () => setClicking(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup",   up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
    };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", background: "#D9FF00" }}
        animate={{ width: clicking ? 4 : hovered ? 8 : 4, height: clicking ? 4 : hovered ? 8 : 4 }}
        transition={{ duration: 0.12 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          borderColor: hovered ? "rgba(217,255,0,0.9)" : "rgba(217,255,0,0.25)",
          transition: "border-color 0.2s",
        }}
        animate={{ width: clicking ? 16 : hovered ? 38 : 24, height: clicking ? 16 : hovered ? 38 : 24 }}
        transition={{ duration: 0.16 }}
      />
    </>
  );
});

// ─── Subtle Editorial Motion (Smooth reveals without visual clutter) ──────────
const ScrollReveal = memo(function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}) {
  const shouldReduceMotion = useReducedMotion();

  const getInitial = () => {
    switch (direction) {
      case "left":
        return { opacity: 0, x: -24 };
      case "right":
        return { opacity: 0, x: 24 };
      case "fade":
        return { opacity: 0 };
      case "up":
      default:
        return { opacity: 0, y: 22 };
    }
  };

  const getVisible = () => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.5,
      ease: EASE_DECEL,
      delay,
    },
  });

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : getInitial()}
      whileInView={shouldReduceMotion ? undefined : getVisible()}
      viewport={{ once: false, amount: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

// ─── Parallax Background (Clean, Subtle Architectural Atmosphere) ──────────────
const ParallaxBackground = memo(function ParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const slowX = useSpring(mouseX, { stiffness: 20, damping: 30, mass: 1.2 });
  const slowY = useSpring(mouseY, { stiffness: 20, damping: 30, mass: 1.2 });

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseX.set((e.clientX / window.innerWidth  - 0.5) * 30);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Delicate architectural grid */}
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "96px 96px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>

      {/* Vertical architectural divider guides */}
      <div className="absolute inset-y-0 left-8 md:left-16 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-8 md:right-16 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      {/* Atmospheric ambient halos */}
      <motion.div
        style={{ x: slowX, y: slowY }}
        className="absolute top-[-10%] right-[-6%] w-[55vw] h-[55vw] bg-[#D9FF00]/10 rounded-full blur-[140px] opacity-25"
      />
      <div className="absolute bottom-[-10%] left-[-6%] w-[45vw] h-[45vw] bg-emerald-500/5 rounded-full blur-[130px] opacity-15" />
    </div>
  );
});

// ─── Luxury Spotlight Card (Clean, Refined, Non-aggressive) ───────────────────
const LuxuryCard = memo(function LuxuryCard({
  children, className = "", onClick, ...props
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.45, ease: EASE_DECEL }}
      whileHover={!shouldReduceMotion ? { y: -3, transition: { duration: 0.2, ease: EASE_DECEL } } : undefined}
      whileTap={onClick && !shouldReduceMotion ? { scale: 0.99 } : undefined}
      className={[
        "spotlight-card relative overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.025] backdrop-blur-xl",
        "transition-colors duration-300",
        onClick
          ? "cursor-pointer hover:border-[#D9FF00]/40 hover:bg-white/[0.045] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(217,255,0,0.06)]"
          : "hover:border-white/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── Clean Section Heading (Pure Numbers, No Acts, No Chapters) ───────────────
function SectionHeading({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2.5">
        <span className="text-[#D9FF00] font-mono font-bold text-xs">{num}</span>
        <motion.div
          className="h-px bg-[#D9FF00]/60 origin-left"
          initial={shouldReduceMotion ? undefined : { scaleX: 0, width: 32 }}
          whileInView={shouldReduceMotion ? undefined : { scaleX: 1, width: 32 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.45, ease: EASE_DECEL }}
        />
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D9FF00] uppercase">{title}</span>
      </div>
      {subtitle && (
        <p className="text-white/60 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Static Datasets ──────────────────────────────────────────────────────────
const storyMetrics = [
  { label: "EXPERIENCE",     val: "3+ YRS",   sub: "Enterprise Automation" },
  { label: "HOURS SAVED",    val: "2,000+",   sub: "Annual Process Gains" },
  { label: "ASSETS MANAGED", val: "30,000+",  sub: "Enterprise Knowledge Base" },
  { label: "SECTORS SERVED", val: "13 GLOBAL", sub: "Cross-Industry Practice" },
  { label: "HONORS WON",     val: "5×",       sub: "KPMG Excellence Awards" },
];

export type ProjectItem = {
  id: string;
  category: "power-platform" | "genai" | "analytics";
  org: string;
  title: string;
  desc: string;
  impact: string;
  tags: string[];
  challenge: string;
  solution: string;
  architecture: string;
  outcomes: string[];
  techStack: string[];
};

const allProjects: ProjectItem[] = [
  {
    id: "kpmg-harvest",
    category: "power-platform",
    org: "KPMG",
    title: "Automated Knowledge Harvesting",
    desc: "Engineered automated Power Apps + Power Automate workflow for harvesting, vetting, and categorizing enterprise knowledge assets across 13 global sectors.",
    impact: "1,200 hrs / year saved",
    tags: ["POWER APPS", "POWER AUTOMATE", "SHAREPOINT"],
    challenge: "Manual harvesting of intellectual capital, credentials, and RFP proposals across 13 cross-functional sectors required over 1,500 hours annually, leading to submission delays, missing metadata, and lost proposal collateral.",
    solution: "Architected an end-to-end Power Apps portal combined with scheduled Power Automate multi-stage approval flows, automatic taxonomy tagging, and automated metadata validation.",
    architecture: "Integrated with enterprise Azure Active Directory for role-based governance, automated multi-tier approval routing, and scheduled SPO document indexing with continuous audit logging.",
    outcomes: [
      "Saved 1,200+ consulting and analyst hours annually",
      "Turnaround time from project close to asset publication dropped from 14 days to under 48 hours",
      "Eliminated duplicate proposals across all 13 industry sectors",
      "Achieved 100% adherence to KPMG global taxonomy guidelines",
    ],
    techStack: ["Microsoft Power Apps", "Power Automate Cloud Flows", "SharePoint Online", "Azure AD"],
  },
  {
    id: "kpmg-migration",
    category: "power-platform",
    org: "KPMG",
    title: "SPO List Migration & Modernization",
    desc: "Migrated legacy disparate Excel trackers to unified SharePoint Online architecture with automated alert webhooks and SLA tracking.",
    impact: "500 hrs saved",
    tags: ["SHAREPOINT ONLINE", "POWER AUTOMATE", "VBA & EXCEL"],
    challenge: "Legacy Excel spreadsheets across different practice teams suffered from frequent version control conflicts, absence of centralized audit logging, and lack of real-time multi-user synchronization.",
    solution: "Transitioned datasets into relational SharePoint Online lists with role-based view permissions, automated webhook notifications, and Power Automate update triggers.",
    architecture: "Engineered automated data hygiene validation routines, custom Microsoft Teams webhook integrations for instant notifications, and automated weekly status reconciliation.",
    outcomes: [
      "Saved 500+ hours in manual reconciliation and status emails",
      "Achieved 100% audit logging compliance for sensitive client assets",
      "Real-time visibility for project leads and executive sponsors",
      "Zero data collisions across multi-user concurrent updates",
    ],
    techStack: ["SharePoint Online", "Power Automate", "Microsoft Teams Webhooks", "Excel VBA Scripts"],
  },
  {
    id: "kpmg-copilot",
    category: "genai",
    org: "KPMG",
    title: "Content Drafter Copilot Agent",
    desc: "Developed custom Copilot Studio agent to parse unstructured deliverables, draft fields, and apply taxonomy tags based on KPMG editorial guidelines.",
    impact: "325 hrs saved",
    tags: ["COPILOT STUDIO", "GENAI", "LEAN SIX SIGMA"],
    challenge: "Consultants submitted raw deliverables with inconsistent summaries, missing sector classifications, and variable naming conventions, demanding extensive manual editing.",
    solution: "Built a customized Microsoft Copilot Studio AI agent fine-tuned on KPMG standard operating guidelines to extract key insights, summarize proposals, and suggest compliant taxonomy.",
    architecture: "Designed multi-turn validation prompts, context extraction pipelines, and automated feedback loops aligned directly with Lean Six Sigma DMAIC quality gates.",
    outcomes: [
      "Saved 325 hours annually across knowledge management curators",
      "Standardized 100% of asset metadata against the master taxonomy rubric",
      "Honored with KPMG Kudos Award for GenAI innovation",
      "Accelerated review cycle times by 68%",
    ],
    techStack: ["Microsoft Copilot Studio", "Agentic Orchestration", "Prompt Engineering", "SharePoint Syntex"],
  },
  {
    id: "kpmg-metrics",
    category: "analytics",
    org: "KPMG",
    title: "Engagement Metrics BI Dashboard",
    desc: "Centralized executive repository for engagement metrics across 30,000+ assets, visualized in Power BI for executive and stakeholder decision-making.",
    impact: "30K+ assets tracked",
    tags: ["POWER BI", "DATA ANALYTICS", "SQL"],
    challenge: "Practice teams lacked unified intelligence on which knowledge assets, RFP templates, and whitepapers were actually driving deal conversion and reuse across sectors.",
    solution: "Constructed comprehensive Power BI dashboards connecting transactional audit logs and usage telemetry with automated refresh schedules and interactive slicers.",
    architecture: "Designed custom DAX measures for asset velocity, multi-source SQL aggregation pipelines, and automated monthly PowerPoint export packs for sector leads.",
    outcomes: [
      "Identified top 10% highest-converting proposal collateral for executive review",
      "Decommissioned 2,000+ obsolete or redundant documentation files",
      "Automated monthly KPI packs for 13 global practice teams",
      "Unlocked data-driven content retirement and update roadmaps",
    ],
    techStack: ["Power BI Desktop & Service", "DAX", "Power Query (M)", "SQL Server", "SharePoint Analytics"],
  },
  {
    id: "gl-genai",
    category: "genai",
    org: "GLOBALLOGIC",
    title: "GenAI Training Dataset — Google",
    desc: "Piloted and delivered foundational test and production datasets for multimodal GenAI training on mobile screens.",
    impact: "74% → 95% quality",
    tags: ["GENAI", "QA DESIGN", "PROCESS ENGINEERING"],
    challenge: "Initial training dataset for on-screen intent recognition and multimodal search on mobile operating systems suffered from prompt ambiguity and annotation variance.",
    solution: "Formulated rigorous quality assurance benchmarks, golden evaluation sets, and systematic reviewer validation guidelines to calibrate annotator outputs.",
    architecture: "Built statistical error-tracking matrix, edge-case triage protocol, and automated verification scripts ensuring high inter-annotator agreement.",
    outcomes: [
      "Elevated project quality score from 74% to 95%",
      "Reduced annotation error rate by 25% within first 6 weeks",
      "Delivered production milestones two weeks ahead of committed schedule",
      "Awarded extended contract expansion from client leadership",
    ],
    techStack: ["Google Multimodal Data Evaluation", "Python Data Scripts", "Quality Benchmarking", "Taxonomy Mapping"],
  },
  {
    id: "gl-retrieval",
    category: "genai",
    org: "GLOBALLOGIC",
    title: "Multi-Level Document Retrieval AI",
    desc: "Engineered retrieval pipeline pulling context-aware answers from deep hierarchical enterprise documentation.",
    impact: "1 of 3 pilots secured",
    tags: ["AI PIPELINES", "RAG", "PILOT MGMT"],
    challenge: "Complex regulatory and technical PDF documents prevented standard keyword search from retrieving correct nested subsections and specifications.",
    solution: "Piloted an extraction and retrieval pipeline benchmarked against competitors, combining semantic chunking and structured context scoring.",
    architecture: "Created hierarchical document parsing trees, semantic vector scoring models, and latency-optimized response generation modules.",
    outcomes: [
      "Won competitive pilot benchmarking against prominent multinational software competitors",
      "Secured formal multi-quarter implementation contract for the practice",
      "Achieved sub-second contextual retrieval for technical documentation",
      "Demonstrated 100% precision on critical regulatory compliance queries",
    ],
    techStack: ["Semantic Retrieval", "RAG Architecture", "Benchmarking", "Document Parsing"],
  },
];

const chartData = [
  { name: "Power Platform",        hours: 1200, color: "#D9FF00" },
  { name: "VBA & Process Scripts", hours: 785,  color: "#34D399" },
  { name: "Copilot Agents",        hours: 325,  color: "#A855F7" },
  { name: "SharePoint Systems",    hours: 150,  color: "#F43F5E" },
  { name: "Process Optimization",  hours: 100,  color: "#F59E0B" },
];

const toolkitBento = [
  {
    category: "Microsoft Power Platform",
    tagline: "High-Scale Low-Code Engineering",
    icon: <Cpu className="text-[#D9FF00]" size={18} />,
    items: [
      "Power Apps (Canvas & Model-Driven)",
      "Power Automate (Cloud & Desktop)",
      "Power BI (DAX, Modeling)",
    ],
    metric: "1,700+ hrs / yr",
  },
  {
    category: "Copilot & Agentic GenAI",
    tagline: "Autonomous Workflow Intelligence",
    icon: <Sparkles className="text-[#A855F7]" size={18} />,
    items: [
      "Microsoft Copilot Studio",
      "Agentic Orchestration",
      "Prompt Engineering & Testing",
    ],
    metric: "325 hrs drafted",
  },
  {
    category: "Enterprise Ecosystem",
    tagline: "Collaborative Data Backbones",
    icon: <Layers className="text-[#34D399]" size={18} />,
    items: [
      "SharePoint Online Ecosystem",
      "Advanced Excel and VBA Macros",
      "SQL Query Engineering",
      "Teams Webhook Workflows",
    ],
    metric: "30,000+ assets",
  },
  {
    category: "Lean Six Sigma & Delivery",
    tagline: "Quantified Process Excellence",
    icon: <Terminal className="text-[#F59E0B]" size={18} />,
    items: [
      "Lean Six Sigma (Yellow Belt)",
      "DMAIC Process Re-engineering",
      "RFP & RFI Bid Management",
      "Taxonomy & Governance",
    ],
    metric: "2× Kudos Awards",
  },
];

const certifications = [
  {
    id: "ai901", issuer: "Microsoft", accent: "#0F6CBD",
    name: "Azure AI Fundamentals", code: "AI-901", image: "/ai-901.webp",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/KartikBhatt-9674/36CD65E522C4D856?sharingId",
  },
  {
    id: "agenticaioracle", issuer: "Oracle", accent: "#C74634",
    name: "Agentic AI Certified Foundations Associate", code: "Oracle", image: "/oracle.png",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=FC5EEEF261EFB38E89BA1D693D13D762945C8B8DA908F314D2CFB18501BFAD70",
  },
  {
    id: "ab731", issuer: "Microsoft", accent: "#D83B01",
    name: "AI Transformation Leader", code: "AB-731", image: "/ai-transformation-leader.svg",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/KartikBhatt-9674/C3EAB8B975263DC4?sharingId=E5019B4408E33F28",
  },
  {
    id: "ab730", issuer: "Microsoft", accent: "#D83B01",
    name: "AI Business Professional", code: "AB-730", image: "/ai-business-professional.webp",
    url: "https://learn.microsoft.com/api/credentials/share/en-gb/KartikBhatt-9674/93E6DA71E489D648?sharingId",
  },
  {
    id: "lss", issuer: "KPMG", accent: "#F2B705",
    name: "Lean Six Sigma Yellow Belt", code: "LSS-YB", image: "/lss-yellow-belt.webp",
    url: "https://www.linkedin.com/in/kartik-bhatt-b77249219/overlay/Certifications/588596833/treasury/?profileId=ACoAADcH70sBCPygwhhyc7sNsaMsnUNn8mJC50I",
  },
  {
    id: "pbi", issuer: "NASBA", accent: "#314EF5",
    name: "Power BI Essential Training", code: "NASBA", image: "/nasba.webp",
    url: "https://www.linkedin.com/learning/certificates/9e8c7d709aa9da810e5dff415caf1d30ff07a2d1a6009bfd6aad17ffbda3e771?u=88586714",
  },
  {
    id: "anthropic", issuer: "Anthropic", accent: "#D97757",
    name: "AI Fluency Framework & Foundations", code: "Anthropic", image: "/anthropic.jpeg",
    url: "https://verify.skilljar.com/c/8d48xix5aujm",
  },
  {
    id: "cisco", issuer: "Cisco", accent: "#049FD9",
    name: "Data Analytics Essentials", code: "Cisco", image: "/cisco.png",
    url: "https://www.credly.com/badges/eccf1481-fea5-4a16-b999-5f085aefa4f8/print",
  },
];

const awards = [
  { num: "01", title: "Kudos Award × 2", org: "KPMG", desc: "Awarded twice for Lean Six Sigma process re-engineering saving 2,000+ hours annually, and migrating legacy Excel trackers to automated GenAI Copilot workflows." },
  { num: "02", title: "Super Team Award", org: "KPMG", desc: "Recognized for organizing and hosting employee council events, uniting cross-functional teams and fostering firm-wide collaboration." },
  { num: "03", title: "Ally of Inclusion", org: "KPMG", desc: "Honored for championing a culture of diversity, accessibility, and mutual respect across KPMG Global Services." },
  { num: "04", title: "Gurus@Work", org: "KPMG", desc: "Acknowledged for contributions to the firm's learning ecosystem, mentoring peers on automation tooling." },
];

const contactItems = [
  { id: "email", icon: <Mail size={22} />, label: "EMAIL", val: "kb270102@gmail.com", href: "mailto:kb270102@gmail.com" },
  { id: "phone", icon: <Smartphone size={22} />, label: "PHONE", val: "+91-7428062532", href: "tel:+917428062532" },
  { id: "linkedin", icon: <Linkedin size={22} />, label: "LINKEDIN", val: "linkedin.com/in/kartik-bhatt", href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

// ─── Certification Badge Component ────────────────────────────────────────────
function CertificationBadge({
  cert, hovered, dimmed, offset,
}: {
  cert: typeof certifications[number];
  hovered: boolean;
  dimmed: boolean;
  offset: number;
}) {
  const { accent, name, issuer, image, url } = cert;
  const shouldReduceMotion = useReducedMotion();

  const badgeVisual = image ? (
    <img
      src={image}
      alt={`${issuer} credential: ${name}`}
      loading="lazy"
      className="w-full h-full object-contain"
      style={{ filter: hovered ? `drop-shadow(0 0 16px ${accent}80)` : "none" }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center font-bold text-xs" style={{ color: accent }}>
      {name}
    </div>
  );

  return (
    <motion.div
      className="relative shrink-0 select-none flex items-center justify-center w-[clamp(54px,7.5vw,108px)] h-[clamp(62px,8.8vw,126px)]"
      style={{ zIndex: hovered ? 30 : 10 }}
      animate={shouldReduceMotion ? undefined : {
        x: offset,
        scale: hovered ? 1.2 : 1,
        y: hovered ? -8 : 0,
        opacity: dimmed ? 0.35 : 1,
      }}
      transition={SPRING_BOUNCY}
      data-hover
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${issuer} ${name} credential on official verification portal`}
        className="w-full h-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#D9FF00] rounded-xl"
      >
        {badgeVisual}
      </a>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: EASE_DECEL }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max text-center pointer-events-none bg-black/95 px-3 py-1 rounded-lg border border-white/10 shadow-lg"
          >
            <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: accent }}>{issuer}</div>
            <div className="text-[9px] font-medium text-white/70">{name}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CertificationsRow = memo(function CertificationsRow() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7 py-6 w-full max-w-6xl mx-auto">
      {certifications.map((cert, i) => {
        const hovered = hoverIdx === i;
        const dimmed  = hoverIdx !== null && !hovered;
        const offset  = hoverIdx === null ? 0 : i < hoverIdx ? -8 : i > hoverIdx ? 8 : 0;
        return (
          <div
            key={cert.id}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            className="p-1"
          >
            <CertificationBadge cert={cert} hovered={hovered} dimmed={dimmed} offset={offset} />
          </div>
        );
      })}
    </div>
  );
});

// ─── Main Application Component ───────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState<"all" | "power-platform" | "genai" | "analytics">("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Subtle interactive 3D portrait mouse tilt
  const portraitMouseX = useMotionValue(0);
  const portraitMouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(portraitMouseY, [-0.5, 0.5], [3, -3]), { stiffness: 120, damping: 20 });
  const tiltY = useSpring(useTransform(portraitMouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 20 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    portraitMouseX.set(x);
    portraitMouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    portraitMouseX.set(0);
    portraitMouseY.set(0);
  };

  // Tick clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Track scroll position for navbar styling
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) setSelectedProject(null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, mobileMenuOpen]);

  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  const filteredProjects = useMemo(() => {
    if (projectFilter === "all") return allProjects;
    return allProjects.filter(p => p.category === projectFilter);
  }, [projectFilter]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#D9FF00] selection:text-black">
      <style>{`
        @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
        @keyframes dotblink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        section[id] { scroll-margin-top: 88px; }
      `}</style>

      {/* Desktop Custom Cursor */}
      <div className="hidden md:block"><CustomCursor /></div>

      {/* Cinematic Editorial Preloader */}
      <LoadingScreen onComplete={handleLoadComplete} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="site-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE_DECEL }}
            className="overflow-x-hidden w-full relative"
          >
            <ParallaxBackground />

            {/* ══════════════════════════════════════════════════
                TOP BAR CONTRACT: [Wordmark] — [Nav Links] — [Action]
            ══════════════════════════════════════════════════ */}
            <motion.header
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_DECEL }}
              className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] md:w-[92%] max-w-7xl z-[900]"
            >
              <nav
                className="relative backdrop-blur-xl border rounded-2xl px-4 md:px-7 h-16 flex items-center justify-between transition-all duration-300"
                style={{
                  background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.55)",
                  borderColor: scrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                  boxShadow: scrolled ? "0 10px 36px rgba(0,0,0,0.7), 0 0 1px 1px rgba(217,255,0,0.08)" : "none",
                }}
                aria-label="Primary Navigation"
              >
                {/* Zone 1: Single element wordmark */}
                <a
                  href="#"
                  className="flex items-center gap-2.5 group focus-visible:outline-none shrink-0"
                  aria-label="Kartik Bhatt Home"
                >
                  <div
                    className="w-2 h-2 bg-[#D9FF00] rounded-full"
                    style={{ animation: "dotblink 2.4s ease-in-out infinite" }}
                  />
                  <span className="font-extrabold tracking-tight text-sm uppercase group-hover:text-[#D9FF00] transition-colors">
                    kartik.bhatt
                  </span>
                </a>

                {/* Zone 2: Canonical Navigation Links for Desktop */}
                <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] font-bold tracking-wider text-white/50 uppercase">
                  {navLinks.map(link => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      whileHover={shouldReduceMotion ? undefined : { y: -1, color: "#D9FF00" }}
                      transition={{ duration: 0.15, ease: EASE_DECEL }}
                      className="hover:text-[#D9FF00] transition-colors relative py-1 focus-visible:outline-none focus-visible:text-[#D9FF00] whitespace-nowrap"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* Zone 3: Primary action + Mobile menu trigger */}
                <div className="flex items-center gap-3 shrink-0">
                  <motion.a
                    href="/Resume.pdf"
                    download="Kartik_Bhatt_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    transition={SPRING_SNAPPY}
                    className="bg-[#D9FF00] text-black px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 hover:bg-[#cbf000] shadow-[0_0_20px_rgba(217,255,0,0.25)] focus-visible:outline-none"
                    data-testid="download-resume-btn"
                  >
                    <span>Resume</span>
                    <Download size={13} aria-hidden="true" />
                  </motion.a>

                  {/* Mobile toggle button (shown on < lg) */}
                  <motion.button
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                    className="lg:hidden p-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-[#D9FF00]/40 transition-colors focus-visible:outline-none"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                    data-testid="mobile-menu-btn"
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.button>
                </div>
              </nav>

              {/* Mobile Navigation Drawer */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15, ease: EASE_EXIT } }}
                    transition={SPRING_SNAPPY}
                    className="lg:hidden mt-2 p-4 rounded-2xl bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto"
                  >
                    {navLinks.map((link, idx) => (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2, ease: EASE_DECEL }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-semibold tracking-wide text-white/75 hover:text-[#D9FF00] py-2.5 px-3 rounded-lg hover:bg-white/5 border-b border-white/5 flex items-center justify-between transition-colors"
                      >
                        <span>{link.label}</span>
                        <ChevronRight size={14} className="text-white/30" />
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.header>

            {/* ══════════════════════════════════════════════════
                HERO SECTION (Theatrical Stagger, Masked Text, 3D Tilt Portrait)
            ══════════════════════════════════════════════════ */}
            <main className="overflow-x-hidden w-full">
              <section
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                className="min-h-[88vh] pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex items-center"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch w-full">
                  {/* Left column (Text & Actions) */}
                  <div className="lg:col-span-7 flex flex-col justify-between py-2">
                    <div>
                      {/* Clean Eyebrow with kinetic line reveal */}
                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: EASE_DECEL, delay: 0.1 }}
                      >
                        <div className="w-8 h-px bg-[#D9FF00]" />
                        <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#D9FF00] uppercase">
                          Portfolio // Kartik Bhatt
                        </span>
                      </motion.div>

                      {/* Main Typography with masked slide-up reveal */}
                      <div className="overflow-hidden">
                        <motion.h1
                          className="text-[64px] sm:text-[90px] md:text-[112px] font-black leading-[0.88] tracking-tighter text-white"
                          initial={{ y: 40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.65, ease: EASE_DECEL, delay: 0.15 }}
                        >
                          kartik<br />
                          <span className="text-white/85">bhatt</span>
                          <span className="text-[#D9FF00]">_</span>
                        </motion.h1>
                      </div>

                      {/* Professional Bio */}
                      <motion.p
                        className="mt-6 text-base md:text-lg text-white/85 font-normal leading-relaxed max-w-xl"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.3 }}
                      >
                        Business Associate at <span className="text-white font-semibold">KPMG</span> specializing in enterprise
                        Power Platform automation, Copilot Studio agents, and knowledge repository ecosystems across 13 global sectors.
                      </motion.p>
                    </div>

                    <div className="mt-8 lg:mt-0">
                      {/* Quantified Metrics Ribbon */}
                      <motion.div
                        className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-white/50 tracking-wider uppercase font-mono mb-6"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.4 }}
                      >
                        <span className="text-[#D9FF00]">2,000+ Hours Saved</span>
                        <span>·</span>
                        <span className="text-white/80">30,000+ Assets Catalogued</span>
                        <span>·</span>
                        <span className="text-[#D9FF00]">5× Honors Won</span>
                      </motion.div>

                      {/* Interactive Buttons */}
                      <motion.div
                        className="flex flex-wrap items-center gap-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.5 }}
                      >
                        <motion.a
                          href="#work"
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                          transition={SPRING_SNAPPY}
                          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-[#D9FF00] hover:text-black border border-white/10 hover:border-transparent font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 group text-white"
                        >
                          <span>Explore Case Studies</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                        </motion.a>
                        <motion.a
                          href="#contact"
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                          transition={SPRING_SNAPPY}
                          className="px-6 py-3 rounded-xl border border-white/15 hover:border-white/40 text-white/90 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Get in Touch
                        </motion.a>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right column: Black & White Photo with Interactive 3D Depth */}
                  <motion.div
                    className="lg:col-span-5 flex flex-col"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: EASE_DECEL, delay: 0.25 }}
                    style={shouldReduceMotion ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 800 }}
                  >
                    <div className="relative w-full h-full min-h-[460px] md:min-h-[500px] border border-white/15 rounded-3xl overflow-hidden bg-[#111111] shadow-[0_0_50px_rgba(217,255,0,0.06)] group">
                      <img
                        src="/profile.jpg"
                        alt="Portrait of Kartik Bhatt"
                        loading="eager"
                        className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-110 brightness-100 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-6 left-6 z-20">
                        <div className="flex items-center gap-2.5 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl shadow-lg">
                          <div className="w-2 h-2 bg-[#D9FF00] rounded-full animate-pulse" />
                          <span className="text-[10px] font-bold tracking-widest uppercase text-white font-mono">
                            KPMG · BUSINESS ASSOCIATE
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  CONTINUOUS MOVING SKILLS CAROUSEL
              ══════════════════════════════════════════════════ */}
              <div className="w-full py-5 border-y border-white/5 bg-white/[0.015] overflow-hidden relative select-none">
                <div className="flex w-max gap-8 animate-[marquee_32s_linear_infinite]">
                  {[...marqueeSkills, ...marqueeSkills].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono font-bold tracking-widest text-white/70 hover:text-[#D9FF00] transition-colors uppercase">
                        {skill}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]/50" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  01. ABOUT (Unboxed Narrative & Clean Executive Summary)
              ══════════════════════════════════════════════════ */}
              <section id="about" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="01"
                    title="About Me"
                    subtitle="Turning fragmented spreadsheets and manual administrative bottlenecks into resilient, self-healing automation systems."
                  />

                  {/* Quantitative proof ribbon */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-14">
                    {storyMetrics.map((stat, i) => (
                      <ScrollReveal key={stat.label} delay={i * 0.04}>
                        <LuxuryCard className="p-6 flex flex-col justify-between h-full">
                          <div className="text-3xl md:text-4xl font-mono font-black tracking-tight tabular-nums text-white">
                            {stat.val}
                          </div>
                          <div className="mt-2">
                            <div className="text-[10px] font-mono font-bold tracking-wider text-[#D9FF00] uppercase">
                              {stat.label}
                            </div>
                            <div className="text-[9px] text-white/50 uppercase tracking-wide mt-0.5">
                              {stat.sub}
                            </div>
                          </div>
                        </LuxuryCard>
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Equal-Height Unboxed Narrative & Executive Summary Block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    {/* Left text column - Unboxed editorial style */}
                    <ScrollReveal direction="left" className="lg:col-span-7 flex flex-col justify-between py-2">
                      <div className="space-y-5 text-white/80 text-base md:text-[17px] font-light leading-relaxed">
                        <p>
                          Across three continuous years at <span className="text-white font-medium">KPMG</span> and <span className="text-white font-medium">GlobalLogic</span>, my focus has been consistent: replacing fragmented, high-friction manual operations with automated, auditable, enterprise-grade architectures.
                        </p>
                        <p>
                          Whether orchestrating end-to-end Power Apps harvesting workflows that reclaim 1,500+ hours annually, or developing Copilot Studio agents that summarize deliverables against KPMG taxonomy standards, I bridge technical capability with measurable efficiency.
                        </p>
                        <p>
                          Certified in Microsoft Azure AI, Oracle Agentic AI, and Lean Six Sigma, I build solutions designed for production stability, data compliance, and reliable operational adoption across global practice teams.
                        </p>
                        <p className="text-white/65 text-sm pt-2">
                          Specialized in automating complex enterprise approval cycles, designing high-adoption SharePoint knowledge catalogs, and transforming disparate spreadsheets into centralized, self-updating data backbones.
                        </p>
                      </div>
                    </ScrollReveal>

                    {/* Right executive summary card (Clean table, zero status bit, matching height) */}
                    <ScrollReveal direction="right" className="lg:col-span-5 flex flex-col">
                      <LuxuryCard className="p-8 md:p-9 h-full flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold tracking-[0.2em] text-[#D9FF00] uppercase mb-5 flex items-center justify-between">
                            <span>Executive Summary</span>
                            <span className="text-white/40 font-normal">Profile</span>
                          </div>
                          <div className="space-y-1">
                            {[
                              { l: "NAME",         v: "Kartik Bhatt" },
                              { l: "ORGANIZATION", v: "KPMG Global Services" },
                              { l: "ROLE",         v: "Business Associate" },
                              { l: "PRACTICE",     v: "13 Global Sectors" },
                              { l: "LOCATION",     v: "Delhi NCR, India" },
                              { l: "ACADEMIA",     v: "BCA Computer Science (9.3/10)" },
                              { l: "RANK",         v: "Top 1% Cohort Distinction" },
                            ].map(item => (
                              <div key={item.l} className="flex justify-between items-center py-2.5 border-b border-white/5 text-sm gap-2">
                                <span className="text-[10px] font-mono font-bold text-white/50 tracking-[0.15em] uppercase shrink-0">{item.l}</span>
                                <span className="font-medium text-white/95 text-right">{item.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </LuxuryCard>
                    </ScrollReveal>
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  02. EXPERIENCE (Updated Roles & Top Right Tags)
              ══════════════════════════════════════════════════ */}
              <section id="experience" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="02"
                    title="Experience"
                    subtitle="Chronology of technical execution, workflow automation, and multi-year delivery across premier enterprise firms."
                  />

                  <div className="space-y-8">
                    {/* Organization 1: KPMG */}
                    <ScrollReveal direction="up">
                      <LuxuryCard className="p-8 md:p-10">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 mb-8 border-b border-white/10">
                          <div>
                            <div className="text-xs font-mono font-bold text-[#D9FF00] tracking-widest uppercase mb-1">
                              Current Arena · May 2024 — Present
                            </div>
                            <h3 className="text-3xl font-black tracking-tight text-white">
                              KPMG Global Services
                            </h3>
                            <div className="text-xs font-mono text-white/40 mt-1 uppercase">
                              Gurugram, Haryana · {calcTenure(new Date(2024, 4, 1), now)} Tenure
                            </div>
                          </div>

                          {/* Requested tag on top right */}
                          <div className="text-xs font-mono text-[#D9FF00] bg-[#D9FF00]/10 px-3.5 py-1.5 rounded-lg border border-[#D9FF00]/25 font-bold uppercase tracking-wider self-start sm:self-auto shadow-sm">
                            Knowledge Management
                          </div>
                        </div>

                        {/* Roles */}
                        <div className="space-y-8">
                          {/* Current Role */}
                          <div className="relative pl-6 border-l-2 border-[#D9FF00]">
                            <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[#D9FF00] shadow-[0_0_10px_#D9FF00]" />
                            <h4 className="text-xl font-bold text-white mb-1">Business Associate</h4>
                            <div className="text-xs font-mono text-white/50 mb-3 uppercase tracking-wider">
                              May 2024 — Present
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mb-4 font-light">
                              Managing knowledge management operations, stakeholder coordination, and Power Platform automation across global accounts.
                            </p>
                            <ul className="space-y-2">
                              {[
                                "Expanded scope across Power Platform and modern SharePoint Online ecosystem",
                                "Cross-functional stakeholder coordination across 13 industry sectors",
                                "Delivery of key automation workflows and knowledge management initiatives",
                              ].map(b => (
                                <li key={b} className="flex gap-2.5 text-sm items-start text-white/85">
                                  <span className="text-[#D9FF00] font-bold shrink-0">→</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Previous Analyst Role */}
                          <div className="relative pl-6 border-l-2 border-white/20">
                            <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/40" />
                            <h4 className="text-lg font-bold text-white/95 mb-1">Analyst</h4>
                            <div className="text-xs font-mono text-white/50 mb-3 uppercase tracking-wider">
                              May 2024 — September 2025
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed mb-4 font-light">
                              Led cross-functional initiatives across 13 sectors with end-to-end stakeholder coordination, proposal enablement, and Power Platform process re-engineering.
                            </p>
                            <ul className="space-y-2">
                              {[
                                "Architected Power Platform automations saving 2,000+ hours annually",
                                "Managed centralized repositories cataloguing over 30,000 enterprise assets",
                                "Earned 5 recognition awards including 2× Kudos Awards for Lean Six Sigma impact",
                              ].map(b => (
                                <li key={b} className="flex gap-2.5 text-sm items-start text-white/85">
                                  <span className="text-[#D9FF00] font-bold shrink-0">→</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </LuxuryCard>
                    </ScrollReveal>

                    {/* Organization 2: GlobalLogic */}
                    <ScrollReveal direction="up">
                      <LuxuryCard className="p-8 md:p-10">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 mb-8 border-b border-white/10">
                          <div>
                            <div className="text-xs font-mono font-bold text-white/50 tracking-widest uppercase mb-1">
                              September 2022 — October 2023
                            </div>
                            <h3 className="text-3xl font-black tracking-tight text-white">
                              GlobalLogic Technologies
                            </h3>
                            <div className="text-xs font-mono text-white/40 mt-1 uppercase">
                              Gurugram, Haryana · 1 YR 2 MOS
                            </div>
                          </div>

                          {/* Requested tag on top right */}
                          <span className="px-3.5 py-1.5 rounded-lg bg-[#D9FF00]/10 border border-[#D9FF00]/25 text-xs font-mono text-[#D9FF00] font-bold uppercase tracking-wider self-start sm:self-auto shadow-sm">
                            Content Engineering
                          </span>
                        </div>

                        <div className="relative pl-6 border-l-2 border-white/20">
                          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/40" />
                          <h4 className="text-xl font-bold text-white mb-1">Associate Analyst</h4>
                          <div className="text-xs font-mono text-white/50 mb-3 uppercase tracking-wider">
                            Sep 2022 — Oct 2023
                          </div>
                          <p className="text-white/70 text-sm leading-relaxed mb-4 font-light">
                            Delivered content engineering and AI training datasets for Google &amp; Microsoft flagship initiatives, securing competitive pilot bids against major multinational software competitors.
                          </p>
                          <ul className="space-y-2">
                            {[
                              "Formulated GenAI training and evaluation datasets for Google Android search",
                              "Enhanced QA benchmark accuracy from 74% to 95%",
                              "Led 3 competitive pilot evaluation phases — securing 100% award rate",
                            ].map(b => (
                              <li key={b} className="flex gap-2.5 text-sm items-start text-white/85">
                                <span className="text-[#D9FF00] font-bold shrink-0">→</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </LuxuryCard>
                    </ScrollReveal>
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  03. EDUCATION
              ══════════════════════════════════════════════════ */}
              <section id="education" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="03"
                    title="Education"
                    subtitle="Computer science foundation rooted in software systems, database architecture, and graduating in the top 1% of the cohort."
                  />

                  <ScrollReveal direction="up">
                    <LuxuryCard className="p-8 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none select-none font-mono text-[120px] font-black italic">
                        BCA
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 pb-6 border-b border-white/10">
                        <div>
                          <div className="text-xs font-mono font-bold text-[#D9FF00] tracking-widest uppercase mb-1">
                            Guru Gobind Singh Indraprastha University (GGSIPU)
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
                            Bachelor of Computer Applications (BCA)
                          </h3>
                          <div className="text-sm text-white/70 font-medium mt-1">
                            Maharaja Surajmal Institute · Computer Science Specialization
                          </div>
                        </div>

                        <div className="text-left md:text-right shrink-0">
                          <div className="text-[10px] font-mono tracking-widest text-white/50 uppercase mb-0.5">Timeline</div>
                          <div className="text-sm font-mono text-white/95">JUL 2019 — AUG 2022</div>
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1 space-y-3">
                          <p className="text-white/70 text-sm leading-relaxed font-light">
                            Built formal foundational knowledge in software design patterns, relational database modeling, algorithms, object-oriented architecture, and data analytics.
                          </p>
                          <p className="text-white/70 text-sm leading-relaxed font-light">
                            Graduated with academic distinction, maintaining an aggregate GPA of 9.3 out of 10 and ranking in the top 1% of the graduating cohort.
                          </p>
                        </div>

                        <div className="border border-[#D9FF00]/40 bg-[#D9FF00]/[0.08] backdrop-blur-md px-8 py-5 rounded-2xl flex flex-col items-center justify-center text-[#D9FF00] shrink-0 shadow-[0_0_36px_rgba(217,255,0,0.1)]">
                          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight tabular-nums">9.3 / 10</div>
                          <div className="text-[10px] font-mono font-bold tracking-widest uppercase mt-1 text-white/80">
                            GPA · TOP 1% RANK
                          </div>
                        </div>
                      </div>
                    </LuxuryCard>
                  </ScrollReveal>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  04. TOOLKIT (Short, Concise, Zero Production Stack Text)
              ══════════════════════════════════════════════════ */}
              <section id="toolkit" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="04"
                    title="Toolkit &amp; Expertise"
                    subtitle="Technical capabilities partitioned into four specialized domains powering workflow automation, intelligent agents, and quantitative delivery."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {toolkitBento.map((bento, i) => (
                      <ScrollReveal key={bento.category} delay={i * 0.05} direction={i % 2 === 0 ? "left" : "right"}>
                        <LuxuryCard className="p-6 md:p-7 flex flex-col justify-between h-full group">
                          <div>
                            <div className="flex items-center justify-between mb-3.5">
                              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#D9FF00]/40 transition-colors">
                                {bento.icon}
                              </div>
                              <span className="text-xs font-mono font-bold text-[#D9FF00] bg-[#D9FF00]/10 px-2.5 py-0.5 rounded-md">
                                {bento.metric}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#D9FF00] transition-colors">
                              {bento.category}
                            </h3>
                            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-4">
                              {bento.tagline}
                            </div>

                            <ul className="space-y-2">
                              {bento.items.map(item => (
                                <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/75 group-hover:text-white transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </LuxuryCard>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  05. PROJECTS & CASE STUDIES
              ══════════════════════════════════════════════════ */}
              <section id="work" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                      <SectionHeading
                        num="05"
                        title="Projects &amp; Case Studies"
                        subtitle="Measurable deliverables that moved enterprise needles, saved thousands of consulting hours, and standardized global data flows."
                      />
                    </div>

                    {/* Vercel-style sliding tab selector with layoutId */}
                    <div
                      className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/10 rounded-xl relative"
                      role="tablist"
                      aria-label="Filter case studies by domain"
                    >
                      {[
                        { id: "all", label: "All Projects" },
                        { id: "power-platform", label: "Power Platform" },
                        { id: "genai", label: "GenAI & Copilot" },
                        { id: "analytics", label: "Analytics & KM" },
                      ].map(tab => {
                        const isActive = projectFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setProjectFilter(tab.id as any)}
                            className={`relative px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none z-10 ${
                              isActive
                                ? "text-black font-bold"
                                : "text-white/60 hover:text-white"
                            }`}
                            data-testid={`filter-${tab.id}`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeFilterTab"
                                className="absolute inset-0 bg-[#D9FF00] rounded-lg -z-10 shadow-[0_0_16px_rgba(217,255,0,0.35)]"
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : SPRING_SNAPPY
                                }
                              />
                            )}
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Projects Grid with dynamic layout reordering */}
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.map((p, i) => (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE_EXIT } }}
                          transition={{ duration: 0.22, delay: i * 0.02, ease: EASE_DECEL }}
                          data-testid={`project-card-${p.id}`}
                        >
                          <LuxuryCard
                            onClick={() => setSelectedProject(p)}
                            className="p-7 flex flex-col h-full gap-5 select-none"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-white/50 tracking-wider uppercase">
                                {p.org}
                              </span>
                              <span className="text-xs font-mono font-bold text-[#D9FF00] bg-[#D9FF00]/10 px-2 py-0.5 rounded">
                                {p.impact}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-[#D9FF00] transition-colors">
                                {p.title}
                              </h3>
                              <p className="text-sm text-white/60 leading-relaxed font-light line-clamp-3">
                                {p.desc}
                              </p>
                            </div>

                            {/* Clean unboxed tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {p.tags.map(t => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase border border-white/10 text-white/70 group-hover:border-[#D9FF00]/30 group-hover:text-white transition-colors"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-white/50 group-hover:text-[#D9FF00] transition-colors">
                              <span>View Case Breakdown</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                            </div>
                          </LuxuryCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Horizontal Bar Chart: Hours Saved by Initiative */}
                  <ScrollReveal direction="up">
                    <LuxuryCard className="p-7 md:p-10">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                          <div className="text-xs font-mono font-bold tracking-widest text-[#D9FF00] uppercase mb-1">
                            Process Analytics
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                            Hours Saved by Initiative. <span className="text-[#D9FF00] italic">2,560+ hours automated.</span>
                          </h3>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-2xl font-mono font-black text-[#D9FF00] tabular-nums">2,560 hrs</div>
                          <div className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase">Annualized Efficiency Gain</div>
                        </div>
                      </div>

                      <div className="h-[280px] sm:h-[300px] w-full" aria-label="Horizontal bar chart of hours saved per initiative">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 30, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#ffffff80", fontSize: 11, fontWeight: 600 }}
                              width={140}
                            />
                            <Tooltip
                              cursor={{ fill: "#ffffff08" }}
                              contentStyle={{
                                background: "#0c0c0c",
                                border: "1px solid rgba(217,255,0,0.3)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
                              }}
                              itemStyle={{ color: "#D9FF00", fontWeight: "bold" }}
                              formatter={(v: any) => [`${v} hrs / yr`, "Efficiency Gain"]}
                            />
                            <Bar dataKey="hours" radius={[0, 6, 6, 0]} barSize={22} isAnimationActive={false}>
                              {chartData.map((e, idx) => (
                                <Cell key={idx} fill={e.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </LuxuryCard>
                  </ScrollReveal>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  06. CERTIFICATIONS
              ══════════════════════════════════════════════════ */}
              <section id="certifications" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="06"
                    title="Certifications"
                    subtitle="Industry certifications from Microsoft, Oracle, KPMG, Anthropic, Cisco, and NASBA validating architecture, AI fluency, and Lean Six Sigma methodology."
                  />

                  <CertificationsRow />
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  07. HONORS & RECOGNITION (Zero Formal Recognition Tag)
              ══════════════════════════════════════════════════ */}
              <section id="honors" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionHeading
                    num="07"
                    title="Honors &amp; Awards"
                    subtitle="Formal awards acknowledging process innovation, firm-wide learning culture, and inclusion."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {awards.map((award, i) => (
                      <ScrollReveal key={award.num} delay={i * 0.06} direction={i % 2 === 0 ? "left" : "right"}>
                        <LuxuryCard className="p-7 md:p-8 flex flex-col justify-between h-full group">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-mono font-bold text-white/50 tracking-wider uppercase">
                                {award.org}
                              </span>
                              <span className="text-xs font-mono font-bold text-[#D9FF00] bg-[#D9FF00]/10 px-2 py-0.5 rounded">
                                AWARD #{award.num}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-2 text-white group-hover:text-[#D9FF00] transition-colors">
                              {award.title}
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed font-light">
                              {award.desc}
                            </p>
                          </div>
                        </LuxuryCard>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  08. CONTACT (Clean direct layout, zero copy button)
              ══════════════════════════════════════════════════ */}
              <section id="contact" className="py-20 md:py-24 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                  <ScrollReveal direction="fade">
                    <h2 className="text-[44px] sm:text-[72px] md:text-[104px] font-black leading-[0.88] mb-6 uppercase text-white">
                      let's build<br />
                      <span className="text-white/25">something</span><br />
                      <span className="text-[#D9FF00]">impactful.</span>
                    </h2>

                    <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-10 font-light">
                      Available for senior Knowledge Management, Power Platform enterprise architecture, and generative AI workflow transformations.
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                    {contactItems.map((item, i) => (
                      <ScrollReveal key={item.id} delay={i * 0.06} direction="up">
                        <LuxuryCard className="p-8 flex flex-col items-center gap-3 text-center group h-full">
                          <motion.div
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.15, rotate: 6 }}
                            transition={SPRING_BOUNCY}
                            className="text-white/50 group-hover:text-[#D9FF00] transition-colors p-3 rounded-2xl bg-white/5"
                          >
                            {item.icon}
                          </motion.div>
                          <div className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/40 uppercase">
                            {item.label}
                          </div>
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm font-semibold text-white hover:text-[#D9FF00] transition-colors focus-visible:outline-none break-all"
                            data-testid={`contact-link-${item.id}`}
                          >
                            {item.val}
                          </a>
                        </LuxuryCard>
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Footer */}
                  <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
                    <div>© {now.getFullYear()} KARTIK BHATT · ALL RIGHTS RESERVED</div>
                    <div>DELHI NCR, INDIA</div>
                  </footer>
                </div>
              </section>
            </main>

            {/* ══════════════════════════════════════════════════
                PROJECT DETAIL MODAL (Balanced Height, Zero Scrollbar, Zero Redundancy)
            ══════════════════════════════════════════════════ */}
            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE_EXIT } }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-xl"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-project-title"
                  onClick={() => setSelectedProject(null)}
                  data-testid="project-modal"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.16, ease: EASE_EXIT } }}
                    transition={{ duration: 0.22, ease: EASE_DECEL }}
                    className="relative w-full max-w-4xl bg-[#0c0c0c] border border-white/15 rounded-3xl p-6 sm:p-8 md:p-9 shadow-2xl overflow-hidden no-scrollbar"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Top right close button */}
                    <motion.button
                      onClick={() => setSelectedProject(null)}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                      className="absolute top-5 right-5 sm:top-7 sm:right-7 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors focus-visible:outline-none z-20"
                      aria-label="Close project details"
                      data-testid="close-project-modal"
                    >
                      <X size={18} />
                    </motion.button>

                    {/* Modal Header */}
                    <div className="pr-12 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono font-bold text-white/50 tracking-wider uppercase">
                          {selectedProject.org}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-xs font-mono font-bold text-[#D9FF00] bg-[#D9FF00]/10 px-2 py-0.5 rounded">
                          {selectedProject.impact}
                        </span>
                      </div>

                      <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                        {selectedProject.title}
                      </h2>

                      <p className="text-white/80 text-sm leading-relaxed font-light max-w-3xl">
                        {selectedProject.desc}
                      </p>
                    </div>

                    {/* Clean 2-Column Grid: Proportioned & Zero Scrollbars */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 border-t border-white/10 text-xs sm:text-sm">
                      {/* Left Column (Problem & Solution) */}
                      <div className="md:col-span-7 space-y-4">
                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-1">
                            The Challenge &amp; Problem Statement
                          </div>
                          <p className="text-white/70 leading-relaxed font-light">
                            {selectedProject.challenge}
                          </p>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-1">
                            Engineering &amp; Architectural Solution
                          </div>
                          <p className="text-white/70 leading-relaxed font-light">
                            {selectedProject.solution}
                          </p>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-1">
                            Operational Architecture &amp; Governance
                          </div>
                          <p className="text-white/70 leading-relaxed font-light">
                            {selectedProject.architecture}
                          </p>
                        </div>
                      </div>

                      {/* Right Column (Deliverables Checkpoints & Technologies ONLY - Zero Redundant Box Below) */}
                      <div className="md:col-span-5 space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-start">
                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-2.5">
                            Key Deliverables &amp; Outcomes
                          </div>
                          <ul className="space-y-2 mb-5">
                            {selectedProject.outcomes.map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-white/85 text-xs">
                                <span className="text-[#D9FF00] font-bold shrink-0">✓</span>
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="text-[11px] font-mono font-bold text-white/50 uppercase tracking-wider mb-2">
                            Technologies &amp; Frameworks
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProject.techStack.map(tech => (
                              <span
                                key={tech}
                                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-white/85"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
