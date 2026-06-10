/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Kartik Bhatt — Portfolio v2
 * Inspired by landonorris.com: cinematic sections, sharp editorial type,
 * choreographed scroll-driven reveals, and restrained micro-interactions.
 */

import {
  memo, useMemo, ReactNode, useEffect, useRef,
  useState, useCallback, CSSProperties,
} from "react";
import {
  motion, useScroll, useTransform, useMotionValue,
  useSpring, AnimatePresence, useInView,
} from "motion/react";
import {
  Download, Mail, Smartphone, Linkedin, ArrowUpRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Fonts ─────────────────────────────────────────────────────────────────────
// Import Barlow Condensed (display/headings) + Inter (body) via Google Fonts
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Inter:wght@300;400;500;600&display=swap";
document.head.appendChild(FONT_LINK);

// ─── Viewport helpers ──────────────────────────────────────────────────────────
const VP       = { once: true, amount: 0.18 } as const;
const VP_CARDS = { once: true, amount: 0.10 } as const;

// ─── Tenure ────────────────────────────────────────────────────────────────────
function calcTenure(start: Date, end: Date = new Date()): string {
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  if (m < 0) { y--; m += 12; }
  const parts: string[] = [];
  if (y > 0) parts.push(y + (y === 1 ? " yr" : " yrs"));
  if (m > 0) parts.push(m + (m === 1 ? " mo" : " mos"));
  return parts.join(" ") || "< 1 mo";
}

// ─── Loading screen ───────────────────────────────────────────────────────────
const LoadingScreen = memo(function LoadingScreen({
  onComplete,
}: { onComplete: () => void }) {
  const [pct, setPct]       = useState(0);
  const [out, setOut]       = useState(false);
  const [textIdx, setTextIdx] = useState(0);

  const loadWords = ["LOADING", "BUILDING", "ALMOST"];

  useEffect(() => {
    let dead = false;
    const ramp = (from: number, to: number, ms: number) =>
      new Promise<void>((res) => {
        const t0 = Date.now();
        const tick = () => {
          if (dead) return;
          const t    = Math.min((Date.now() - t0) / ms, 1);
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          setPct(Math.round(from + (to - from) * ease));
          t < 1 ? requestAnimationFrame(tick) : res();
        };
        requestAnimationFrame(tick);
      });

    async function run() {
      await ramp(0, 40, 400);
      if (!dead) await document.fonts.ready;
      setTextIdx(1);
      await ramp(40, 75, 450);
      if (!dead)
        await new Promise<void>((r) =>
          requestAnimationFrame(() => { void document.body.offsetHeight; r(); }),
        );
      setTextIdx(2);
      await ramp(75, 100, 300);
      if (!dead) await new Promise((r) => setTimeout(r, 250));
      if (!dead) {
        setOut(true);
        setTimeout(() => { if (!dead) onComplete(); }, 800);
      }
    }

    run();
    return () => { dead = true; };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!out && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#030303" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Horizontal rule top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

          {/* Corner marks */}
          {[
            "top-8 left-8", "top-8 right-8",
            "bottom-8 left-8", "bottom-8 right-8",
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-5 h-5`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              style={{
                borderTop:    i < 2 ? "1px solid rgba(217,255,0,0.4)" : undefined,
                borderBottom: i >= 2 ? "1px solid rgba(217,255,0,0.4)" : undefined,
                borderLeft:   i % 2 === 0 ? "1px solid rgba(217,255,0,0.4)" : undefined,
                borderRight:  i % 2 === 1 ? "1px solid rgba(217,255,0,0.4)" : undefined,
              }}
            />
          ))}

          {/* Name — big barlow condensed */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center select-none mb-12"
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(72px, 14vw, 140px)",
                lineHeight: 0.9,
                letterSpacing: "-0.01em",
                color: "#fff",
              }}
            >
              KARTIK
              <br />
              <span style={{ color: "#D9FF00" }}>BHATT</span>
            </div>
          </motion.div>

          {/* Progress */}
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative w-64 h-px bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#D9FF00]"
                style={{
                  width: `${pct}%`,
                  transition: "width 80ms linear",
                }}
              />
            </div>
            <div className="flex items-center justify-between w-64">
              <AnimatePresence mode="wait">
                <motion.span
                  key={textIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {loadWords[textIdx]}
                </motion.span>
              </AnimatePresence>
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "#D9FF00",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Custom cursor ─────────────────────────────────────────────────────────────
const CustomCursor = memo(function CustomCursor() {
  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const rx = useSpring(useMotionValue(-200), { stiffness: 150, damping: 18, mass: 0.4 });
  const ry = useSpring(useMotionValue(-200), { stiffness: 150, damping: 18, mass: 0.4 });
  const [hov, setHov] = useState(false);
  const [clk, setClk] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); rx.set(e.clientX); ry.set(e.clientY); };
    const over  = (e: MouseEvent) => setHov(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    const down  = () => setClk(true);
    const up    = () => setClk(false);
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
  }, [cx, cy, rx, ry]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full mix-blend-difference bg-white"
        style={{ x: cx, y: cy, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: clk ? 4 : hov ? 12 : 6, height: clk ? 4 : hov ? 12 : 6 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{
          x: rx, y: ry,
          translateX: "-50%", translateY: "-50%",
          border: `1px solid ${hov ? "rgba(217,255,0,0.9)" : "rgba(217,255,0,0.45)"}`,
          transition: "border-color 0.15s",
        }}
        animate={{ width: clk ? 18 : hov ? 44 : 28, height: clk ? 18 : hov ? 44 : 28 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
});

// ─── Scroll-driven background ─────────────────────────────────────────────────
const SiteBackground = memo(function SiteBackground() {
  const { scrollYProgress } = useScroll();
  const dotOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.045, 0.03, 0.03, 0.015]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dot grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: dotOpacity,
          backgroundImage: "radial-gradient(circle, #D9FF00 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 10%, rgba(217,255,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(30,100,255,0.04) 0%, transparent 60%)",
        }}
      />
      {/* Side hairlines */}
      <div className="absolute inset-y-0 left-[5%] w-px bg-white/[0.04]" />
      <div className="absolute inset-y-0 right-[5%] w-px bg-white/[0.04]" />
    </div>
  );
});

// ─── Horizontal rule / divider ─────────────────────────────────────────────────
function HR({ className = "" }: { className?: string }) {
  return <div className={`w-full h-px bg-white/[0.08] ${className}`} />;
}

// ─── Section label — NO numbers, word-based ───────────────────────────────────
function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-12">
      <div className="w-4 h-px bg-[#D9FF00]" />
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "#D9FF00",
        }}
      >
        {label.toUpperCase()}
      </span>
    </div>
  );
}

// ─── Reveal wrapper — clips content upward as it enters viewport ──────────────
function Reveal({
  children,
  delay = 0,
  y = 50,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Clip-up reveal for headings — letters slide from behind a clip ────────────
function ClipReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={seen ? { y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Split big headline with staggered lines ──────────────────────────────────
function BigHeadline({
  lines,
  accentLine,
  className = "",
}: {
  lines: string[];
  accentLine?: number;
  className?: string;
}) {
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            initial={{ y: "110%" }}
            animate={seen ? { y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontStyle: i === accentLine ? "italic" : "normal",
                color: i === accentLine ? "#D9FF00" : undefined,
                display: "block",
                lineHeight: 0.92,
              }}
            >
              {line}
            </span>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── Glass card — minimal, sharp ──────────────────────────────────────────────
const GlassCard = memo(function GlassCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-none border border-white/[0.08] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
});

// ─── Static data ───────────────────────────────────────────────────────────────
const stats = [
  { label: "Years",     value: "3+" },
  { label: "Hrs saved", value: "2,000+" },
  { label: "Assets",    value: "30k+" },
  { label: "RFP / RFI", value: "100+" },
  { label: "Awards",    value: "5×" },
];

const chartData = [
  { name: "Harvesting App",      hours: 1200, color: "#D9FF00" },
  { name: "Assets Library",      hours: 200,  color: "#34D399" },
  { name: "Excel → SharePoint",  hours: 500,  color: "#A855F7" },
  { name: "Pillar Metrics",      hours: 185,  color: "#F43F5E" },
  { name: "AI Agents",           hours: 100,  color: "#F59E0B" },
];

const impactMetrics = [
  { label: "Hours",    value: "2,000+",  sub: "Saved annually"        },
  { label: "Assets",   value: "30,000+", sub: "Managed in repository" },
  { label: "Sectors",  value: "13",      sub: "RFP / RFI coverage"    },
  { label: "Pages",    value: "50+",     sub: "Built to KPMG standard"},
];

const projects = [
  {
    org:    "KPMG",
    num:    "01",
    title:  "Power Platform Automated Harvesting",
    desc:   "Power Apps + Power Automate solution for harvesting knowledge assets — saving 1,500 hrs. annually.",
    tags:   ["Power Apps", "Power Automate", "Power BI"],
    impact: "1,200 hrs / yr",
  },
  {
    org:    "KPMG",
    num:    "02",
    title:  "SPO List Migration & Modernisation",
    desc:   "Migrated legacy Excel data to SharePoint Online with real-time notification flows.",
    tags:   ["SharePoint", "Power Apps", "Power Automate"],
    impact: "500 hrs saved",
  },
  {
    org:    "KPMG",
    num:    "03",
    title:  "Global Sector Contact Repository",
    desc:   "Comprehensive member repository spanning globe-wide KPMG sectors with curated pages.",
    tags:   ["SharePoint", "Knowledge Mgmt", "Metadata"],
    impact: "5,000+ members",
  },
  {
    org:    "KPMG",
    num:    "04",
    title:  "Engagement Metrics Dashboard",
    desc:   "Centralised repository for engagement metrics across all assets, visualised in Power BI.",
    tags:   ["Power BI", "Excel", "Analytics"],
    impact: "30k+ assets",
  },
  {
    org:    "GlobalLogic",
    num:    "05",
    title:  "GenAI Training Dataset — Google",
    desc:   "Piloted and delivered test + main dataset for GenAI training, enabling Android content search.",
    tags:   ["GenAI", "QA", "Process Design"],
    impact: "74% → 95% quality",
  },
  {
    org:    "GlobalLogic",
    num:    "06",
    title:  "Multi-Level Doc Retrieval AI",
    desc:   "Extraction system pulling relevant answers from multi-level documents — won against major MNCs.",
    tags:   ["AI Pipelines", "Pilot Mgmt"],
    impact: "1 of 3 pilots secured",
  },
];

const toolkitGroups = [
  { category: "Power Platform",  items: ["Power Apps", "Power Automate", "Power BI"]      },
  { category: "Microsoft 365",   items: ["SharePoint Online", "Excel", "PowerPoint"]       },
  { category: "AI & GenAI",      items: ["Copilot", "AI Agents", "GenAI Workflows"]        },
  { category: "Knowledge Mgmt.", items: ["RFP / RFI", "Taxonomy / Metadata", "SQL"]       },
];

const skills = [
  "Power Apps", "Power Automate", "Power BI", "SharePoint",
  "SQL", "Copilot", "GenAI", "AI Agents", "RFP / RFI",
];

const experienceDefs = [
  {
    start:   new Date(2024, 4, 1),
    end:     null as Date | null,
    dateStr: "May 2024 — Present",
    org:     "KPMG",
    role:    "Analyst — Knowledge Management",
    city:    "Gurugram, India",
    desc:    "Leading cross-functional projects across 13 sectors with 360° stakeholder management, business development, and Power Platform automation.",
    bullets: [
      "Power Platform automation & SharePoint Online ecosystem",
      "360° stakeholder management across 13 sectors",
      "Saved 2,000+ hours annually · 5 awards",
    ],
  },
  {
    start:   new Date(2022, 8, 1),
    end:     new Date(2023, 9, 1),
    dateStr: "Sep 2022 — Oct 2023",
    org:     "GlobalLogic Technologies",
    role:    "Associate Analyst — Content Engineering",
    city:    "Gurugram, India",
    desc:    "Delivered content engineering and AI training datasets for Google & Microsoft, leading pilot projects against major MNC competition.",
    bullets: [
      "GenAI training data for Google & Microsoft",
      "QA error rate reduced by 25%",
      "Led 3 pilot projects — all secured",
    ],
  },
];

const awards = [
  {
    title: "Kudos Award ×2",
    org:   "KPMG",
    desc:  "Exceptional efficiency via Lean Six Sigma — saved 2,000+ hours. Also awarded for migrating legacy VBA/Excel to GenAI agents and Power Platform.",
  },
  {
    title: "Super Team Award",
    org:   "KPMG",
    desc:  "Hosting and organising employee council events for the wider KGS group, fostering community and collaboration.",
  },
  {
    title: "Ally of Inclusion",
    org:   "KPMG",
    desc:  "Commitment to cultivating an inclusive and diverse work environment across KPMG Global Services.",
  },
  {
    title: "Gurus@Work",
    org:   "KPMG",
    desc:  "Contributions to the KGS learning culture — empowering and inspiring learners across the organisation.",
  },
];

const contactItems = [
  { icon: <Mail size={20} />,       label: "Email",    val: "kb270102@gmail.com",   href: "mailto:kb270102@gmail.com" },
  { icon: <Smartphone size={20} />, label: "Phone",    val: "+91-7428062532",        href: "tel:+917428062532" },
  { icon: <Linkedin size={20} />,   label: "LinkedIn", val: "/kartik-bhatt",         href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

// ─── Skills marquee ────────────────────────────────────────────────────────────
const SkillsMarquee = memo(function SkillsMarquee() {
  const rep = useMemo(() => [...skills, ...skills, ...skills, ...skills], []);
  return (
    <div className="overflow-hidden border-t border-b border-white/[0.07]">
      <div
        className="flex py-5"
        style={{ width: "max-content", animation: "marquee 28s linear infinite" }}
      >
        {rep.map((s, i) => (
          <div key={i} className="flex items-center gap-5 shrink-0 px-4">
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "36px",
                letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.07)",
                whiteSpace: "nowrap",
                transition: "color 0.3s",
              }}
              className="hover:!text-[#D9FF00]"
            >
              {s.toUpperCase()}
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "rgba(217,255,0,0.3)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Stat counter — counts up on viewport entry ───────────────────────────────
function StatCounter({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  const ref  = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className="flex flex-col gap-1"
    >
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(36px, 5vw, 56px)",
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: "#fff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded,   setLoaded]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [now,      setNow]      = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const onLoad = useCallback(() => setLoaded(true), []);

  // Scroll-based hero text scale
  const { scrollYProgress: heroScroll } = useScroll();
  const heroScale  = useTransform(heroScroll, [0, 0.2], [1, 0.94]);
  const heroOpacity = useTransform(heroScroll, [0, 0.25], [1, 0]);

  return (
    <div
      className="min-h-screen overflow-x-hidden selection:bg-[#D9FF00] selection:text-black"
      style={{ background: "#030303", color: "#fff", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        section[id] { scroll-margin-top: 90px; }
        ::selection { background:#D9FF00; color:#000; }
      `}</style>

      <div className="hidden md:block"><CustomCursor /></div>
      <LoadingScreen onComplete={onLoad} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SiteBackground />

            {/* ── NAV ───────────────────────────────────────────── */}
            <motion.header
              className="fixed top-0 left-0 right-0 z-[999]"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{
                background: scrolled ? "rgba(3,3,3,0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
                transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
              }}
            >
              <div className="flex items-center justify-between px-6 md:px-10 h-[64px] max-w-[1440px] mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]"
                    style={{ animation: "blink 2.5s ease-in-out infinite" }}
                  />
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: "15px",
                      letterSpacing: "0.1em",
                      color: "#fff",
                    }}
                  >
                    KB_
                  </span>
                </div>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-7">
                  {["about", "experience", "education", "toolkit", "work", "honors", "contact"].map(
                    (href) => (
                      <a
                        key={href}
                        href={`#${href}`}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          letterSpacing: "0.08em",
                          color: "rgba(255,255,255,0.45)",
                          transition: "color 0.2s",
                          textDecoration: "none",
                        }}
                        className="hover:!text-white"
                      >
                        {href.charAt(0).toUpperCase() + href.slice(1)}
                      </a>
                    ),
                  )}
                </nav>

                {/* CTA */}
                <a href="/Resume.pdf" download="Kartik_Bhatt_Resume.pdf" target="_blank" rel="noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2 bg-[#D9FF00] text-black"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                    }}
                  >
                    RESUME <Download size={11} />
                  </motion.button>
                </a>
              </div>
            </motion.header>

            {/* ══════════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex flex-col justify-end pb-16 px-6 md:px-10 pt-28 max-w-[1440px] mx-auto">

              {/* Top eyebrow — role tag */}
              <motion.div
                className="absolute top-28 left-6 md:left-10 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <div className="w-8 h-px bg-[#D9FF00]" />
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    color: "rgba(217,255,0,0.7)",
                  }}
                >
                  PORTFOLIO · 2026
                </span>
              </motion.div>

              {/* Big name */}
              <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="mb-6">
                <div className="overflow-hidden mb-1">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  >
                    <h1
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(80px, 16vw, 200px)",
                        lineHeight: 0.88,
                        letterSpacing: "-0.01em",
                        color: "#fff",
                      }}
                    >
                      KARTIK
                    </h1>
                  </motion.div>
                </div>
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  >
                    <h1
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: "clamp(80px, 16vw, 200px)",
                        lineHeight: 0.88,
                        letterSpacing: "-0.01em",
                        color: "#D9FF00",
                      }}
                    >
                      BHATT
                    </h1>
                  </motion.div>
                </div>
              </motion.div>

              {/* Bottom row */}
              <motion.div
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              >
                <p
                  className="max-w-sm"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Knowledge Management &amp; Business Analyst.<br />
                  Power Platform · GenAI · SharePoint.
                </p>

                <div className="flex items-center gap-4">
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "0.3em",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    THREE YEARS. TWO FIRMS. ONE MISSION.
                  </span>
                  <div className="w-10 h-px bg-[#D9FF00]/40" />
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-8 right-6 md:right-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  className="w-px h-12 bg-white/20"
                  animate={{ scaleY: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  style={{ transformOrigin: "top" }}
                />
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "9px",
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.2)",
                    writingMode: "vertical-rl",
                  }}
                >
                  SCROLL
                </span>
              </motion.div>
            </section>

            <HR />

            {/* ── STATS BAR ─────────────────────────────────────── */}
            <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-14">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-0 md:divide-x md:divide-white/[0.07]">
                {stats.map((s, i) => (
                  <div key={s.label} className="md:px-10 first:pl-0 last:pr-0">
                    <StatCounter value={s.value} label={s.label} delay={i * 0.07} />
                  </div>
                ))}
              </div>
            </section>

            <HR />
            <SkillsMarquee />
            <HR />

            {/* ── ABOUT ─────────────────────────────────────────── */}
            <section id="about" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="About" />
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 lg:gap-20">
                <div>
                  <BigHeadline
                    lines={["I TURN LEGACY", "CHAOS INTO", "AUTOMATED IMPACT."]}
                    accentLine={2}
                    className="text-[clamp(40px,7vw,88px)] mb-8"
                  />
                  <Reveal delay={0.2}>
                    <p
                      className="max-w-lg"
                      style={{
                        fontWeight: 300,
                        fontSize: "15px",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      Results-driven analyst with 3+ years across{" "}
                      <span style={{ color: "#fff", fontWeight: 500 }}>Knowledge Management</span>
                      {" "}&amp;{" "}
                      <span style={{ color: "#fff", fontWeight: 500 }}>Content Engineering</span>
                      {" "}at top global firms. Specialises in Power Platform automation,
                      SharePoint Online, and data-driven operational improvements. Saved 2,000+ hours
                      annually through lean process optimisation and GenAI-powered workflows — across
                      13 sectors and global teams.
                    </p>
                  </Reveal>
                </div>

                <Reveal delay={0.15}>
                  <GlassCard className="p-7">
                    <p
                      className="mb-6"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.3em",
                        color: "#D9FF00",
                      }}
                    >
                      AT A GLANCE
                    </p>
                    {[
                      { l: "Name",   v: "Kartik Bhatt"          },
                      { l: "Role",   v: "Analyst · KPMG"         },
                      { l: "Based",  v: "Delhi, India"            },
                      { l: "Degree", v: "BCA · Computer Science" },
                      { l: "GPA",    v: "9.3 / 10 · top 1%"     },
                    ].map((item) => (
                      <div
                        key={item.l}
                        className="flex justify-between items-center py-3 border-b border-white/[0.06]"
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          {item.l}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: 400, color: "#fff" }}>
                          {item.v}
                        </span>
                      </div>
                    ))}
                  </GlassCard>
                </Reveal>
              </div>
            </section>

            <HR />

            {/* ── EXPERIENCE ────────────────────────────────────── */}
            <section id="experience" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="Experience" />

              <div className="space-y-0">
                {experienceDefs.map((exp, idx) => {
                  const tenure = calcTenure(exp.start, exp.end ?? now);
                  return (
                    <Reveal key={exp.org} delay={idx * 0.08}>
                      <div
                        className="group border-b border-white/[0.07] py-10 grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-8 transition-colors duration-300 hover:bg-white/[0.02]"
                        style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
                      >
                        {/* Date col */}
                        <div className="flex flex-col gap-1 pt-1">
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 700,
                              fontSize: "11px",
                              letterSpacing: "0.2em",
                              color: "rgba(255,255,255,0.25)",
                            }}
                          >
                            {exp.dateStr}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 600,
                              fontSize: "11px",
                              letterSpacing: "0.15em",
                              color: "rgba(217,255,0,0.6)",
                            }}
                          >
                            {tenure.toUpperCase()}
                            {!exp.end && (
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#D9FF00]/10 border border-[#D9FF00]/20" style={{ borderRadius: 0 }}>
                                <span className="w-1 h-1 rounded-full bg-[#D9FF00] animate-pulse" />
                                <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "#D9FF00" }}>LIVE</span>
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Main col */}
                        <div>
                          <h3
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 900,
                              fontSize: "clamp(28px, 4vw, 44px)",
                              lineHeight: 1,
                              letterSpacing: "-0.01em",
                              color: "#fff",
                              marginBottom: "6px",
                            }}
                          >
                            {exp.org}
                          </h3>
                          <p
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 600,
                              fontSize: "14px",
                              letterSpacing: "0.08em",
                              color: "#D9FF00",
                              marginBottom: "12px",
                            }}
                          >
                            {exp.role}
                          </p>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 300,
                              lineHeight: 1.7,
                              color: "rgba(255,255,255,0.45)",
                              maxWidth: "480px",
                            }}
                          >
                            {exp.desc}
                          </p>
                        </div>

                        {/* Bullets col */}
                        <div className="space-y-3 pt-1">
                          {exp.bullets.map((b) => (
                            <div key={b} className="flex items-start gap-3">
                              <span style={{ color: "#D9FF00", marginTop: "2px", flexShrink: 0, fontSize: "12px" }}>+</span>
                              <span style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            <HR />

            {/* ── EDUCATION ─────────────────────────────────────── */}
            <section id="education" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="Education" />
              <Reveal>
                <GlassCard className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
                    <div>
                      <p
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: "11px",
                          letterSpacing: "0.3em",
                          color: "rgba(255,255,255,0.25)",
                          marginBottom: "16px",
                        }}
                      >
                        JUL 2019 — AUG 2022
                      </p>
                      <h3
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 900,
                          fontSize: "clamp(28px, 5vw, 52px)",
                          lineHeight: 0.95,
                          letterSpacing: "-0.01em",
                          color: "#fff",
                          marginBottom: "8px",
                        }}
                      >
                        BACHELOR OF<br />COMPUTER APPLICATIONS
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontStyle: "italic",
                          fontSize: "18px",
                          color: "#D9FF00",
                          marginBottom: "16px",
                        }}
                      >
                        Majors: Computer Science
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.35)",
                          maxWidth: "520px",
                          lineHeight: 1.7,
                        }}
                      >
                        Maharaja Surajmal Institute. Strong academic foundation in Computer Science — analytical
                        mindset from top 1% performance. Technical depth in systems, databases, and software that
                        drives real-world impact at enterprise scale.
                      </p>
                    </div>
                    <div
                      className="border border-[#D9FF00]/25 px-10 py-7 flex flex-col items-center justify-center text-center shrink-0"
                      style={{ background: "rgba(217,255,0,0.04)" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 900,
                          fontSize: "48px",
                          lineHeight: 1,
                          color: "#D9FF00",
                        }}
                      >
                        9.3
                      </span>
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: "11px",
                          letterSpacing: "0.2em",
                          color: "rgba(255,255,255,0.3)",
                          marginTop: "6px",
                        }}
                      >
                        GPA / TOP 1%
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </section>

            <HR />

            {/* ── TOOLKIT ───────────────────────────────────────── */}
            <section id="toolkit" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="Toolkit" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {toolkitGroups.map((g, i) => (
                  <Reveal key={g.category} delay={i * 0.08} y={30}>
                    <GlassCard className="p-6 group hover:-translate-y-1 transition-transform duration-300">
                      <p
                        className="mb-5"
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 800,
                          fontSize: "16px",
                          letterSpacing: "0.05em",
                          color: "#fff",
                          transition: "color 0.3s",
                        }}
                      >
                        {g.category}
                      </p>
                      <ul className="space-y-2.5">
                        {g.items.map((item) => (
                          <li key={item} className="flex items-center gap-3">
                            <span
                              className="w-1 h-1 rounded-full shrink-0"
                              style={{ background: "rgba(217,255,0,0.5)" }}
                            />
                            <span style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </section>

            <HR />

            {/* ── PROJECTS ──────────────────────────────────────── */}
            <section id="work" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="Projects & Impact" />
              <BigHeadline
                lines={["PROJECTS THAT", "MOVED NEEDLES,"]}
                accentLine={-1}
                className="text-[clamp(36px,6vw,80px)] mb-4"
              />
              <div className="overflow-hidden mb-12">
                <motion.div
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: "clamp(36px, 6vw, 80px)",
                      lineHeight: 0.92,
                      color: "#D9FF00",
                    }}
                  >
                    NOT JUST DECKS.
                  </span>
                </motion.div>
              </div>

              {/* Project grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.07] mb-16">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.title}
                    className="bg-[#030303] p-8 flex flex-col gap-5 group hover:bg-white/[0.025] transition-colors duration-300"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP_CARDS}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: "11px",
                          letterSpacing: "0.25em",
                          color: "rgba(255,255,255,0.2)",
                        }}
                      >
                        {p.org} · {p.num}
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D9FF00]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <h3
                        className="group-hover:text-[#D9FF00] transition-colors duration-300"
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 800,
                          fontSize: "22px",
                          lineHeight: 1.05,
                          letterSpacing: "0.01em",
                          color: "#fff",
                          marginBottom: "10px",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.65, color: "rgba(255,255,255,0.4)" }}>
                        {p.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.3)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "3px 10px",
                          }}
                        >
                          {t.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)" }}>
                        IMPACT
                      </span>
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 800,
                          fontSize: "14px",
                          color: "#D9FF00",
                        }}
                      >
                        {p.impact}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Impact metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {impactMetrics.map((m, i) => (
                  <Reveal key={m.label} delay={i * 0.07} y={20}>
                    <GlassCard className="p-7 text-center">
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 900,
                          fontSize: "36px",
                          lineHeight: 1,
                          color: "#fff",
                          marginBottom: "4px",
                        }}
                      >
                        {m.value}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 700,
                          fontSize: "10px",
                          letterSpacing: "0.2em",
                          color: "#D9FF00",
                          marginBottom: "4px",
                        }}
                      >
                        {m.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        {m.sub}
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>

              {/* Chart + key numbers */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                <Reveal>
                  <GlassCard className="p-8 md:p-10">
                    <div className="flex items-end justify-between mb-8">
                      <div>
                        <p
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700,
                            fontSize: "11px",
                            letterSpacing: "0.3em",
                            color: "rgba(255,255,255,0.2)",
                            marginBottom: "6px",
                          }}
                        >
                          ANALYTICS
                        </p>
                        <h3
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: "26px",
                            lineHeight: 1.1,
                            color: "#fff",
                          }}
                        >
                          HOURS SAVED,<br />
                          <span style={{ color: "#D9FF00", fontStyle: "italic" }}>BY INITIATIVE.</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <div
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: "32px",
                            color: "#D9FF00",
                            lineHeight: 1,
                          }}
                        >
                          2,185
                        </div>
                        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
                          TOTAL HRS SAVED
                        </div>
                      </div>
                    </div>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                            width={140}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            contentStyle={{
                              background: "#111",
                              border: "1px solid rgba(217,255,0,0.2)",
                              borderRadius: 0,
                              fontFamily: "'Barlow Condensed', sans-serif",
                            }}
                            itemStyle={{ color: "#D9FF00", fontWeight: 700 }}
                            formatter={(v: any) => [`${v} hrs`, "Saved"]}
                          />
                          <Bar dataKey="hours" radius={[0, 2, 2, 0]} barSize={18} isAnimationActive={false}>
                            {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </Reveal>

                <Reveal delay={0.1}>
                  <GlassCard className="p-8 flex flex-col gap-5 h-full">
                    <p
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: "11px",
                        letterSpacing: "0.3em",
                        color: "rgba(255,255,255,0.2)",
                        marginBottom: "4px",
                      }}
                    >
                      KEY NUMBERS
                    </p>
                    {[
                      "Managed 5,000+ KPMG member contacts",
                      "QA'd 100+ content pieces weekly",
                      "Uploaded 5,000+ content assets",
                      "Improved quality: 74% → 95%",
                      "Delivered 2 weeks ahead of schedule",
                    ].map((txt, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <span style={{ color: "#D9FF00", flexShrink: 0, marginTop: "2px", fontSize: "12px" }}>+</span>
                        <span style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                          {txt}
                        </span>
                      </div>
                    ))}
                    <div
                      className="mt-auto p-5"
                      style={{ background: "#D9FF00" }}
                    >
                      <p
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontWeight: 900,
                          fontSize: "13px",
                          color: "#000",
                          letterSpacing: "0.05em",
                          marginBottom: "6px",
                        }}
                      >
                        IMPACT DRIVEN
                      </p>
                      <p style={{ fontSize: "12px", fontWeight: 500, lineHeight: 1.55, color: "rgba(0,0,0,0.7)" }}>
                        "Data-driven decisions combined with automated workflows deliver exponential efficiency."
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              </div>
            </section>

            <HR />

            {/* ── HONORS ────────────────────────────────────────── */}
            <section id="honors" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <SectionEyebrow label="Honors" />
              <BigHeadline
                lines={["FIVE AWARDS.", "DISCIPLINE", "COLLECTING INTEREST."]}
                accentLine={2}
                className="text-[clamp(36px,6vw,80px)] mb-14"
              />
              <div className="space-y-0">
                {awards.map((a, i) => (
                  <Reveal key={a.title} delay={i * 0.07}>
                    <div className="group border-b border-white/[0.07] py-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start hover:bg-white/[0.02] transition-colors duration-300"
                      style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 700,
                              fontSize: "10px",
                              letterSpacing: "0.3em",
                              color: "rgba(255,255,255,0.2)",
                            }}
                          >
                            {a.org}
                          </span>
                        </div>
                        <h3
                          className="group-hover:text-[#D9FF00] transition-colors duration-300"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: "clamp(22px, 3vw, 32px)",
                            letterSpacing: "0.01em",
                            color: "#fff",
                            marginBottom: "8px",
                          }}
                        >
                          {a.title.toUpperCase()}
                        </h3>
                        <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.65, color: "rgba(255,255,255,0.4)", maxWidth: "600px" }}>
                          {a.desc}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.5}
                        className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-[#D9FF00] shrink-0"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <HR />

            {/* ── CONTACT ───────────────────────────────────────── */}
            <section id="contact" className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
              <BigHeadline
                lines={["LET'S BUILD", "SOMETHING", "IMPACTFUL."]}
                accentLine={2}
                className="text-[clamp(52px, 10vw, 140px)] mb-16"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                {contactItems.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
                    <GlassCard className="p-8 flex items-center gap-5 hover:!border-[#D9FF00]/30 transition-all duration-300">
                      <span className="text-white/30 group-hover:text-[#D9FF00] transition-colors duration-300">
                        {item.icon}
                      </span>
                      <div>
                        <p
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700,
                            fontSize: "10px",
                            letterSpacing: "0.3em",
                            color: "rgba(255,255,255,0.25)",
                            marginBottom: "4px",
                          }}
                        >
                          {item.label.toUpperCase()}
                        </p>
                        <p style={{ fontSize: "14px", fontWeight: 400, color: "#fff" }}>{item.val}</p>
                      </div>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.5}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-[#D9FF00] transition-opacity"
                      />
                    </GlassCard>
                  </a>
                ))}
              </div>

              <HR />

              <footer className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  © 2026 / KARTIK BHATT
                </span>
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.15)",
                  }}
                >
                  DELHI, INDIA
                </span>
              </footer>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
