/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, ReactNode, useEffect, useState, useCallback } from "react";
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
  CheckCircle2,
  X,
  Menu,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Viewport thresholds & Web Animation Easing Curves ────────────────────────
const VP       = { once: true, amount: 0.2  } as const;
const VP_CARDS = { once: true, amount: 0.12 } as const;

// Deceleration curve per Vercel web-animation-design guidelines
const EASE_DECEL = [0.16, 1, 0.3, 1] as const;
// Fast exit curve (~25% faster than entrances)
const EASE_EXIT  = [0.4, 0, 1, 1] as const;

// ─── Canonical Navigation Links (Identical for Desktop & Mobile) ─────────────
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

// ─── Real-time tenure ────────────────────────────────────────────────────────
function calcTenure(start: Date, end: Date = new Date()): string {
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth()    - start.getMonth();
  if (m < 0) { y--; m += 12; }
  const parts: string[] = [];
  if (y > 0) parts.push(y + (y === 1 ? " YEAR"  : " YEARS"));
  if (m > 0) parts.push(m + (m === 1 ? " MONTH" : " MONTHS"));
  return parts.join(" ") || "< 1 MONTH";
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = memo(function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting,  setExiting]  = useState(false);

  useEffect(() => {
    let cancelled = false;

    const ramp = (from: number, to: number, ms: number) =>
      new Promise<void>(resolve => {
        const t0 = Date.now();
        const tick = () => {
          if (cancelled) return;
          const t    = Math.min((Date.now() - t0) / ms, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setProgress(Math.round(from + (to - from) * ease));
          t < 1 ? requestAnimationFrame(tick) : resolve();
        };
        requestAnimationFrame(tick);
      });

    async function run() {
      await ramp(0, 30, 350);
      if (!cancelled) await document.fonts.ready;
      await ramp(30, 65, 380);
      if (!cancelled) {
        await new Promise<void>(r =>
          requestAnimationFrame(() => { void document.body.offsetHeight; r(); })
        );
      }
      await ramp(65, 90, 300);
      await ramp(90, 100, 220);
      if (!cancelled) await new Promise(r => setTimeout(r, 260));
      if (!cancelled) {
        setExiting(true);
        setTimeout(() => { if (!cancelled) onComplete(); }, 550);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          exit={{ opacity: 0, filter: "blur(16px)", scale: 1.04 }}
          transition={{ duration: 0.55, ease: EASE_DECEL }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Perspective grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div
              className="absolute inset-0 origin-top h-[200%] w-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
                backgroundSize: "80px 80px",
                transform: "rotateX(60deg) translateY(-20%)",
              }}
            />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-[#D9FF00]/10 rounded-full blur-[130px] opacity-25 pointer-events-none" />

          {/* Corner brackets */}
          {["top-6 left-6 border-t border-l","top-6 right-6 border-t border-r","bottom-6 left-6 border-b border-l","bottom-6 right-6 border-b border-r"].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-7 h-7 border-white/15 ${cls}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: EASE_DECEL }}
            />
          ))}

          {/* Name & Title */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
            transition={{ duration: 0.65, ease: EASE_DECEL }}
            className="relative z-10 text-center mb-10"
          >
            <div
              className="text-[72px] md:text-[108px] font-black leading-none tracking-tighter select-none"
              style={{ animation: "loaderFlicker 3.2s ease-in-out infinite" }}
            >
              kartik<span className="text-[#D9FF00]">_</span>
            </div>
            <div className="text-[11px] font-semibold tracking-[0.35em] text-white/40 uppercase mt-3">
              Power Platform · Copilot Studio · SharePoint
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-[220px] h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D9FF00] rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.1s linear",
                  boxShadow: "0 0 12px #D9FF00,0 0 24px rgba(217,255,0,0.4)",
                }}
              />
            </div>
            <div className="flex items-center justify-between w-[220px]">
              <span className="text-[10px] font-semibold tracking-[0.25em] text-white/30 uppercase">Initializing</span>
              <span className="text-[10px] font-mono font-bold text-[#D9FF00] tabular-nums">{progress}%</span>
            </div>
          </motion.div>

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF00]/15 to-transparent pointer-events-none"
            style={{ animation: "scanline 2.8s linear infinite" }}
          />

          <style>{`
            @keyframes loaderFlicker {
              0%,100% { opacity:1; }
              44%     { opacity:1; }
              45%     { opacity:.35; }
              46%     { opacity:1; }
              90%     { opacity:1; }
              90.5%   { opacity:.55; }
              91%     { opacity:1; }
            }
            @keyframes scanline {
              0%   { top:-2px; opacity:0; }
              8%   { opacity:1; }
              92%  { opacity:1; }
              100% { top:100%; opacity:0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Custom Cursor ────────────────────────────────────────────────────────────
const CustomCursor = memo(function CustomCursor() {
  const dotX  = useMotionValue(-200);
  const dotY  = useMotionValue(-200);
  const ringX = useSpring(useMotionValue(-200), { stiffness: 140, damping: 20, mass: 0.5 });
  const ringY = useSpring(useMotionValue(-200), { stiffness: 140, damping: 20, mass: 0.5 });
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
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", background: "#D9FF00" }}
        animate={{ width: clicking ? 5 : hovered ? 12 : 6, height: clicking ? 5 : hovered ? 12 : 6 }}
        transition={{ duration: 0.16, ease: EASE_DECEL }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          borderColor: hovered ? "rgba(217,255,0,0.85)" : "rgba(217,255,0,0.35)",
          transition: "border-color 0.2s",
        }}
        animate={{ width: clicking ? 20 : hovered ? 46 : 28, height: clicking ? 20 : hovered ? 46 : 28 }}
        transition={{ duration: 0.2, ease: EASE_DECEL }}
      />
    </>
  );
});

// ─── Parallax Background ──────────────────────────────────────────────────────
const ParallaxBackground = memo(function ParallaxBackground() {
  const mouseX    = useMotionValue(0);
  const mouseY    = useMotionValue(0);
  const scrollYmv = useMotionValue(0);

  const slowX = useSpring(mouseX, { stiffness: 22, damping: 28, mass: 1.3 });
  const slowY = useSpring(mouseY, { stiffness: 22, damping: 28, mass: 1.3 });
  const midX  = useSpring(mouseX, { stiffness: 42, damping: 30, mass: 1.0 });
  const midY  = useSpring(mouseY, { stiffness: 42, damping: 30, mass: 1.0 });
  const fastX = useSpring(mouseX, { stiffness: 68, damping: 26, mass: 0.7 });
  const fastY = useSpring(mouseY, { stiffness: 68, damping: 26, mass: 0.7 });

  const scrollSlow = useTransform(scrollYmv, [0, 4000], [0,  -80]);
  const scrollMid  = useTransform(scrollYmv, [0, 4000], [0, -150]);

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseX.set((e.clientX / window.innerWidth  - 0.5) * 50);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 50);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => scrollYmv.set(window.scrollY));
    };
    window.addEventListener("mousemove", onMove,  { passive: true });
    window.addEventListener("scroll",   onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",   onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mouseX, mouseY, scrollYmv]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
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

      <div className="absolute inset-y-0 left-8 md:left-14 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-8 md:right-14 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="absolute top-[-10%] right-[-5%] w-[55vw] h-[55vw] bg-[#D9FF00]/10 rounded-full blur-[130px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[110px] opacity-10" />

      <motion.div className="absolute will-change-transform" style={{ x: slowX, y: slowY, top: "15%", left: "8%", translateY: scrollSlow }}>
        <div className="w-16 h-16 border border-[#D9FF00]/10 rounded-sm rotate-45" />
      </motion.div>
      <motion.div className="absolute will-change-transform" style={{ x: midX, y: midY, top: "42%", right: "8%", translateY: scrollMid }}>
        <div className="w-14 h-14 border border-white/[0.05] rounded-sm" />
      </motion.div>
    </div>
  );
});

// ─── Animated Glass Card with GPU Compositor Micro-Interactions ───────────────
const GlassCard = memo(function GlassCard({
  children, className = "", onClick, ...props
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick && !shouldReduceMotion ? { y: -4, transition: { duration: 0.2, ease: EASE_DECEL } } : undefined}
      whileTap={onClick && !shouldReduceMotion ? { scale: 0.985, transition: { duration: 0.1 } } : undefined}
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.025] backdrop-blur-md",
        "transition-colors duration-200",
        onClick ? "cursor-pointer hover:border-[#D9FF00]/40 hover:bg-white/[0.045] hover:shadow-[0_12px_36px_rgba(0,0,0,0.5),0_0_24px_rgba(217,255,0,0.06)]" : "hover:border-white/15",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.div>
  );
});

// ─── Section Headline with Stagger Animation ──────────────────────────────────
const SectionHeadline = memo(function SectionHeadline({
  lines, className = "", dimFrom = 1, greenWords = [],
}: {
  lines: readonly string[];
  className?: string;
  dimFrom?: number;
  greenWords?: string[];
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } } }}
      className={["font-black tracking-tighter max-w-full break-words", className].join(" ")}
    >
      {lines.map((line, idx) => (
        <motion.span
          key={line}
          variants={{
            hidden:  { opacity: 0, y: shouldReduceMotion ? 0 : 24, filter: shouldReduceMotion ? "none" : "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "none" },
          }}
          transition={{ duration: 0.6, ease: EASE_DECEL }}
          className={`block max-w-full break-words${idx >= dimFrom ? " text-white/30 italic" : ""}`}
        >
          {greenWords.includes(line) ? <span className="text-[#D9FF00]">{line}</span> : line}
        </motion.span>
      ))}
    </motion.h2>
  );
});

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-[#D9FF00] font-mono font-bold text-xs">{num}</span>
      <div className="w-10 h-px bg-[#D9FF00]/60" />
      <span className="text-[11px] font-bold tracking-[0.25em] text-[#D9FF00] uppercase">{label}</span>
    </div>
  );
}

// ─── Static Data & Project Case Studies ──────────────────────────────────────
const stats = [
  { label: "EXPERIENCE",     value: "3+ YRS" },
  { label: "HOURS SAVED",    value: "2,000+" },
  { label: "ASSETS MANAGED", value: "30k+"   },
  { label: "RFP / RFI DELIVERED", value: "100+" },
  { label: "HONORS WON",     value: "5×"     },
];

const chartData = [
  { name: "Power Platform",       hours: 1200, color: "#D9FF00" },
  { name: "VBA & Process Scripts", hours: 785,  color: "#34D399" },
  { name: "Copilot Agents",       hours: 325,  color: "#A855F7" },
  { name: "SharePoint Systems",   hours: 150,  color: "#F43F5E" },
  { name: "Process Optimization", hours: 100,  color: "#F59E0B" },
];

const impactMetrics = [
  { label: "Hours Saved",    value: "2,000+",  sub: "Saved Annually Across Teams", color: "border-yellow-500/20"  },
  { label: "Repository Reach", value: "30,000+", sub: "Managed Assets in SPO",    color: "border-emerald-500/20" },
  { label: "RFP / RFIs",     value: "100+",    sub: "Delivered Across 13 Sectors", color: "border-rose-500/20"    },
  { label: "Process Quality",value: "95%",     sub: "Benchmark Reached From 74%", color: "border-purple-500/20"  },
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
  outcomes: string[];
  techStack: string[];
};

const allProjects: ProjectItem[] = [
  {
    id: "kpmg-harvest",
    category: "power-platform",
    org: "KPMG",
    title: "Automated Knowledge Harvesting",
    desc: "Engineered automated Power Apps + Power Automate workflow for harvesting, vetting, and categorizing enterprise knowledge assets.",
    impact: "1,200 hrs / year saved",
    tags: ["POWER APPS", "POWER AUTOMATE", "SHAREPOINT"],
    challenge: "Manual harvesting of intellectual capital, credentials, and RFP proposals across 13 cross-functional sectors required over 1,500 hours annually, leading to delays and lost collateral.",
    solution: "Architected an end-to-end Power Apps portal combined with scheduled Power Automate multi-stage approval flows, automatic taxonomy tagging, and automated metadata validation.",
    outcomes: [
      "Saved 1,200+ consulting and analyst hours annually",
      "Turnaround time from project close to asset publication dropped from 14 days to under 48 hours",
      "Eliminated indexing duplicate entries across all 13 industry sectors",
    ],
    techStack: ["Microsoft Power Apps", "Power Automate Cloud Flows", "SharePoint Online", "Dataverse", "Azure AD"],
  },
  {
    id: "kpmg-migration",
    category: "power-platform",
    org: "KPMG",
    title: "SPO List Migration & Modernization",
    desc: "Migrated legacy disparate Excel trackers to unified SharePoint Online architecture with automated alert webhooks.",
    impact: "500 hrs saved",
    tags: ["SHAREPOINT ONLINE", "POWER AUTOMATE", "EXCEL"],
    challenge: "Legacy Excel spreadsheets across different practice teams suffered from version control conflicts, absence of audit logging, and lack of real-time multi-user synchronization.",
    solution: "Transitioned datasets into relational SharePoint Online lists with role-based view permissions, automated webhook notifications, and Power Automate update triggers.",
    outcomes: [
      "Saved 500+ hours in manual reconciliation and status emails",
      "Achieved 100% audit logging compliance for sensitive client assets",
      "Real-time visibility for project leads and executive sponsors",
    ],
    techStack: ["SharePoint Online", "Power Automate", "Microsoft Teams Webhooks", "Excel Office Scripts"],
  },
  {
    id: "kpmg-copilot",
    category: "genai",
    org: "KPMG",
    title: "Content Drafter Copilot Agent",
    desc: "Developed custom Copilot Studio agent to parse unstructured deliverables, draft fields, and apply taxonomy tags based on KPMG editorial guidelines.",
    impact: "325 hrs saved",
    tags: ["COPILOT STUDIO", "GENAI", "LEAN SIX SIGMA"],
    challenge: "Consultants submitted raw deliverables with inconsistent summaries, missing sector classifications, and variable naming conventions.",
    solution: "Built a customized Microsoft Copilot Studio AI agent fine-tuned on KPMG standard operating guidelines to extract key insights, summarize proposals, and suggest compliant taxonomy.",
    outcomes: [
      "Saved 325 hours annually across knowledge management curators",
      "Standardized 100% of asset metadata against the master taxonomy rubric",
      "Honored with KPMG Kudos Award for GenAI innovation",
    ],
    techStack: ["Microsoft Copilot Studio", "Azure OpenAI Services", "Prompt Engineering", "SharePoint Syntex"],
  },
  {
    id: "kpmg-metrics",
    category: "analytics",
    org: "KPMG",
    title: "Engagement Metrics BI Dashboard",
    desc: "Centralized executive repository for engagement metrics across 30,000+ assets, visualized in Power BI for leadership decision-making.",
    impact: "30K+ assets tracked",
    tags: ["POWER BI", "DATA ANALYTICS", "SQL"],
    challenge: "Practice leadership lacked unified intelligence on which knowledge assets, RFP templates, and whitepapers were actually driving deal conversion and reuse.",
    solution: "Constructed comprehensive Power BI dashboards connecting transactional audit logs and usage telemetry with automated refresh schedules and interactive slicers.",
    outcomes: [
      "Identified top 10% highest-converting proposal collateral for executive review",
      "Decommissioned 2,000+ obsolete or redundant documentation files",
      "Automated monthly KPI packs for 13 sector leadership teams",
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
    outcomes: [
      "Elevated project quality score from 74% to 95%",
      "Reduced annotation error rate by 25% within first 6 weeks",
      "Delivered production milestones two weeks ahead of committed schedule",
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
    challenge: "Complex regulatory and technical PDF documents prevented standard keyword search from retrieving correct nested subsections.",
    solution: "Piloted an extraction and retrieval pipeline benchmarked against competitors, combining semantic chunking and structured context scoring.",
    outcomes: [
      "Won competitive pilot benchmarking against prominent multinational software competitors",
      "Secured formal multi-quarter implementation contract for the practice",
      "Achieved sub-second contextual retrieval for technical documentation",
    ],
    techStack: ["Semantic Retrieval", "RAG Architecture", "Benchmarking", "Document Parsing"],
  },
];

const toolkitGroups = [
  { category: "Power Platform",  items: ["Power Apps", "Power Automate", "Power BI", "Dataverse"] },
  { category: "Microsoft 365",   items: ["SharePoint Online", "Advanced Excel", "PowerPoint", "Teams Platform"] },
  { category: "AI & GenAI",      items: ["Copilot Studio", "Agentic Workflows", "Azure OpenAI", "Prompt Optimization"] },
  { category: "Knowledge Mgmt",  items: ["RFP / RFI Delivery", "Taxonomy & Metadata", "SQL Queries", "Lean Six Sigma"] },
];

const skills = [
  "Power Apps", "Power Automate", "Power BI", "SharePoint Online",
  "Copilot Studio", "SQL", "Agentic AI", "GenAI Workflows", "Lean Six Sigma", "RFP / RFI Systems",
];

type Role = {
  title:   string;
  start:   Date;
  end:     Date | null;
  dateStr: string;
  desc:    string;
  bullets: string[];
};

type Org = {
  id:      string;
  org:     string;
  city:    string;
  start:   Date;
  end:     Date | null;
  dateStr: string;
  roles:   Role[];
};

const experienceDefs: Org[] = [
  {
    id:      "kpmg",
    org:     "KPMG",
    city:    "GURUGRAM, HARYANA",
    start:   new Date(2024, 4, 1),
    end:     null,
    dateStr: "MAY 2024 — PRESENT",
    roles: [
      {
        title:   "Business Associate — Knowledge Management",
        start:   new Date(2026, 9, 1),
        end:     null,
        dateStr: "OCT 2026 — PRESENT",
        desc:    "Promoted to Business Associate, driving strategic oversight of knowledge management initiatives, executive stakeholder alignment, and Power Platform automation across global accounts.",
        bullets: [
          "Broader architectural scope across Power Platform and modern SharePoint ecosystem",
          "Executive 360° stakeholder management across 13 cross-functional industry sectors",
          "Accelerated career progression from Analyst following sustained automation delivery",
        ],
      },
      {
        title:   "Analyst — Knowledge Management",
        start:   new Date(2024, 4, 1),
        end:     new Date(2026, 9, 1),
        dateStr: "MAY 2024 — SEP 2026",
        desc:    "Led cross-functional initiatives across 13 sectors with end-to-end stakeholder management, proposal enablement, and Power Platform process re-engineering.",
        bullets: [
          "Architected Power Platform automations saving 2,000+ hours annually",
          "Managed centralized repositories holding over 30,000 enterprise assets",
          "Earned 5 recognition awards including 2× Kudos Awards for Lean Six Sigma impact",
        ],
      },
    ],
  },
  {
    id:      "globallogic",
    org:     "GlobalLogic Technologies",
    city:    "GURUGRAM, HARYANA",
    start:   new Date(2022, 8, 1),
    end:     new Date(2023, 9, 1),
    dateStr: "SEP 2022 — OCT 2023",
    roles: [
      {
        title:   "Associate Analyst — Content Engineering",
        start:   new Date(2022, 8, 1),
        end:     new Date(2023, 9, 1),
        dateStr: "SEP 2022 — OCT 2023",
        desc:    "Delivered content engineering and AI training datasets for Google & Microsoft flagship initiatives, securing competitive pilot bids against major multinational competitors.",
        bullets: [
          "Formulated GenAI training and evaluation datasets for Google Android search",
          "Enhanced QA benchmark accuracy from 74% to 95%",
          "Led 3 competitive pilot evaluation phases — securing 100% award rate",
        ],
      },
    ],
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
  { num: "02", title: "Super Team Award", org: "KPMG", desc: "Recognized for organizing and hosting KGS employee council events, uniting cross-functional teams and fostering firm-wide collaboration." },
  { num: "03", title: "Ally of Inclusion", org: "KPMG", desc: "Honored for championing a culture of diversity, accessibility, and mutual respect across KPMG Global Services." },
  { num: "04", title: "Gurus@Work", org: "KPMG", desc: "Acknowledged for contributions to the firm's learning ecosystem, mentoring analysts and upskilling peers on automation tooling." },
];

const contactItems = [
  { id: "email", icon: <Mail size={22} />, label: "EMAIL", val: "kb270102@gmail.com", href: "mailto:kb270102@gmail.com" },
  { id: "phone", icon: <Smartphone size={22} />, label: "PHONE", val: "+91-7428062532", href: "tel:+917428062532" },
  { id: "linkedin", icon: <Linkedin size={22} />, label: "LINKEDIN", val: "linkedin.com/in/kartik-bhatt", href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

const keyNumbers = [
  "Maintained 5,000+ member contact repository system",
  "Conducted QA audits on 100+ content assets weekly",
  "Curated and indexed 5,000+ digital intellectual assets",
  "Boosted overall delivery quality from 74% to 95%",
  "Consistently shipped milestone deliveries 2 weeks ahead of target",
];

// ─── Skills Carousel ──────────────────────────────────────────────────────────
const SkillsCarousel = memo(function SkillsCarousel() {
  const rep = useMemo(() => [...skills, ...skills, ...skills, ...skills], []);
  return (
    <div className="w-full border-y border-white/5 overflow-hidden" aria-hidden="true">
      <div style={{ display: "flex", width: "max-content", animation: "marquee 32s linear infinite" }} className="py-6">
        {rep.map((skill, i) => (
          <div key={i} className="flex items-center gap-6 shrink-0 px-4">
            <span className="text-3xl md:text-4xl font-black tracking-tight text-white/15 hover:text-[#D9FF00] transition-colors duration-200 whitespace-nowrap">
              {skill.toUpperCase()}
            </span>
            <div className="w-2 h-2 bg-[#D9FF00] rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Certification Badge ──────────────────────────────────────────────────────
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
      className="relative shrink-0 select-none flex items-center justify-center w-[clamp(52px,7.5vw,110px)] h-[clamp(60px,9vw,130px)]"
      style={{ zIndex: hovered ? 30 : 10 }}
      animate={shouldReduceMotion ? undefined : {
        x: offset,
        scale: hovered ? 1.25 : 1,
        y: hovered ? -12 : 0,
        opacity: dimmed ? 0.4 : 1,
      }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max text-center pointer-events-none bg-black/90 px-2.5 py-1 rounded-lg border border-white/10 shadow-lg"
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
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-7 py-8 w-full max-w-6xl mx-auto">
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

  // Tick every minute for live tenure
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

  // Escape key handler for modals and drawer
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
        @keyframes marquee  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes dotblink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        section[id] { scroll-margin-top: 96px; }
      `}</style>

      {/* Desktop custom cursor */}
      <div className="hidden md:block"><CustomCursor /></div>

      {/* Pre-warm asset loading screen */}
      <LoadingScreen onComplete={handleLoadComplete} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="site-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE_DECEL }}
            className="overflow-x-hidden w-full"
          >
            <ParallaxBackground />

            {/* ══════════════════════════════════════════════════
                TOP BAR CONTRACT: [Wordmark] — [Nav Links] — [Action]
            ══════════════════════════════════════════════════ */}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[94%] md:w-[92%] max-w-7xl z-[900]">
              <nav
                className="relative backdrop-blur-xl border rounded-2xl px-4 md:px-7 h-16 flex items-center justify-between transition-all duration-300"
                style={{
                  background: scrolled ? "rgba(10,10,10,0.8)" : "rgba(10,10,10,0.4)",
                  borderColor: scrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                  boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.6), 0 0 1px 1px rgba(217,255,0,0.08)" : "none",
                }}
                aria-label="Primary Navigation"
              >
                {/* Zone 1: Single element wordmark */}
                <a
                  href="#"
                  className="flex items-center gap-2 group focus-visible:outline-none shrink-0"
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
                      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
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
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
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

              {/* Mobile Navigation Drawer with Spring Physics */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15, ease: EASE_EXIT } }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
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
            </header>

            {/* ══════════════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════════════ */}
            <main className="overflow-x-hidden w-full">
              <section className="min-h-screen pt-36 pb-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto overflow-hidden">
                <div className="flex-1 max-w-3xl w-full">
                  {/* Eyebrow */}
                  <motion.div
                    className="flex items-center gap-3 mb-8"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.15 }}
                  >
                    <div className="w-10 h-px bg-[#D9FF00]" />
                    <span className="text-xs font-bold tracking-[0.25em] text-[#D9FF00] uppercase">
                      Knowledge Management &amp; Automation
                    </span>
                  </motion.div>

                  {/* Oversized Name */}
                  <motion.h1
                    className="text-[64px] sm:text-[96px] md:text-[130px] font-black leading-[0.82] tracking-tighter"
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0,  filter: "none" }}
                    transition={{ duration: 0.75, ease: EASE_DECEL, delay: 0.25 }}
                  >
                    kartik<br />
                    <span className="text-white/20">bhatt</span>
                    <span className="text-[#D9FF00]">_</span>
                  </motion.h1>

                  {/* Domain Subheading */}
                  <motion.p
                    className="mt-8 text-base md:text-lg text-white/70 font-normal max-w-xl leading-relaxed"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.4 }}
                  >
                    Business Associate at <span className="text-white font-semibold">KPMG</span> specializing in enterprise
                    Power Platform automation, Copilot Studio agents, and knowledge repository ecosystems across 13 global sectors.
                  </motion.p>

                  {/* Quantitative proof line */}
                  <motion.div
                    className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-white/40 tracking-wider uppercase"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.55 }}
                  >
                    <span className="text-[#D9FF00]">2,000+ Hours Saved</span>
                    <span>·</span>
                    <span>30,000+ Assets Managed</span>
                    <span>·</span>
                    <span>5× Honors Won</span>
                  </motion.div>

                  {/* Call to action links with spring animations */}
                  <motion.div
                    className="mt-10 flex flex-wrap items-center gap-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_DECEL, delay: 0.7 }}
                  >
                    <motion.a
                      href="#work"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-[#D9FF00] hover:text-black border border-white/10 hover:border-transparent font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 group"
                    >
                      <span>Explore Case Studies</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="#contact"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/30 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Get in Touch
                    </motion.a>
                  </motion.div>
                </div>

                {/* Profile Portrait Container */}
                <motion.div
                  className="relative w-full max-w-[420px] h-[440px] shrink-0"
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1,    rotate: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.3 }}
                >
                  <div className="absolute inset-0 border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.02] backdrop-blur-md shadow-[0_0_60px_rgba(217,255,0,0.06)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                    <img
                      src="/profile.jpg"
                      alt="Portrait of Kartik Bhatt"
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute bottom-6 left-6 z-20">
                      <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl">
                        <div className="w-2 h-2 bg-[#D9FF00] rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                          BUSINESS ASSOCIATE · KPMG
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* ══════════════════════════════════════════════════
                  QUANTITATIVE STATS BAR
              ══════════════════════════════════════════════════ */}
              <section className="border-y border-white/5 bg-white/[0.015] backdrop-blur-sm overflow-hidden" aria-label="Key Career Statistics">
                <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-y md:divide-y-0 divide-x divide-white/5">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VP}
                      transition={{ delay: i * 0.06, duration: 0.5, ease: EASE_DECEL }}
                      whileHover={shouldReduceMotion ? undefined : { backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                      className="p-6 md:p-8 flex flex-col gap-1.5 transition-colors cursor-default"
                    >
                      <div className="text-2xl md:text-4xl font-mono font-black tracking-tight tabular-nums text-white">
                        {stat.value}
                      </div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  01. ABOUT
              ══════════════════════════════════════════════════ */}
              <section id="about" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionLabel num="01" label="About Me" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                    <div className="lg:col-span-7">
                      <SectionHeadline
                        lines={["i turn legacy","chaos into measurable,","automated impact."]}
                        className="text-3xl sm:text-4xl md:text-[52px] leading-[0.95] mb-8 lowercase"
                        dimFrom={1}
                        greenWords={["automated impact."]}
                      />
                      <p className="text-white/70 text-base leading-relaxed font-light mb-6">
                        Results-driven analyst with 3+ years across <span className="text-white font-medium">Knowledge Management</span> and <span className="text-white font-medium">Content Engineering</span> at premier global firms.
                        Specializes in Microsoft Power Platform automation, SharePoint Online architecture, and data-driven operational improvements.
                      </p>
                      <p className="text-white/70 text-base leading-relaxed font-light">
                        Saved 2,000+ hours annually through Lean Six Sigma principles and GenAI Copilot workflows—powering 13 industry sectors and hundreds of client pursuits.
                      </p>
                    </div>

                    <div className="lg:col-span-5">
                      <GlassCard className="p-6 sm:p-7">
                        <div className="text-xs font-bold tracking-[0.25em] text-[#D9FF00] uppercase mb-6">
                          Profile Details
                        </div>
                        {[
                          { l: "NAME",   v: "Kartik Bhatt" },
                          { l: "ROLE",   v: "Business Associate · KPMG" },
                          { l: "LOCATION", v: "Delhi NCR, India" },
                          { l: "DEGREE", v: "BCA · Computer Science" },
                          { l: "HONORS", v: "9.3 / 10 GPA · Top 1% Rank" },
                          { l: "EXPERTISE", v: "Power Platform & GenAI" },
                        ].map(item => (
                          <div key={item.l} className="flex justify-between items-center py-3 border-b border-white/5 text-sm gap-2">
                            <span className="text-[10px] font-bold text-white/40 tracking-[0.15em] uppercase shrink-0">{item.l}</span>
                            <span className="font-semibold text-white/90 text-right">{item.v}</span>
                          </div>
                        ))}
                      </GlassCard>
                    </div>
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  02. EXPERIENCE
              ══════════════════════════════════════════════════ */}
              <section id="experience" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionLabel num="02" label="Career Journey" />
                  <div className="space-y-8">
                    {experienceDefs.map((exp) => {
                      const orgTenure = calcTenure(exp.start, exp.end ?? now);
                      return (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={VP}
                          transition={{ duration: 0.6, ease: EASE_DECEL }}
                        >
                          <GlassCard className="flex flex-col lg:flex-row gap-8 lg:gap-16 p-7 md:p-10">
                            {/* Left column: Organization Meta */}
                            <div className="w-full lg:w-48 shrink-0">
                              <span className="text-xs font-mono font-bold text-white/40 tracking-wider">
                                {exp.dateStr}
                              </span>
                              <h3 className="text-3xl font-black tracking-tight mt-2 text-white">{exp.org}</h3>
                              <div className="mt-2 text-xs font-semibold text-white/40 tracking-wider uppercase">
                                {exp.city}
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs font-mono text-[#D9FF00] font-bold tabular-nums">
                                  {orgTenure}
                                </span>
                                {!exp.end && (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#D9FF00]/10 border border-[#D9FF00]/20 text-[9px] font-mono font-bold text-[#D9FF00]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] animate-pulse" />
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right column: Roles Timeline */}
                            <div className="flex-1 space-y-8">
                              {exp.roles.map((role, ri) => (
                                <div
                                  key={role.title}
                                  className={exp.roles.length > 1 ? "relative pl-6 border-l border-[#D9FF00]/25" : ""}
                                >
                                  {exp.roles.length > 1 && (
                                    <span
                                      className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${
                                        ri === 0 ? "bg-[#D9FF00] ring-4 ring-[#D9FF00]/20" : "bg-[#D9FF00]/40"
                                      }`}
                                    />
                                  )}
                                  <div className="text-lg font-bold text-white mb-1">{role.title}</div>
                                  <div className="text-xs font-mono text-white/40 mb-3 tracking-wide">
                                    {role.dateStr} · {calcTenure(role.start, role.end ?? now)}
                                  </div>
                                  <p className="text-white/60 mb-4 font-light text-sm leading-relaxed">
                                    {role.desc}
                                  </p>
                                  <ul className="space-y-2">
                                    {role.bullets.map(b => (
                                      <li key={b} className="flex gap-2.5 text-sm font-medium items-start">
                                        <span className="text-[#D9FF00] font-bold shrink-0">→</span>
                                        <span className="text-white/80">{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  03. EDUCATION
              ══════════════════════════════════════════════════ */}
              <section id="education" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionLabel num="03" label="Academic Foundation" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ duration: 0.6, ease: EASE_DECEL }}
                  >
                    <GlassCard className="p-7 md:p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none select-none">
                        <div className="text-[80px] md:text-[140px] font-black italic leading-none font-mono">BCA</div>
                      </div>
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-1 uppercase">
                              Bachelor of Computer Applications
                            </h3>
                            <div className="text-[#D9FF00] text-sm font-semibold tracking-wide">
                              Major: Computer Science · Software Systems &amp; Databases
                            </div>
                          </div>
                          <div className="md:text-right shrink-0">
                            <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-0.5">Timeline</div>
                            <div className="text-sm font-medium text-white/90">JUL 2019 — AUG 2022</div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center pt-4 border-t border-white/5">
                          <div className="flex-1">
                            <div className="text-base font-bold tracking-tight text-white/80 mb-2">
                              Maharaja Surajmal Institute, GGSIPU
                            </div>
                            <p className="text-white/50 leading-relaxed font-light text-sm max-w-2xl">
                              Built rigorous foundations in object-oriented programming, data structures, relational database architecture (SQL), and enterprise software engineering. Ranked in the top 1% of the graduating cohort with academic distinction.
                            </p>
                          </div>
                          <div className="border border-[#D9FF00]/30 bg-[#D9FF00]/[0.06] backdrop-blur-md px-7 py-4 md:px-8 md:py-5 rounded-2xl flex flex-col items-center justify-center text-[#D9FF00] shrink-0 shadow-[0_0_30px_rgba(217,255,0,0.08)]">
                            <div className="text-2xl md:text-3xl font-black tracking-tight font-mono tabular-nums">9.3 / 10</div>
                            <div className="text-[10px] font-bold tracking-widest uppercase mt-1 text-white/60">
                              GPA / TOP 1% RANK
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  04. TOOLKIT
              ══════════════════════════════════════════════════ */}
              <section id="toolkit" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="-mx-6 md:-mx-12 mb-12"><SkillsCarousel /></div>
                <div className="max-w-7xl mx-auto">
                  <SectionLabel num="04" label="Technical Competencies" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {toolkitGroups.map((group, i) => (
                      <motion.div
                        key={group.category}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VP}
                        transition={{ delay: i * 0.08, duration: 0.5, ease: EASE_DECEL }}
                      >
                        <GlassCard className="p-6 h-full group">
                          <div className="text-base font-bold tracking-tight text-white mb-4 group-hover:text-[#D9FF00] transition-colors">
                            {group.category}
                          </div>
                          <ul className="space-y-3">
                            {group.items.map(item => (
                              <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  05. PROJECTS (Web Animation Design layoutId Tab Slider)
              ══════════════════════════════════════════════════ */}
              <section id="work" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                      <SectionLabel num="05" label="Projects & Case Studies" />
                      <SectionHeadline
                        lines={["projects that moved","needles, not just","decks."]}
                        className="text-3xl sm:text-4xl md:text-[52px] leading-[0.95] lowercase"
                        dimFrom={1}
                        greenWords={["decks."]}
                      />
                    </div>

                    {/* Vercel-Style Gliding Tab Selector via layoutId */}
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
                            className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none z-10 ${
                              isActive
                                ? "text-black font-bold"
                                : "text-white/60 hover:text-white"
                            }`}
                            data-testid={`filter-${tab.id}`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeFilterTab"
                                className="absolute inset-0 bg-[#D9FF00] rounded-lg -z-10 shadow-[0_0_16px_rgba(217,255,0,0.3)]"
                                transition={
                                  shouldReduceMotion
                                    ? { duration: 0 }
                                    : { type: "spring", stiffness: 450, damping: 35 }
                                }
                              />
                            )}
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Projects Grid with dynamic layout transitions */}
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    <AnimatePresence mode="popLayout">
                      {filteredProjects.map((p, i) => (
                        <motion.div
                          key={p.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.16, ease: EASE_EXIT } }}
                          transition={{ duration: 0.24, delay: i * 0.03, ease: EASE_DECEL }}
                          data-testid={`project-card-${p.id}`}
                        >
                          <GlassCard
                            onClick={() => setSelectedProject(p)}
                            className="group p-7 flex flex-col h-full gap-5 select-none"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-white/40 tracking-wider uppercase">
                                {p.org}
                              </span>
                              <span className="text-xs font-bold text-[#D9FF00] font-mono tabular-nums">
                                {p.impact}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-[#D9FF00] transition-colors">
                                {p.title}
                              </h3>
                              <p className="text-sm text-white/50 leading-relaxed font-light line-clamp-3">
                                {p.desc}
                              </p>
                            </div>

                            {/* Clean unboxed tags */}
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {p.tags.map(t => (
                                <span
                                  key={t}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase border border-white/10 text-white/60 group-hover:border-[#D9FF00]/30 group-hover:text-white transition-colors"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-white/40 group-hover:text-[#D9FF00] transition-colors">
                              <span>View Case Breakdown</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Impact Summary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {impactMetrics.map((m, i) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VP}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: EASE_DECEL }}
                      >
                        <GlassCard className={`p-6 border ${m.color} flex flex-col items-center text-center h-full`}>
                          <div className="text-2xl md:text-3xl font-mono font-black mb-1 tracking-tight tabular-nums text-white">
                            {m.value}
                          </div>
                          <div className="text-xs font-bold text-[#D9FF00] uppercase tracking-wider mb-1">
                            {m.label}
                          </div>
                          <div className="text-[10px] font-medium text-white/40 uppercase tracking-wide">
                            {m.sub}
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>

                  {/* Detailed Analytics Chart & Key Milestones */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP}
                      transition={{ duration: 0.6, ease: EASE_DECEL }}
                      className="lg:col-span-8"
                    >
                      <GlassCard className="p-7 md:p-10 h-full">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                          <div>
                            <div className="text-xs font-mono font-bold tracking-widest text-[#D9FF00] uppercase mb-1">
                              Automation Analytics
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                              the receipts. <span className="text-[#D9FF00] italic">hours saved by initiative.</span>
                            </h3>
                          </div>
                          <div className="sm:text-right">
                            <div className="text-2xl font-mono font-black text-[#D9FF00] tabular-nums">2,560 hrs</div>
                            <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Annualized Savings</div>
                          </div>
                        </div>
                        <div className="h-[280px] sm:h-[300px] w-full" aria-label="Horizontal bar chart of hours saved per initiative">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 20, top: 10, bottom: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
                              <XAxis type="number" hide />
                              <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff80", fontSize: 10, fontWeight: 600 }}
                                width={130}
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
                              <Bar dataKey="hours" radius={[0, 6, 6, 0]} barSize={20} isAnimationActive={false}>
                                {chartData.map((e, idx) => (
                                  <Cell key={idx} fill={e.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </GlassCard>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={VP}
                      transition={{ duration: 0.6, ease: EASE_DECEL }}
                      className="lg:col-span-4"
                    >
                      <GlassCard className="p-7 md:p-8 flex flex-col justify-between h-full gap-6">
                        <div>
                          <div className="text-xs font-mono font-bold tracking-widest text-[#D9FF00] uppercase mb-4">
                            Operational Milestones
                          </div>
                          <div className="space-y-3.5">
                            {keyNumbers.map((text, i) => (
                              <motion.div
                                key={i}
                                whileHover={shouldReduceMotion ? undefined : { x: 3 }}
                                transition={{ duration: 0.15, ease: EASE_DECEL }}
                                className="flex gap-3 items-start group"
                              >
                                <div className="w-5 h-5 rounded-md bg-[#D9FF00]/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D9FF00] group-hover:text-black transition-colors">
                                  <CheckCircle2 size={13} className="text-[#D9FF00] group-hover:text-black" />
                                </div>
                                <span className="text-xs font-medium text-white/70 leading-relaxed group-hover:text-white transition-colors">
                                  {text}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 bg-[#D9FF00] text-black rounded-xl">
                          <div className="font-extrabold text-xs tracking-wider uppercase mb-1">Impact Principle</div>
                          <p className="text-xs font-medium leading-relaxed opacity-90">
                            "Data-driven validation combined with clean automated pipelines transforms manual drudgery into compounding operational efficiency."
                          </p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  06. CERTIFICATIONS
              ══════════════════════════════════════════════════ */}
              <section id="certifications" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                  <SectionLabel num="06" label="Verified Credentials" />
                  <SectionHeadline
                    lines={["credentials that","back the","claims."]}
                    className="text-3xl sm:text-4xl md:text-[52px] leading-[0.95] mb-4 lowercase"
                    dimFrom={1}
                    greenWords={["claims."]}
                  />
                  <p className="text-white/50 text-sm max-w-xl mb-4">
                    Official enterprise certifications from Microsoft, Oracle, KPMG, Anthropic, Cisco, and NASBA. Hover to inspect, click to open official credential verification.
                  </p>
                  <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}>
                    <CertificationsRow />
                  </motion.div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  07. HONORS
              ══════════════════════════════════════════════════ */}
              <section id="honors" className="py-20 md:py-24 px-6 md:px-12 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto overflow-hidden">
                  <SectionLabel num="07" label="Honors & Awards" />
                  <SectionHeadline
                    lines={["five awards.","discipline collecting","interest."]}
                    className="text-3xl sm:text-4xl md:text-[50px] leading-tight mb-10 break-words"
                    dimFrom={1}
                    greenWords={["interest."]}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {awards.map((award, i) => (
                      <motion.div
                        key={award.num}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VP_CARDS}
                        transition={{ delay: i * 0.08, duration: 0.5, ease: EASE_DECEL }}
                        className="w-full"
                      >
                        <GlassCard className="p-6 sm:p-7 h-full group">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-white/30 tracking-wider uppercase">
                              {award.org}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#D9FF00]">
                              AWARD #{award.num}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 group-hover:text-[#D9FF00] transition-colors break-words">
                            {award.title}
                          </h3>
                          <p className="text-sm text-white/50 leading-relaxed font-light">
                            {award.desc}
                          </p>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ══════════════════════════════════════════════════
                  08. CONTACT
              ══════════════════════════════════════════════════ */}
              <section id="contact" className="py-20 md:py-24 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center overflow-hidden">
                  <SectionHeadline
                    lines={["let's build","something","impactful."]}
                    className="text-[42px] sm:text-[68px] md:text-[100px] leading-[0.85] mb-6 uppercase"
                    dimFrom={1}
                    greenWords={["impactful."]}
                  />
                  <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto mb-10 font-light">
                    Available for strategic Knowledge Management, Power Platform architecture, and enterprise AI transformation opportunities.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
                    {contactItems.map(item => (
                      <GlassCard key={item.id} className="p-7 sm:p-8 flex flex-col items-center gap-3 text-center group">
                        <motion.div
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.15, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="text-white/50 group-hover:text-[#D9FF00] transition-colors"
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
                      </GlassCard>
                    ))}
                  </div>

                  <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
                    <div>© {now.getFullYear()} KARTIK BHATT · ALL RIGHTS RESERVED</div>
                    <div>DELHI NCR, INDIA</div>
                  </footer>
                </div>
              </section>
            </main>

            {/* ══════════════════════════════════════════════════
                PROJECT DETAIL MODAL (With 25% Faster Exit Rule)
            ══════════════════════════════════════════════════ */}
            <AnimatePresence>
              {selectedProject && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE_EXIT } }}
                  transition={{ duration: 0.22 }}
                  className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-project-title"
                  onClick={() => setSelectedProject(null)}
                  data-testid="project-modal"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.16, ease: EASE_EXIT } }}
                    transition={{ duration: 0.24, ease: EASE_DECEL }}
                    className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <motion.button
                      onClick={() => setSelectedProject(null)}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                      className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors focus-visible:outline-none"
                      aria-label="Close project details"
                      data-testid="close-project-modal"
                    >
                      <X size={18} />
                    </motion.button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold text-white/40 tracking-wider uppercase">
                        {selectedProject.org}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-xs font-mono font-bold text-[#D9FF00]">
                        {selectedProject.impact}
                      </span>
                    </div>

                    <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-white">
                      {selectedProject.title}
                    </h2>

                    <p className="text-white/70 text-base leading-relaxed mb-6 font-light">
                      {selectedProject.desc}
                    </p>

                    {/* Deep Case Breakdown */}
                    <div className="space-y-6 pt-6 border-t border-white/10 text-sm">
                      <div>
                        <div className="text-xs font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-2">
                          The Challenge &amp; Problem Statement
                        </div>
                        <p className="text-white/60 leading-relaxed font-light">
                          {selectedProject.challenge}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-2">
                          Engineering &amp; Architectural Solution
                        </div>
                        <p className="text-white/60 leading-relaxed font-light">
                          {selectedProject.solution}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-2">
                          Key Deliverables &amp; Outcomes
                        </div>
                        <ul className="space-y-2">
                          {selectedProject.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-white/80">
                              <span className="text-[#D9FF00] font-bold shrink-0">✓</span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="text-xs font-mono font-bold text-[#D9FF00] uppercase tracking-wider mb-2.5">
                          Technologies &amp; Frameworks
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack.map(tech => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                      <motion.button
                        onClick={() => setSelectedProject(null)}
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                      >
                        Close Case Study
                      </motion.button>
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
