/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, ReactNode, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Download, Mail, Smartphone, Linkedin, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = memo(function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Ramp up progress
    const steps = [
      { target: 30,  delay: 0,    duration: 400  },
      { target: 65,  delay: 400,  duration: 500  },
      { target: 88,  delay: 900,  duration: 400  },
      { target: 100, delay: 1300, duration: 300  },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ target, delay, duration }) => {
      timers.push(
        setTimeout(() => {
          const start = Date.now();
          const startVal = progress;
          const tick = () => {
            const elapsed = Date.now() - start;
            const t = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setProgress(Math.round(startVal + (target - startVal) * ease));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay)
      );
    });
    // Trigger exit
    timers.push(setTimeout(() => setPhase("done"), 1700));
    timers.push(setTimeout(() => onComplete(), 2300));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.03 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Grid bg */}
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

          {/* Glow blob */}
          <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#D9FF00]/10 rounded-full blur-[120px] opacity-20 pointer-events-none" />

          {/* Corner marks */}
          {[
            "top-6 left-6 border-t border-l",
            "top-6 right-6 border-t border-r",
            "bottom-6 left-6 border-b border-l",
            "bottom-6 right-6 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-6 h-6 border-white/20 ${cls}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            />
          ))}

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center mb-10"
          >
            <div
              className="text-[68px] md:text-[100px] font-black leading-none tracking-tighter select-none"
              style={{ animation: "loaderFlicker 3s ease-in-out infinite" }}
            >
              kartik<span className="text-[#D9FF00]">_</span>
            </div>
            <div className="text-[10px] font-bold tracking-[0.5em] text-white/25 uppercase mt-2">
              Knowledge Management · Power Platform · GenAI
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-[200px] h-[2px] bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D9FF00] rounded-full transition-all duration-150"
                style={{
                  width: `${progress}%`,
                  boxShadow: "0 0 10px #D9FF00, 0 0 20px rgba(217,255,0,0.4)",
                }}
              />
            </div>
            <div className="flex items-center justify-between w-[200px]">
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/25 uppercase">Loading</span>
              <span className="text-[9px] font-black text-[#D9FF00] tabular-nums">{progress}%</span>
            </div>
          </motion.div>

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF00]/20 to-transparent pointer-events-none"
            style={{ animation: "scanline 2.5s linear infinite" }}
          />

          <style>{`
            @keyframes loaderFlicker {
              0%,100%   { opacity:1; }
              44%        { opacity:1; }
              45%        { opacity:.4; }
              46%        { opacity:1; }
              89%        { opacity:1; }
              90%        { opacity:.6; }
              91%        { opacity:1; }
            }
            @keyframes scanline {
              0%   { top: -2px; opacity:0; }
              10%  { opacity:1; }
              90%  { opacity:1; }
              100% { top: 100%; opacity:0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── Shared glass card ────────────────────────────────────────────────────────
const GlassCard = memo(function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={[
      "relative overflow-hidden rounded-2xl",
      "border border-white/10 bg-white/[0.03] backdrop-blur-sm",
      "transition-all duration-500",
      "hover:border-neon/35 hover:bg-white/[0.05]",
      "hover:shadow-[0_0_36px_0_rgba(217,255,0,0.07)]",
      className,
    ].join(" ")}>
      {children}
    </div>
  );
});

// ─── Animated stagger headline ────────────────────────────────────────────────
const StaggerHeadline = memo(function StaggerHeadline({
  lines,
  className = "",
  dimFrom = 1,
  greenWords = [],
}: {
  lines: readonly string[];
  className?: string;
  dimFrom?: number;
  greenWords?: string[];
}) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className={["font-black tracking-tighter", className].join(" ")}
    >
      {lines.map((line, idx) => (
        <motion.span
          key={line}
          variants={{ hidden: { opacity: 0, y: 60, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`block${idx >= dimFrom ? " text-white/20 italic" : ""}`}
        >
          {greenWords.includes(line)
            ? <span className="text-[#D9FF00]">{line}</span>
            : line}
        </motion.span>
      ))}
    </motion.h2>
  );
});

// ─── Static data ──────────────────────────────────────────────────────────────
const stats = [
  { label: "YEARS",          value: "3+"     },
  { label: "HRS SAVED",      value: "2,000+" },
  { label: "ASSETS MANAGED", value: "30k+"   },
  { label: "RFP / RFI",      value: "100+"   },
  { label: "AWARDS",         value: "5×"     },
];

const chartData = [
  { name: "Harvesting App",       hours: 1200, color: "#D9FF00" },
  { name: "Assets Library Mgmt",  hours: 200,  color: "#34D399" },
  { name: "Legacy Excel to SPO",  hours: 500,  color: "#A855F7" },
  { name: "Pillar Metrices",      hours: 185,  color: "#F43F5E" },
  { name: "AI Agents",            hours: 100,  color: "#F59E0B" },
];

const impactMetrics = [
  { label: "Hours",    value: "2,000+",  sub: "Saved Annually",         color: "border-yellow-500/20"  },
  { label: "Assets",   value: "30,000+", sub: "Managed in Repository",  color: "border-emerald-500/20" },
  { label: "RFP/RFIs", value: "100+",    sub: "Across 13 Sectors",      color: "border-rose-500/20"    },
  { label: "Pages",    value: "50+",     sub: "Built to KPMG Standards", color: "border-purple-500/20" },
];

const projects = [
  {
    org: "KPMG",
    title: "Power Platform Automated Harvesting",
    desc: "Built Power Apps + Power Automate solution for harvesting knowledge assets — saving 1,500 hrs. annually.",
    tags: ["POWER APPS", "POWER AUTOMATE", "POWER BI"],
    impact: "1,200 hrs saved / year",
  },
  {
    org: "KPMG",
    title: "SPO List Migration & Modernisation",
    desc: "Migrated legacy Excel data to SharePoint Online with Power Automate flows for real-time notifications.",
    tags: ["SHAREPOINT ONLINE", "POWER APPS", "POWER AUTOMATE"],
    impact: "500 hrs saved",
  },
  {
    org: "KPMG",
    title: "Global Sector Contact Repository",
    desc: "Comprehensive repository for sector contacts spanning globe-wide KPMG members with curated sector pages.",
    tags: ["SHAREPOINT", "KNOWLEDGE MGMT", "METADATA MGMT"],
    impact: "5,000+ members",
  },
  {
    org: "KPMG",
    title: "Engagement Metrics Dashboard",
    desc: "Centralised repository for engagement metrics across all assets, visualised in Power BI for leadership reporting.",
    tags: ["POWER BI", "EXCEL", "DATA ANALYTICS"],
    impact: "30K+ assets tracked",
  },
  {
    org: "GLOBALLOGIC",
    title: "GenAI Training Dataset — Google",
    desc: "Piloted and delivered test + main dataset for GenAI training, enabling content search on Android screens.",
    tags: ["GENAI", "QA", "PROCESS DESIGN"],
    impact: "74% → 95% quality",
  },
  {
    org: "GLOBALLOGIC",
    title: "Multi-Level Doc Retrieval AI",
    desc: "Piloted an extraction system pulling relevant answers from multi-level documents for AI training datasets — won against major MNCs.",
    tags: ["AI PIPELINES", "PILOT MGMT"],
    impact: "1 of 3 pilots secured",
  },
];

const toolkitGroups = [
  {
    category: "Power Platform",
    items: ["Power Apps", "Power Automate", "Power BI"],
  },
  {
    category: "Microsoft 365",
    items: ["SharePoint Online", "Excel", "PowerPoint"],
  },
  {
    category: "AI & GenAI",
    items: ["Copilot", "AI Agents", "GenAI Workflows"],
  },
  {
    category: "Knowledge Mgmt.",
    items: ["RFP / RFI", "Taxonomy / Metadata Mgmt.", "SQL"],
  },
];

const skills = [
  "Power Apps", "Power Automate", "Power BI", "SharePoint",
  "SQL", "Copilot", "Gen AI", "AI Agents", "GenAI Workflows", "RFP / RFI",
];

const experiences = [
  {
    date: "MAY 2024 — PRESENT",
    org: "KPMG",
    role: "Analyst — Knowledge Management",
    loc: "2 YEARS · GURUGRAM, HARYANA",
    desc: "Leading cross-functional projects across 13 sectors with 360° stakeholder management, business development, and Power Platform automation.",
    bullets: [
      "Power Platform automation & SharePoint Online ecosystem",
      "360° stakeholder management across 13 sectors",
      "Saved 2,000+ hours annually · 5 awards earned",
    ],
  },
  {
    date: "SEP 2022 — OCT 2023",
    org: "GlobalLogic Technologies",
    role: "Associate Analyst — Content Engineering",
    loc: "1 YEAR 2 MONTHS · GURUGRAM, HARYANA",
    desc: "Delivered content engineering and AI training datasets for Google & Microsoft, leading pilot projects against major MNC competition.",
    bullets: [
      "GenAI training data for Google & Microsoft",
      "QA error rate reduced by 25%",
      "Led 3 pilot projects — all secured",
    ],
  },
];

// ── CHANGE 4: "KPMG GLOBAL SERVICES" → "KPMG" in all awards ─────────────────
const awards = [
  {
    num: "01",
    title: "Kudos award × 2",
    org: "KPMG",
    desc: "Exceptional efficiency via Lean Six Sigma — saved 2,000+ hours annually. Also awarded for migrating legacy VBA / Excel to GenAI agents & Power Platform.",
  },
  {
    num: "02",
    title: "Super team award",
    org: "KPMG",
    desc: "Hosting and organising employee council events for the wider KGS group, fostering community and collaboration.",
  },
  {
    num: "03",
    title: "Ally of inclusion",
    org: "KPMG",
    desc: "Commitment to cultivating an inclusive and diverse work environment across KPMG Global Services.",
  },
  {
    num: "04",
    title: "Gurus@work",
    org: "KPMG",
    desc: "Contributions to KGS learning culture — empowering and inspiring learners across the organisation.",
  },
];

const contactItems = [
  { icon: <Mail size={24} />,       label: "EMAIL",    val: "kb270102@gmail.com",  href: "mailto:kb270102@gmail.com" },
  { icon: <Smartphone size={24} />, label: "PHONE",    val: "+91-7428062532",       href: "tel:+917428062532" },
  { icon: <Linkedin size={24} />,   label: "LINKEDIN", val: "/kartik-bhatt",        href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

const keyNumbers = [
  "Managed 5,000+ KPMG members contact system",
  "QA'd 100+ content pieces weekly",
  "Uploaded 5,000+ content assets",
  "Improved project quality from 74% → 95%",
  "Delivered project 2 weeks ahead of schedule",
];

const VP = { once: true, amount: 0.45 } as const;
const VP_CARDS = { once: true, amount: 0.15 } as const;

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="text-neon font-black text-sm">{num}</span>
      <div className="w-14 h-px bg-neon" />
      <span className="text-[11px] font-black tracking-[0.4em] text-neon uppercase">{label}</span>
    </div>
  );
}

// ─── Skills carousel ──────────────────────────────────────────────────────────
const SkillsCarousel = memo(function SkillsCarousel() {
  const repeatedSkills = useMemo(() => [...skills, ...skills, ...skills, ...skills], []);
  return (
    <div className="w-full border-y border-white/5 overflow-hidden">
      <div
        style={{ display: "flex", width: "max-content", animation: "marquee 30s linear infinite" }}
        className="py-7"
      >
        {repeatedSkills.map((skill, i) => (
          <div key={i} className="flex items-center gap-5 shrink-0 px-3">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-white/10 hover:text-neon transition-colors duration-300 whitespace-nowrap">
              {skill.toUpperCase()}
            </span>
            <div className="w-2.5 h-2.5 bg-neon rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Static background ───────────────────────────────────────────────────────
const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "100px 100px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-[0.08]"
            style={{ rotate: `${i * 45}deg`, left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
          >
            <div className="w-16 h-16 border border-neon rounded-sm rotate-45" />
            <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-neon to-transparent" />
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden opacity-[0.04] flex flex-col items-center py-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 h-32 bg-neon mt-4 rounded-full" />
        ))}
      </div>
      <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-neon/10 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] opacity-10" />
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { scrollYProgress } = useScroll();
  const yDrift        = useTransform(scrollYProgress, [0, 1], [0,  400]);
  const yDriftReverse = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-neon selection:text-black">
      <style>{`
        @keyframes datapulse {
          0%,100% { opacity:.2; transform:scaleY(.8); }
          50%      { opacity:1;  transform:scaleY(1.2); }
        }
        @keyframes marquee {
          from { transform:translateX(0); }
          to   { transform:translateX(-50%); }
        }
        @keyframes dotblink {
          0%,100% { opacity:1; }
          50%     { opacity:0.15; }
        }
        section[id] {
          scroll-margin-top: 100px;
        }
      `}</style>

      {/* ── LOADING SCREEN ───────────────────────────────────────────── */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Background yDrift={yDrift} yDriftReverse={yDriftReverse} />

        {/* ── NAV ─────────────────────────────────────────────────────── */}
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[92%] max-w-7xl z-[999]"
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <nav
            className="backdrop-blur-[24px] border rounded-2xl px-6 md:px-10 h-16 flex items-center justify-between"
            style={{
              background: scrolled ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0)",
              borderColor: scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)",
              boxShadow: scrolled
                ? "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(217,255,0,0.04), inset 0 1px 0 rgba(217,255,0,0.06)"
                : "none",
              transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-neon rounded-full"
                style={{ animation: "dotblink 2.4s ease-in-out infinite" }}
              />
              <span className="font-bold tracking-tighter text-sm uppercase">kartik.bhatt</span>
            </div>
            <div className="hidden md:flex gap-5 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
              {["about", "experience", "education", "toolkit", "work", "honors", "contact"].map(link => (
                <a key={link} href={`#${link}`} className="hover:text-neon transition-colors">
                  {link === "work" ? "Projects" : link.charAt(0).toUpperCase() + link.slice(1)}
                </a>
              ))}
            </div>
            <a href="/Resume.pdf" download="Kartik_Bhatt_Resume.pdf" target="_blank" rel="noreferrer">
              <button className="bg-neon text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
                Resume <Download size={12} />
              </button>
            </a>
          </nav>
        </motion.div>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="min-h-screen pt-36 pb-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
              className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-neon" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Portfolio</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="text-[80px] md:text-[150px] font-black leading-[0.75] tracking-tighter">
              kartik<br />
              <span className="text-white/20">bhatt</span>
              <span className="text-neon">_</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
              transition={{ delay: 0.3 }}
              className="mt-10 text-lg md:text-xl text-white/60 font-light max-w-lg leading-relaxed">
              Knowledge Management &amp; Business Analyst.<br />
              <span className="text-white/30 text-sm font-mono tracking-widest uppercase mt-3 block">
                power platform · genai · sharepoint
              </span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center gap-4">
              <div className="w-8 h-px bg-neon/60" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-neon/70 uppercase">
                Three years. Two global firms. One mission.
              </span>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={VP} transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="relative w-full max-w-[480px] h-[440px] shrink-0">
            <div className="absolute inset-0 border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.03] backdrop-blur-sm shadow-[0_0_60px_0_rgba(217,255,0,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
              <img src="/profile.jpg" alt="Kartik Bhatt" loading="eager" decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute bottom-8 left-8 z-20">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">ANALYST · KPMG</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────── */}
        <section className="border-y border-white/5 bg-white/[0.015] backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/5">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={VP} transition={{ delay: i * 0.08 }}
                className="p-10 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors cursor-default">
                <div className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section id="about" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="01" label="About Me" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
              <div>
                <StaggerHeadline
                  lines={["i turn legacy", "chaos into measurable,", "automated impact."]}
                  className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
                  dimFrom={1}
                  greenWords={["automated impact."]}
                />
                <p className="text-white/60 text-base leading-relaxed font-light">
                  Results-driven analyst with 3+ years across{" "}
                  <span className="text-white font-medium">Knowledge Management</span> &amp;{" "}
                  <span className="text-white font-medium">Content Engineering</span> at top global firms.
                  Specialises in Power Platform automation, SharePoint Online, and data-driven operational
                  improvements. Saved 2,000+ hours annually through lean process optimisation and
                  GenAI-powered workflows — across 13 sectors and global teams.
                </p>
              </div>
              <div>
                <GlassCard className="p-9">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-neon uppercase mb-7">/ At a Glance</div>
                  <div className="space-y-0">
                    {[
                      { l: "NAME",   v: "Kartik Bhatt"          },
                      { l: "ROLE",   v: "Analyst · KPMG"         },
                      { l: "BASED",  v: "Delhi, India"            },
                      { l: "DEGREE", v: "BCA · Computer Science" },
                      { l: "GPA",    v: "9.3 / 10 · top 1%"     },
                    ].map(item => (
                      <div key={item.l} className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[9px] font-bold text-white/30 tracking-[0.2em]">{item.l}</span>
                        <span className="text-sm font-medium">{item.v}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ────────────────────────────────────────────── */}
        <section id="experience" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="02" label="Experience" />
            <div className="space-y-8">
              {experiences.map((exp) => (
                <motion.div key={exp.org} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}>
                  <GlassCard className="flex flex-col lg:flex-row gap-10 lg:gap-20 p-8">
                    <div className="w-44 text-[10px] font-bold text-white/30 tracking-widest pt-1 shrink-0">{exp.date}</div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-3xl font-black tracking-tight mb-2">{exp.org}</h3>
                        <div className="text-neon text-sm font-medium mb-2">{exp.role}</div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">{exp.loc}</div>
                      </div>
                      <div>
                        <p className="text-white/50 mb-5 font-light text-sm leading-relaxed">{exp.desc}</p>
                        <ul className="space-y-3">
                          {exp.bullets.map(b => (
                            <li key={b} className="flex gap-3 text-sm font-medium items-start">
                              <span className="text-neon shrink-0 mt-px">+</span>
                              <span className="text-white/80">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCATION ─────────────────────────────────────────────── */}
        {/* CHANGE 2: max-w-4xl + centered + slideInLeft animation */}
        <section id="education" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="03" label="Education" />
            <motion.div
              initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={VP}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <GlassCard className="p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none select-none">
                  <div className="text-[100px] md:text-[160px] font-black italic">BCA</div>
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                      <h3 className="text-2xl md:text-4xl font-black tracking-tighter mb-3 uppercase">
                        Bachelor of Computer Applications
                      </h3>
                      <div className="text-neon text-lg font-bold italic tracking-tight">Majors: Computer Science</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
                      <div className="text-base font-medium">JUL 2019 — AUG 2022</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1">
                      <div className="text-xl font-bold tracking-tight text-white/60 mb-4 italic">
                        Maharaja Surajmal Institute
                      </div>
                      <p className="text-white/40 max-w-xl leading-relaxed font-light text-sm">
                        Strong academic foundation in Computer Science. Analytical mindset sharpened from Top 1%
                        performance. Technical depth in systems, databases, and software that drives real-world impact at enterprise scale.
                      </p>
                    </div>
                    <div className="border border-neon/30 bg-neon/[0.06] backdrop-blur-sm p-8 rounded-3xl flex flex-col items-center justify-center text-neon shrink-0 shadow-[0_0_40px_0_rgba(217,255,0,0.1)]">
                      <div className="text-4xl font-black tracking-tighter">9.3 / 10</div>
                      <div className="text-[10px] font-black tracking-widest uppercase mt-2 text-white/40">GPA / TOP 1%</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ── TOOLKIT & EXPERTISE ───────────────────────────────────── */}
        <section id="toolkit" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="-mx-6 md:-mx-12"><SkillsCarousel /></div>

          <div className="max-w-7xl mx-auto mt-14">
            <SectionLabel num="04" label="Toolkit & Expertise" />

            {/* CHANGE 3: tighter padding + inline-flex to hug content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {toolkitGroups.map((group, i) => (
                <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-5 group hover:-translate-y-1">
                    <div className="text-base font-black tracking-tight text-white mb-4 group-hover:text-neon transition-colors duration-300">
                      {group.category}
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon/50 group-hover:bg-neon shrink-0 transition-colors duration-300" />
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

        {/* ── PROJECTS & IMPACT ─────────────────────────────────────── */}
        <section id="work" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="05" label="Projects & Impact" />

            <StaggerHeadline
              lines={["projects that moved", "needles, not just", "decks."]}
              className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
              dimFrom={1}
              greenWords={["decks."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {projects.map((p, i) => (
                <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP_CARDS} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}>
                  <GlassCard className="group p-8 flex flex-col h-full gap-6 hover:-translate-y-1">
                    {/* CHANGE 5: org label is now grey like awards, not neon */}
                    <span className="text-[10px] font-black text-white/25 tracking-[0.3em] uppercase">{p.org}</span>
                    <div>
                      <h3 className="text-xl font-black leading-tight mb-3 tracking-tight group-hover:text-neon transition-colors">{p.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black tracking-widest uppercase border border-white/5 group-hover:text-neon group-hover:border-neon/30 transition-all">{t}</span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                      <span className="text-[8px] font-bold text-white/30 tracking-[0.3em] uppercase">Impact</span>
                      <span className="text-xs font-bold text-neon">{p.impact}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {impactMetrics.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP} transition={{ delay: i * 0.08 }}>
                  <GlassCard className={`p-7 border ${m.color} flex flex-col items-center text-center h-full`}>
                    <div className="text-3xl font-black mb-1 tracking-tighter">{m.value}</div>
                    <div className="text-[9px] font-black tracking-[0.2em] uppercase text-neon mb-1">{m.label}</div>
                    <div className="text-[9px] font-medium text-white/30 tracking-wider uppercase">{m.sub}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} className="lg:col-span-2">
                <GlassCard className="p-10 h-full">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-2">/ Analytics</div>
                      <h3 className="text-2xl font-black tracking-tight">
                        the receipts.<br /><span className="text-neon italic">hours saved, by initiative.</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-neon">2,185_hrs</div>
                      <div className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Total Saved</div>
                    </div>
                  </div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                          tick={{ fill: "#ffffff40", fontSize: 9, fontWeight: 700 }} width={130} />
                        <Tooltip cursor={{ fill: "#ffffff05" }}
                          contentStyle={{ background: "#111", border: "1px solid rgba(217,255,0,0.2)", borderRadius: "12px" }}
                          itemStyle={{ color: "#D9FF00", fontWeight: "bold" }}
                          formatter={(v: any) => [`${v} hrs`, "Hours saved"]} />
                        <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={22} isAnimationActive={false}>
                          {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}>
                <GlassCard className="p-10 flex flex-col gap-6 h-full">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-5">/ Key Numbers</div>
                    <div className="space-y-5">
                      {keyNumbers.map((text, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-5 h-5 rounded-full bg-neon/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neon transition-all group-hover:text-black">
                            <CheckCircle2 size={12} />
                          </div>
                          <span className="text-sm font-medium text-white/60 leading-tight group-hover:text-white transition-colors">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto p-5 bg-neon text-black rounded-2xl">
                    <div className="font-black text-xs tracking-widest uppercase mb-1">Impact Driven</div>
                    <p className="text-xs font-bold leading-relaxed opacity-80">
                      "Data-driven decisions combined with automated workflows result in exponential efficiency."
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HONORS / AWARDS ───────────────────────────────────────── */}
        <section id="honors" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="06" label="Honors" />

            <StaggerHeadline
              lines={["five awards.", "discipline collecting", "interest."]}
              className="text-4xl md:text-[54px] leading-[0.85] mb-14"
              dimFrom={1}
              greenWords={["interest."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map((award, i) => (
                <motion.div key={award.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP_CARDS} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-7 h-full group">
                    <div className="mb-3">
                      <span className="text-[9px] font-bold tracking-[0.25em] text-white/20 uppercase">{award.org}</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-neon transition-colors">{award.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{award.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <section id="contact" className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <StaggerHeadline
              lines={["let's build", "something", "impactful."]}
              className="text-[52px] md:text-[105px] leading-[0.8] mb-10 uppercase"
              dimFrom={1}
              greenWords={["impactful."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
              {contactItems.map(item => (
                <a key={item.label} href={item.href} className="group" target="_blank" rel="noopener noreferrer">
                  <GlassCard className="p-10 flex flex-col items-center gap-5">
                    <div className="text-white/40 group-hover:text-neon transition-colors">{item.icon}</div>
                    <div className="text-[9px] font-bold tracking-[0.4em] text-white/40 group-hover:text-neon transition-colors uppercase">{item.label}</div>
                    <div className="text-sm font-medium text-white">{item.val}</div>
                  </GlassCard>
                </a>
              ))}
            </div>

            <footer className="mt-14 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
              <div>© 2026-28 / KARTIK BHATT</div>
              <div>DELHI, INDIA</div>
            </footer>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
Here's a summary of every change made:

01 — Loading Screen — Full-screen cinematic loader with your name flickering (subtle glitch effect), an animated neon progress bar with percentage counter, a perspective grid background, corner bracket marks, and a scan line sweeping top to bottom. The whole site fades in with a blur transition once loading completes (~2.3s).

02 — Education Tile — Wrapped in max-w-4xl so it no longer stretches the full width, and added a motion.div with a slide-in-from-left + blur entrance animation.

03 — Toolkit Tiles — Reduced padding from p-8 to p-5, tightened gap and space-y, removed the bottom mb-8 — cards now hug content snugly.

04 — Awards Org Label — All 4 awards changed from "KPMG GLOBAL SERVICES" → "KPMG".

05 — Project Org Names — Changed from text-neon to text-white/25 to match the grey treatment already used in the awards cards.

Sorry dont reduce width but height of the eductaion tile. plus animations are loading beforre we reach at that point. Plus can you add a diffent mouse type according to the site and add moving bakcground emenets that move with the movement of mouse. make sure everything is loaded before so that site doesnt lag at all

10:00 PM

Check frontend design skill
Check frontend design skill
Got it. Here's the plan before writing a single line:

Education tile height — reduce padding top/bottom, make the content more compact
Animations fire too early — fix viewport threshold: use amount: 0.3 + once: true, and never whileInView — instead use useInView hook so they only trigger when element is actually scrolled to
Custom cursor — crosshair/dot style matching the neon aesthetic, with a trailing ring
Mouse-parallax background — floating geometric elements that drift subtly with mouse position using useMotionValue + useSpring (spring = silky smooth, zero lag)
Performance — all parallax elements are will-change: transform, pointer-events: none, RAF-throttled mouse tracking, no layout thrash



Here's the complete updated code with all changes applied precisely:

tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, ReactNode, useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { Download, Mail, Smartphone, Linkedin, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── Custom Cursor ────────────────────────────────────────────────────────────
const CustomCursor = memo(function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(useMotionValue(-100), { stiffness: 120, damping: 18, mass: 0.6 });
  const ringY = useSpring(useMotionValue(-100), { stiffness: 120, damping: 18, mass: 0.6 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(!!(t.closest("a,button,[data-cursor-hover]")));
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: clicking ? 6 : hovered ? 16 : 8,
          height: clicking ? 6 : hovered ? 16 : 8,
          background: "#D9FF00",
          transition: "width .2s ease, height .2s ease",
        }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: clicking ? 24 : hovered ? 52 : 34,
          height: clicking ? 24 : hovered ? 52 : 34,
          borderColor: hovered ? "rgba(217,255,0,0.9)" : "rgba(217,255,0,0.4)",
          transition: "width .25s cubic-bezier(.16,1,.3,1), height .25s cubic-bezier(.16,1,.3,1), border-color .2s",
        }}
      />
    </>
  );
});

// ─── Mouse Parallax Background ────────────────────────────────────────────────
const ParallaxBackground = memo(function ParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Each layer springs at a different stiffness for depth illusion
  const s1x = useSpring(mouseX, { stiffness: 30, damping: 30, mass: 1 });
  const s1y = useSpring(mouseY, { stiffness: 30, damping: 30, mass: 1 });
  const s2x = useSpring(mouseX, { stiffness: 50, damping: 35, mass: 0.8 });
  const s2y = useSpring(mouseY, { stiffness: 50, damping: 35, mass: 0.8 });
  const s3x = useSpring(mouseX, { stiffness: 20, damping: 25, mass: 1.2 });
  const s3y = useSpring(mouseY, { stiffness: 20, damping: 25, mass: 1.2 });

  useEffect(() => {
    let rafId: number;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 60;
        const cy = (e.clientY / window.innerHeight - 0.5) * 60;
        mouseX.set(cx);
        mouseY.set(cy);
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  const floatStyle = "absolute pointer-events-none will-change-transform";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Static perspective grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "100px 100px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>

      {/* ── PARALLAX LAYER 1 — slow, deep (large elements) */}
      <motion.div className={floatStyle} style={{ x: s3x, y: s3y, left: "8%", top: "15%" }}>
        <div className="w-24 h-24 border border-[#D9FF00]/10 rotate-45 rounded-sm" />
      </motion.div>

      <motion.div className={floatStyle} style={{ x: s3x, y: s3y, right: "6%", bottom: "25%" }}>
        <div className="w-40 h-40 border border-[#D9FF00]/[0.06] rounded-full" />
      </motion.div>

      {/* ── PARALLAX LAYER 2 — medium speed */}
      <motion.div className={floatStyle} style={{ x: s2x, y: s2y, right: "18%", top: "20
Claude's response was interrupted.
MOuse looks good, dont remove description block from educations ytile just reduce height as there is a lot of white space. Plus elements should feel like website is for someone who can code, automate and all

10:03 PM
Got it — keep the description, just tighten the padding/spacing. And shift the floating elements to feel more technical — binary streams, circuit traces, terminal brackets, code fragments, grid coordinates. Less geometric art, more "I wrote this."

Let me give you the precise diffs only:



Now here are the exact code changes to apply to your file — surgical diffs, nothing else touched:

1. Education tile — reduce height (keep description, just tighten padding + font sizes)
Find the education <GlassCard> and replace it with:

tsx
// ── BEFORE ──
<GlassCard className="p-8 md:p-14 relative overflow-hidden">
  ...
  <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 uppercase">Bachelor of Computer Applications</h3>
  <div className="text-neon text-xl font-bold italic tracking-tight">Majors: Computer Science</div>
  ...
  <div className="text-right shrink-0">
    <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
    <div className="text-lg font-medium">JUL 2019 — AUG 2022</div>
  </div>
  ...
  <div className="text-2xl font-bold tracking-tight text-white/60 mb-4 italic">Maharaja Surajmal Institute</div>
  <p className="text-white/40 max-w-2xl leading-relaxed font-light text-sm">...</p>
  ...
  <div className="text-5xl font-black tracking-tighter">9.3 / 10</div>
  <div className="text-[10px] font-black tracking-widest uppercase mt-2 text-white/40">GPA / TOP 1%</div>
  ...
  // GPA pill: p-10 rounded-3xl

// ── AFTER ──
<GlassCard className="p-5 md:p-7 relative overflow-hidden">
  ...
  <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 uppercase">Bachelor of Computer Applications</h3>
  <div className="text-neon text-base font-bold italic tracking-tight">Majors: Computer Science</div>
  ...
  <div className="text-right shrink-0">
    <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
    <div className="text-sm font-medium">JUL 2019 — AUG 2022</div>
  </div>
  ...
  <div className="text-lg font-bold tracking-tight text-white/60 mb-2 italic">Maharaja Surajmal Institute</div>
  <p className="text-white/40 max-w-2xl leading-relaxed font-light text-xs">...</p>  {/* text-sm → text-xs */}
  ...
  <div className="text-3xl font-black tracking-tighter">9.3 / 10</div>
  <div className="text-[10px] font-black tracking-widest uppercase mt-1 text-white/40">GPA / TOP 1%</div>
  ...
  // GPA pill: p-6 rounded-2xl  (was p-10 rounded-3xl)
Also on the ghost text: text-[100px] md:text-[180px] → text-[70px] md:text-[110px]

And the flex gap: gap-10 → gap-6, mb-10 → mb-6

2. Fix animation trigger threshold — replace all VP and VP_CARDS constants
tsx
// ── BEFORE ──
const VP       = { once: true, amount: 0.45 } as const;
const VP_CARDS = { once: true, amount: 0.15 } as const;

// ── AFTER ──
const VP       = { once: true, amount: 0.2
Claude's response was interrupted.
1780763792969_image.png
These added elements looks good but you caan add the ements that we had in first iteration like those grids, lines, shapes aand tools like attached in image but dont do too much. pluis the ements should also move slghtly by page scrool.

10:06 PM
I can see the image — those subtle grid lines, diamond/square shapes with connecting lines. You want to keep those original background elements (grid, rotating diamonds, squares, connecting lines, right-side bars) but also make them drift slightly on scroll + react to mouse. Plus add the technical layer (binary, terminal, circuit) but keep it restrained.

Here are the exact changes to your Background component and the new ParallaxBackground setup:

Replace your entire Background component + add parallax layer:
tsx
// ─── Mouse + Scroll Parallax Background ──────────────────────────────────────
const ParallaxBackground = memo(function ParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  // Three spring layers at different depths
  const slow = {
    x: useSpring(mouseX, { stiffness: 25, damping: 30, mass: 1.2 }),
    y: useSpring(mouseY, { stiffness: 25, damping: 30, mass: 1.2 }),
  };
  const mid = {
    x: useSpring(mouseX, { stiffness: 45, damping: 32, mass: 0.9 }),
    y: useSpring(mouseY, { stiffness: 45, damping: 32, mass: 0.9 }),
  };
  const fast = {
    x: useSpring(mouseX, { stiffness: 70, damping: 28, mass: 0.7 }),
    y: useSpring(mouseY, { stiffness: 70, damping: 28, mass: 0.7 }),
  };

  // Scroll drift — transforms mapped from raw scrollY
  const scrollDriftSlow = useTransform(scrollY, [0, 3000], [0, -60]);
  const scrollDriftMid  = useTransform(scrollY, [0, 3000], [0, -120]);
  const scrollDriftFast = useTransform(scrollY, [0, 3000], [0,  80]);

  useEffect(() => {
    let rafId: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set((e.clientX / window.innerWidth  - 0.5) * 50);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 50);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => scrollY.set(window.scrollY));
    };
    window.addEventListener("mousemove", onMove,   { passive: true });
    window.addEventListener("scroll",   onScroll,  { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",   onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, scrollY]);

  const F = "absolute pointer-events-none will-change-transform";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* ── Static perspective grid (unchanged from original) */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "100px 100px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>

      {/* ── RIGHT SIDE BARS (original, static) */}
      <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden opacity-[0.04] flex flex-col items-center py-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 h-32 bg-neon mt-4 rounded-full" />
        ))}
      </div>

      {/* ── SIDE LINES (original, static) */}
      <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      {/* ── GLOW BLOBS (original, static) */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-neon/10 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] opacity-10" />

      {/* ── NOISE TEXTURE (original, static) */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='
Claude's response was interrupted.
COuld you give full code

10:07 PM

Viewed a file, ran a command, created a file
Viewed a file, ran a command, created a file

Check skills

Create working directory

Script

Full portfolio code with all changes
typescript

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, ReactNode, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { Download, Mail, Smartphone, Linkedin, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Viewport thresholds ──────────────────────────────────────────────────────
// amount:0.2 → fires when 20% of element is visible — prevents early triggers
const VP       = { once: true, amount: 0.2  } as const;
const VP_CARDS = { once: true, amount: 0.12 } as const;

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = memo(function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    const steps = [
      { target: 28,  delay: 0,    dur: 380 },
      { target: 62,  delay: 380,  dur: 480 },
      { target: 87,  delay: 860,  dur: 360 },
      { target: 100, delay: 1220, dur: 280 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ target, delay, dur }) => {
      timers.push(
        setTimeout(() => {
          const start = Date.now();
          const from  = target - (steps.find(s => s.target === target)?.target ?? 0);
          const tick  = () => {
            const t    = Math.min((Date.now() - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            setProgress(Math.round(target - (target - (steps[steps.findIndex(s=>s.target===target)-1]?.target ?? 0)) * (1 - ease)));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay)
      );
    });
    timers.push(setTimeout(() => setPhase("done"),    1620));
    timers.push(setTimeout(() => onComplete(),        2200));
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          exit={{ opacity: 0, filter: "blur(14px)", scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Grid bg */}
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

          {/* Glow */}
          <div className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-[#D9FF00]/10 rounded-full blur-[130px] opacity-25 pointer-events-none" />

          {/* Corner marks */}
          {[
            "top-6 left-6 border-t border-l",
            "top-6 right-6 border-t border-r",
            "bottom-6 left-6 border-b border-l",
            "bottom-6 right-6 border-b border-r",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-7 h-7 border-white/15 ${cls}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            />
          ))}

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center mb-10"
          >
            <div
              className="text-[72px] md:text-[108px] font-black leading-none tracking-tighter select-none"
              style={{ animation: "loaderFlicker 3.2s ease-in-out infinite" }}
            >
              kartik<span className="text-[#D9FF00]">_</span>
            </div>
            <div className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase mt-3">
              Knowledge Management · Power Platform · GenAI
            </div>
          </motion.div>

          {/* Progress */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            <div className="w-[200px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D9FF00] rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.12s linear",
                  boxShadow: "0 0 10px #D9FF00, 0 0 22px rgba(217,255,0,0.35)",
                }}
              />
            </div>
            <div className="flex items-center justify-between w-[200px]">
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">Loading</span>
              <span className="text-[9px] font-black text-[#D9FF00] tabular-nums">{progress}%</span>
            </div>
          </motion.div>

          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF00]/15 to-transparent pointer-events-none"
            style={{ animation: "scanline 2.8s linear infinite" }}
          />

          <style>{`
            @keyframes loaderFlicker {
              0%,100%  { opacity:1; }
              44%      { opacity:1; }
              45%      { opacity:.35; }
              46%      { opacity:1; }
              90%      { opacity:1; }
              90.5%    { opacity:.55; }
              91%      { opacity:1; }
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
  const ringX = useSpring(useMotionValue(-200), { stiffness: 130, damping: 20, mass: 0.5 });
  const ringY = useSpring(useMotionValue(-200), { stiffness: 130, damping: 20, mass: 0.5 });
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      setHovered(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    };
    const down = () => setClicking(true);
    const up   = () => setClicking(false);
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
        animate={{ width: clicking ? 5 : hovered ? 14 : 7, height: clicking ? 5 : hovered ? 14 : 7 }}
        transition={{ duration: 0.18 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          borderColor: hovered ? "rgba(217,255,0,0.85)" : "rgba(217,255,0,0.4)",
          transition: "border-color 0.2s",
        }}
        animate={{ width: clicking ? 22 : hovered ? 50 : 32, height: clicking ? 22 : hovered ? 50 : 32 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
});

// ─── Parallax + Mouse Background ─────────────────────────────────────────────
const ParallaxBackground = memo(function ParallaxBackground() {
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const scrollY = useMotionValue(0);

  // Three depth layers
  const slowX = useSpring(mouseX, { stiffness: 22, damping: 28, mass: 1.3 });
  const slowY = useSpring(mouseY, { stiffness: 22, damping: 28, mass: 1.3 });
  const midX  = useSpring(mouseX, { stiffness: 42, damping: 30, mass: 1.0 });
  const midY  = useSpring(mouseY, { stiffness: 42, damping: 30, mass: 1.0 });
  const fastX = useSpring(mouseX, { stiffness: 68, damping: 26, mass: 0.7 });
  const fastY = useSpring(mouseY, { stiffness: 68, damping: 26, mass: 0.7 });

  // Scroll parallax offsets per depth
  const scrollSlow = useTransform(scrollY, [0, 4000], [0,  -90]);
  const scrollMid  = useTransform(scrollY, [0, 4000], [0, -160]);
  const scrollFast = useTransform(scrollY, [0, 4000], [0,   60]);

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseX.set((e.clientX / window.innerWidth  - 0.5) * 55);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 55);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => scrollY.set(window.scrollY));
    };
    window.addEventListener("mousemove", onMove,   { passive: true });
    window.addEventListener("scroll",   onScroll,  { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll",   onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mouseX, mouseY, scrollY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* ── Static perspective grid */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "100px 100px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>

      {/* ── Right side bars (static) */}
      <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden opacity-[0.04] flex flex-col items-center py-20">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 h-32 bg-[#D9FF00] mt-4 rounded-full" />
        ))}
      </div>

      {/* ── Thin side lines (static) */}
      <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      {/* ── Glow blobs (static) */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-[#D9FF00]/10 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] opacity-10" />

      {/* ── Noise texture (static) */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ════════════════════════════════════════
          PARALLAX LAYER — SLOW (deep background)
      ════════════════════════════════════════ */}

      {/* Large diamond — top-left area */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: slowX, y: slowY, top: "14%", left: "7%", translateY: scrollSlow }}
      >
        <div
          className="w-20 h-20 border border-[#D9FF00]/10 rounded-sm"
          style={{ transform: "rotate(45deg)" }}
        />
        {/* Connector line going right */}
        <div className="absolute top-1/2 left-full w-28 h-px bg-gradient-to-r from-[#D9FF00]/10 to-transparent" />
      </motion.div>

      {/* Medium diamond — right side */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: slowX, y: slowY, top: "38%", right: "12%", translateY: scrollSlow }}
      >
        <div
          className="w-12 h-12 border border-[#D9FF00]/[0.07] rounded-sm"
          style={{ transform: "rotate(45deg)" }}
        />
      </motion.div>

      {/* Binary text — far left */}
      <motion.div
        className="absolute will-change-transform font-mono text-[8px] font-bold leading-[1.9] tracking-wider text-[#D9FF00]/[0.055]"
        style={{ x: slowX, y: slowY, left: "2%", top: "22%", translateY: scrollSlow }}
      >
        01101011<br />00110010<br />11010011<br />01001101<br />10110100<br />00101101
      </motion.div>

      {/* ════════════════════════════════════════
          PARALLAX LAYER — MID
      ════════════════════════════════════════ */}

      {/* Square with corner notch — left-center */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: midX, y: midY, top: "48%", left: "6%", translateY: scrollMid }}
      >
        <div className="w-16 h-16 border border-white/[0.06] rounded-sm" />
        {/* top-right connector */}
        <div className="absolute -top-px left-full w-20 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
      </motion.div>

      {/* Circuit trace — center area */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: midX, y: midY, top: "28%", left: "32%", translateY: scrollMid }}
      >
        <svg width="180" height="70" viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 35 H45 L60 18 H115 L130 35 H180" stroke="#D9FF00" strokeWidth="0.8" opacity="0.07"/>
          <circle cx="45"  cy="35" r="2.5" fill="#D9FF00" opacity="0.1"/>
          <circle cx="130" cy="35" r="2.5" fill="#D9FF00" opacity="0.1"/>
          <path d="M60 18 V6"  stroke="#D9FF00" strokeWidth="0.8" opacity="0.06"/>
          <path d="M115 18 V6" stroke="#D9FF00" strokeWidth="0.8" opacity="0.06"/>
          <rect x="55"  y="0" width="8" height="6" rx="1" fill="#D9FF00" opacity="0.04"/>
          <rect x="110" y="0" width="8" height="6" rx="1" fill="#D9FF00" opacity="0.04"/>
        </svg>
      </motion.div>

      {/* Terminal lines — right-center */}
      <motion.div
        className="absolute will-change-transform font-mono text-[8px] leading-[2.1] text-right"
        style={{ x: midX, y: midY, right: "4%", top: "52%", translateY: scrollMid }}
      >
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> automate --run</div>
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> deploy --prod</div>
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> flow.trigger()</div>
        <div className="text-[#34D399]/[0.08]">✓ 2,000h saved</div>
      </motion.div>

      {/* Small square — bottom-left */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: midX, y: midY, bottom: "20%", left: "22%", translateY: scrollMid }}
      >
        <div className="w-10 h-10 border border-[#D9FF00]/[0.08] rounded-sm" />
        <div className="absolute top-1/2 -left-16 w-16 h-px bg-gradient-to-l from-[#D9FF00]/[0.08] to-transparent" />
      </motion.div>

      {/* ════════════════════════════════════════
          PARALLAX LAYER — FAST (foreground)
      ════════════════════════════════════════ */}

      {/* Bracket pair — upper right */}
      <motion.div
        className="absolute will-change-transform font-mono font-black text-[22px] text-[#D9FF00]/[0.05]"
        style={{ x: fastX, y: fastY, top: "10%", right: "22%", translateY: scrollFast }}
      >
        {"{ }"}
      </motion.div>

      {/* Coordinate tag — mid right */}
      <motion.div
        className="absolute will-change-transform font-mono text-[8px] font-bold tracking-wider"
        style={{ x: fastX, y: fastY, top: "62%", right: "18%", translateY: scrollFast }}
      >
        <span className="text-[#D9FF00]/[0.07]">[28.6, 77.2]</span><br/>
        <span className="text-white/[0.03]">KGS_NODE_07</span>
      </motion.div>

      {/* Mini circuit — bottom area */}
      <motion.div
        className="absolute will-change-transform"
        style={{ x: fastX, y: fastY, bottom: "12%", right: "28%", translateY: scrollFast }}
      >
        <svg width="90" height="50" viewBox="0 0 90 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="80" height="40" rx="3" stroke="#D9FF00" strokeWidth="0.7" opacity="0.06"/>
          <path d="M5 16 H85" stroke="#D9FF00" strokeWidth="0.7" opacity="0.05"/>
          <circle cx="14" cy="10.5" r="2" fill="#D9FF00" opacity="0.08"/>
          <circle cx="22" cy="10.5" r="2" fill="#D9FF00" opacity="0.08"/>
          <circle cx="30" cy="10.5" r="2" fill="#D9FF00" opacity="0.05"/>
        </svg>
      </motion.div>

      {/* Horizontal scan accent line (fast) */}
      <motion.div
        className="absolute will-change-transform left-0 right-0 h-px"
        style={{
          x: 0,
          y: fastY,
          top: "70%",
          translateY: scrollFast,
          background: "linear-gradient(to right,transparent,rgba(217,255,0,0.03),transparent)",
        }}
      />
    </div>
  );
});

// ─── Shared glass card ────────────────────────────────────────────────────────
const GlassCard = memo(function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.03] backdrop-blur-sm",
        "transition-all duration-500",
        "hover:border-[#D9FF00]/35 hover:bg-white/[0.05]",
        "hover:shadow-[0_0_36px_0_rgba(217,255,0,0.07)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
});

// ─── Animated stagger headline ────────────────────────────────────────────────
const StaggerHeadline = memo(function StaggerHeadline({
  lines,
  className = "",
  dimFrom = 1,
  greenWords = [],
}: {
  lines: readonly string[];
  className?: string;
  dimFrom?: number;
  greenWords?: string[];
}) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      className={["font-black tracking-tighter", className].join(" ")}
    >
      {lines.map((line, idx) => (
        <motion.span
          key={line}
          variants={{
            hidden:  { opacity: 0, y: 60, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0,  filter: "blur(0px)"  },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`block${idx >= dimFrom ? " text-white/20 italic" : ""}`}
        >
          {greenWords.includes(line) ? (
            <span className="text-[#D9FF00]">{line}</span>
          ) : (
            line
          )}
        </motion.span>
      ))}
    </motion.h2>
  );
});

// ─── Static data ──────────────────────────────────────────────────────────────
const stats = [
  { label: "YEARS",          value: "3+"     },
  { label: "HRS SAVED",      value: "2,000+" },
  { label: "ASSETS MANAGED", value: "30k+"   },
  { label: "RFP / RFI",      value: "100+"   },
  { label: "AWARDS",         value: "5×"     },
];

const chartData = [
  { name: "Harvesting App",      hours: 1200, color: "#D9FF00" },
  { name: "Assets Library Mgmt", hours: 200,  color: "#34D399" },
  { name: "Legacy Excel to SPO", hours: 500,  color: "#A855F7" },
  { name: "Pillar Metrices",     hours: 185,  color: "#F43F5E" },
  { name: "AI Agents",           hours: 100,  color: "#F59E0B" },
];

const impactMetrics = [
  { label: "Hours",    value: "2,000+",  sub: "Saved Annually",          color: "border-yellow-500/20"  },
  { label: "Assets",   value: "30,000+", sub: "Managed in Repository",   color: "border-emerald-500/20" },
  { label: "RFP/RFIs", value: "100+",    sub: "Across 13 Sectors",       color: "border-rose-500/20"    },
  { label: "Pages",    value: "50+",     sub: "Built to KPMG Standards", color: "border-purple-500/20"  },
];

const projects = [
  {
    org: "KPMG",
    title: "Power Platform Automated Harvesting",
    desc: "Built Power Apps + Power Automate solution for harvesting knowledge assets — saving 1,500 hrs. annually.",
    tags: ["POWER APPS", "POWER AUTOMATE", "POWER BI"],
    impact: "1,200 hrs saved / year",
  },
  {
    org: "KPMG",
    title: "SPO List Migration & Modernisation",
    desc: "Migrated legacy Excel data to SharePoint Online with Power Automate flows for real-time notifications.",
    tags: ["SHAREPOINT ONLINE", "POWER APPS", "POWER AUTOMATE"],
    impact: "500 hrs saved",
  },
  {
    org: "KPMG",
    title: "Global Sector Contact Repository",
    desc: "Comprehensive repository for sector contacts spanning globe-wide KPMG members with curated sector pages.",
    tags: ["SHAREPOINT", "KNOWLEDGE MGMT", "METADATA MGMT"],
    impact: "5,000+ members",
  },
  {
    org: "KPMG",
    title: "Engagement Metrics Dashboard",
    desc: "Centralised repository for engagement metrics across all assets, visualised in Power BI for leadership reporting.",
    tags: ["POWER BI", "EXCEL", "DATA ANALYTICS"],
    impact: "30K+ assets tracked",
  },
  {
    org: "GLOBALLOGIC",
    title: "GenAI Training Dataset — Google",
    desc: "Piloted and delivered test + main dataset for GenAI training, enabling content search on Android screens.",
    tags: ["GENAI", "QA", "PROCESS DESIGN"],
    impact: "74% → 95% quality",
  },
  {
    org: "GLOBALLOGIC",
    title: "Multi-Level Doc Retrieval AI",
    desc: "Piloted an extraction system pulling relevant answers from multi-level documents — won against major MNCs.",
    tags: ["AI PIPELINES", "PILOT MGMT"],
    impact: "1 of 3 pilots secured",
  },
];

const toolkitGroups = [
  { category: "Power Platform", items: ["Power Apps", "Power Automate", "Power BI"] },
  { category: "Microsoft 365",  items: ["SharePoint Online", "Excel", "PowerPoint"] },
  { category: "AI & GenAI",     items: ["Copilot", "AI Agents", "GenAI Workflows"]  },
  { category: "Knowledge Mgmt.", items: ["RFP / RFI", "Taxonomy / Metadata Mgmt.", "SQL"] },
];

const skills = [
  "Power Apps", "Power Automate", "Power BI", "SharePoint",
  "SQL", "Copilot", "Gen AI", "AI Agents", "GenAI Workflows", "RFP / RFI",
];

const experiences = [
  {
    date: "MAY 2024 — PRESENT",
    org: "KPMG",
    role: "Analyst — Knowledge Management",
    loc: "2 YEARS · GURUGRAM, HARYANA",
    desc: "Leading cross-functional projects across 13 sectors with 360° stakeholder management, business development, and Power Platform automation.",
    bullets: [
      "Power Platform automation & SharePoint Online ecosystem",
      "360° stakeholder management across 13 sectors",
      "Saved 2,000+ hours annually · 5 awards earned",
    ],
  },
  {
    date: "SEP 2022 — OCT 2023",
    org: "GlobalLogic Technologies",
    role: "Associate Analyst — Content Engineering",
    loc: "1 YEAR 2 MONTHS · GURUGRAM, HARYANA",
    desc: "Delivered content engineering and AI training datasets for Google & Microsoft, leading pilot projects against major MNC competition.",
    bullets: [
      "GenAI training data for Google & Microsoft",
      "QA error rate reduced by 25%",
      "Led 3 pilot projects — all secured",
    ],
  },
];

const awards = [
  {
    num: "01",
    title: "Kudos award × 2",
    org: "KPMG",
    desc: "Exceptional efficiency via Lean Six Sigma — saved 2,000+ hours annually. Also awarded for migrating legacy VBA / Excel to GenAI agents & Power Platform.",
  },
  {
    num: "02",
    title: "Super team award",
    org: "KPMG",
    desc: "Hosting and organising employee council events for the wider KGS group, fostering community and collaboration.",
  },
  {
    num: "03",
    title: "Ally of inclusion",
    org: "KPMG",
    desc: "Commitment to cultivating an inclusive and diverse work environment across KPMG Global Services.",
  },
  {
    num: "04",
    title: "Gurus@work",
    org: "KPMG",
    desc: "Contributions to KGS learning culture — empowering and inspiring learners across the organisation.",
  },
];

const contactItems = [
  { icon: <Mail size={24} />,       label: "EMAIL",    val: "kb270102@gmail.com", href: "mailto:kb270102@gmail.com" },
  { icon: <Smartphone size={24} />, label: "PHONE",    val: "+91-7428062532",      href: "tel:+917428062532" },
  { icon: <Linkedin size={24} />,   label: "LINKEDIN", val: "/kartik-bhatt",       href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

const keyNumbers = [
  "Managed 5,000+ KPMG members contact system",
  "QA'd 100+ content pieces weekly",
  "Uploaded 5,000+ content assets",
  "Improved project quality from 74% → 95%",
  "Delivered project 2 weeks ahead of schedule",
];

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="text-[#D9FF00] font-black text-sm">{num}</span>
      <div className="w-14 h-px bg-[#D9FF00]" />
      <span className="text-[11px] font-black tracking-[0.4em] text-[#D9FF00] uppercase">{label}</span>
    </div>
  );
}

// ─── Skills carousel ──────────────────────────────────────────────────────────
const SkillsCarousel = memo(function SkillsCarousel() {
  const repeatedSkills = useMemo(() => [...skills, ...skills, ...skills, ...skills], []);
  return (
    <div className="w-full border-y border-white/5 overflow-hidden">
      <div
        style={{ display: "flex", width: "max-content", animation: "marquee 30s linear infinite" }}
        className="py-7"
      >
        {repeatedSkills.map((skill, i) => (
          <div key={i} className="flex items-center gap-5 shrink-0 px-3">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-white/10 hover:text-[#D9FF00] transition-colors duration-300 whitespace-nowrap">
              {skill.toUpperCase()}
            </span>
            <div className="w-2.5 h-2.5 bg-[#D9FF00] rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { scrollYProgress } = useScroll();
  const yDrift        = useTransform(scrollYProgress, [0, 1], [0,  400]);
  const yDriftReverse = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const [loaded,   setLoaded]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#D9FF00] selection:text-black">
      <style>{`
        /* Hide default cursor on desktop */
        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes dotblink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.15; }
        }
        section[id] { scroll-margin-top: 100px; }
      `}</style>

      {/* Custom cursor — only on non-touch devices */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* Loading screen */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Main content fades in after load */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Parallax + mouse-reactive background */}
        <ParallaxBackground />

        {/* ── NAV ───────────────────────────────────────────────────── */}
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[92%] max-w-7xl z-[999]"
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <nav
            className="backdrop-blur-[24px] border rounded-2xl px-6 md:px-10 h-16 flex items-center justify-between"
            style={{
              background:   scrolled ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0)",
              borderColor:  scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)",
              boxShadow:    scrolled
                ? "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(217,255,0,0.04), inset 0 1px 0 rgba(217,255,0,0.06)"
                : "none",
              transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-[#D9FF00] rounded-full"
                style={{ animation: "dotblink 2.4s ease-in-out infinite" }}
              />
              <span className="font-bold tracking-tighter text-sm uppercase">kartik.bhatt</span>
            </div>
            <div className="hidden md:flex gap-5 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
              {["about", "experience", "education", "toolkit", "work", "honors", "contact"].map(link => (
                <a key={link} href={`#${link}`} className="hover:text-[#D9FF00] transition-colors">
                  {link === "work" ? "Projects" : link.charAt(0).toUpperCase() + link.slice(1)}
                </a>
              ))}
            </div>
            <a href="/Resume.pdf" download="Kartik_Bhatt_Resume.pdf" target="_blank" rel="noreferrer">
              <button className="bg-[#D9FF00] text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
                Resume <Download size={12} />
              </button>
            </a>
          </nav>
        </motion.div>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="min-h-screen pt-36 pb-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VP}
              className="flex items-center gap-4 mb-10"
            >
              <div className="w-12 h-px bg-[#D9FF00]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Portfolio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="text-[80px] md:text-[150px] font-black leading-[0.75] tracking-tighter"
            >
              kartik<br />
              <span className="text-white/20">bhatt</span>
              <span className="text-[#D9FF00]">_</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VP}
              transition={{ delay: 0.3 }}
              className="mt-10 text-lg md:text-xl text-white/60 font-light max-w-lg leading-relaxed"
            >
              Knowledge Management &amp; Business Analyst.<br />
              <span className="text-white/30 text-sm font-mono tracking-widest uppercase mt-3 block">
                power platform · genai · sharepoint
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center gap-4"
            >
              <div className="w-8 h-px bg-[#D9FF00]/60" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#D9FF00]/70 uppercase">
                Three years. Two global firms. One mission.
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={VP}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="relative w-full max-w-[480px] h-[440px] shrink-0"
          >
            <div className="absolute inset-0 border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.03] backdrop-blur-sm shadow-[0_0_60px_0_rgba(217,255,0,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
              <img
                src="/profile.jpg"
                alt="Kartik Bhatt"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-8 left-8 z-20">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">ANALYST · KPMG</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────── */}
        <section className="border-y border-white/5 bg-white/[0.015] backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VP}
                transition={{ delay: i * 0.08 }}
                className="p-10 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors cursor-default"
              >
                <div className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</div>
                <div className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────── */}
        <section id="about" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="01" label="About Me" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
              <div>
                <StaggerHeadline
                  lines={["i turn legacy", "chaos into measurable,", "automated impact."]}
                  className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
                  dimFrom={1}
                  greenWords={["automated impact."]}
                />
                <p className="text-white/60 text-base leading-relaxed font-light">
                  Results-driven analyst with 3+ years across{" "}
                  <span className="text-white font-medium">Knowledge Management</span> &amp;{" "}
                  <span className="text-white font-medium">Content Engineering</span> at top global firms.
                  Specialises in Power Platform automation, SharePoint Online, and data-driven operational
                  improvements. Saved 2,000+ hours annually through lean process optimisation and
                  GenAI-powered workflows — across 13 sectors and global teams.
                </p>
              </div>
              <div>
                <GlassCard className="p-9">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-[#D9FF00] uppercase mb-7">/ At a Glance</div>
                  <div className="space-y-0">
                    {[
                      { l: "NAME",   v: "Kartik Bhatt"          },
                      { l: "ROLE",   v: "Analyst · KPMG"         },
                      { l: "BASED",  v: "Delhi, India"            },
                      { l: "DEGREE", v: "BCA · Computer Science" },
                      { l: "GPA",    v: "9.3 / 10 · top 1%"     },
                    ].map(item => (
                      <div key={item.l} className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[9px] font-bold text-white/30 tracking-[0.2em]">{item.l}</span>
                        <span className="text-sm font-medium">{item.v}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ────────────────────────────────────────────── */}
        <section id="experience" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="02" label="Experience" />
            <div className="space-y-8">
              {experiences.map((exp) => (
                <motion.div
                  key={exp.org}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                >
                  <GlassCard className="flex flex-col lg:flex-row gap-10 lg:gap-20 p-8">
                    <div className="w-44 text-[10px] font-bold text-white/30 tracking-widest pt-1 shrink-0">{exp.date}</div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-3xl font-black tracking-tight mb-2">{exp.org}</h3>
                        <div className="text-[#D9FF00] text-sm font-medium mb-2">{exp.role}</div>
                        <div className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">{exp.loc}</div>
                      </div>
                      <div>
                        <p className="text-white/50 mb-5 font-light text-sm leading-relaxed">{exp.desc}</p>
                        <ul className="space-y-3">
                          {exp.bullets.map(b => (
                            <li key={b} className="flex gap-3 text-sm font-medium items-start">
                              <span className="text-[#D9FF00] shrink-0 mt-px">+</span>
                              <span className="text-white/80">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EDUCATION ─────────────────────────────────────────────── */}
        <section id="education" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="03" label="Education" />
            <motion.div
              initial={{ opacity: 0, x: -36, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={VP}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard className="p-6 md:p-8 relative overflow-hidden">
                {/* Ghost text — smaller so it doesn't add height */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none select-none">
                  <div className="text-[80px] md:text-[120px] font-black italic leading-none">BCA</div>
                </div>
                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 uppercase">
                        Bachelor of Computer Applications
                      </h3>
                      <div className="text-[#D9FF00] text-base font-bold italic tracking-tight">
                        Majors: Computer Science
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
                      <div className="text-sm font-medium">JUL 2019 — AUG 2022</div>
                    </div>
                  </div>
                  {/* Bottom row */}
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                      <div className="text-lg font-bold tracking-tight text-white/60 mb-2 italic">
                        Maharaja Surajmal Institute
                      </div>
                      <p className="text-white/40 max-w-2xl leading-relaxed font-light text-xs">
                        Strong academic foundation in Computer Science. Analytical mindset sharpened from Top 1%
                        performance. Technical depth in systems, databases, and software that drives real-world impact at enterprise scale.
                      </p>
                    </div>
                    <div className="border border-[#D9FF00]/30 bg-[#D9FF00]/[0.06] backdrop-blur-sm px-8 py-5 rounded-2xl flex flex-col items-center justify-center text-[#D9FF00] shrink-0 shadow-[0_0_30px_0_rgba(217,255,0,0.08)]">
                      <div className="text-3xl font-black tracking-tighter">9.3 / 10</div>
                      <div className="text-[10px] font-black tracking-widest uppercase mt-1 text-white/40">GPA / TOP 1%</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ── TOOLKIT & EXPERTISE ───────────────────────────────────── */}
        <section id="toolkit" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="-mx-6 md:-mx-12"><SkillsCarousel /></div>

          <div className="max-w-7xl mx-auto mt-14">
            <SectionLabel num="04" label="Toolkit & Expertise" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {toolkitGroups.map((group, i) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-5 group hover:-translate-y-1">
                    <div className="text-base font-black tracking-tight text-white mb-4 group-hover:text-[#D9FF00] transition-colors duration-300">
                      {group.category}
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]/50 group-hover:bg-[#D9FF00] shrink-0 transition-colors duration-300" />
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

        {/* ── PROJECTS & IMPACT ─────────────────────────────────────── */}
        <section id="work" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="05" label="Projects & Impact" />

            <StaggerHeadline
              lines={["projects that moved", "needles, not just", "decks."]}
              className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
              dimFrom={1}
              greenWords={["decks."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {projects.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP_CARDS}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.07 }}
                >
                  <GlassCard className="group p-8 flex flex-col h-full gap-6 hover:-translate-y-1">
                    {/* Grey org label — matches awards style */}
                    <span className="text-[10px] font-black text-white/25 tracking-[0.3em] uppercase">{p.org}</span>
                    <div>
                      <h3 className="text-xl font-black leading-tight mb-3 tracking-tight group-hover:text-[#D9FF00] transition-colors">{p.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black tracking-widest uppercase border border-white/5 group-hover:text-[#D9FF00] group-hover:border-[#D9FF00]/30 transition-all">{t}</span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
                      <span className="text-[8px] font-bold text-white/30 tracking-[0.3em] uppercase">Impact</span>
                      <span className="text-xs font-bold text-[#D9FF00]">{p.impact}</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {impactMetrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP}
                  transition={{ delay: i * 0.08 }}
                >
                  <GlassCard className={`p-7 border ${m.color} flex flex-col items-center text-center h-full`}>
                    <div className="text-3xl font-black mb-1 tracking-tighter">{m.value}</div>
                    <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[#D9FF00] mb-1">{m.label}</div>
                    <div className="text-[9px] font-medium text-white/30 tracking-wider uppercase">{m.sub}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
                className="lg:col-span-2"
              >
                <GlassCard className="p-10 h-full">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-2">/ Analytics</div>
                      <h3 className="text-2xl font-black tracking-tight">
                        the receipts.<br />
                        <span className="text-[#D9FF00] italic">hours saved, by initiative.</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#D9FF00]">2,185_hrs</div>
                      <div className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Total Saved</div>
                    </div>
                  </div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#ffffff40", fontSize: 9, fontWeight: 700 }}
                          width={130}
                        />
                        <Tooltip
                          cursor={{ fill: "#ffffff05" }}
                          contentStyle={{ background: "#111", border: "1px solid rgba(217,255,0,0.2)", borderRadius: "12px" }}
                          itemStyle={{ color: "#D9FF00", fontWeight: "bold" }}
                          formatter={(v: any) => [`${v} hrs`, "Hours saved"]}
                        />
                        <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={22} isAnimationActive={false}>
                          {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VP}
              >
                <GlassCard className="p-10 flex flex-col gap-6 h-full">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-5">/ Key Numbers</div>
                    <div className="space-y-5">
                      {keyNumbers.map((text, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="w-5 h-5 rounded-full bg-[#D9FF00]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D9FF00] transition-all group-hover:text-black">
                            <CheckCircle2 size={12} />
                          </div>
                          <span className="text-sm font-medium text-white/60 leading-tight group-hover:text-white transition-colors">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto p-5 bg-[#D9FF00] text-black rounded-2xl">
                    <div className="font-black text-xs tracking-widest uppercase mb-1">Impact Driven</div>
                    <p className="text-xs font-bold leading-relaxed opacity-80">
                      "Data-driven decisions combined with automated workflows result in exponential efficiency."
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── HONORS / AWARDS ───────────────────────────────────────── */}
        <section id="honors" className="py-20 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionLabel num="06" label="Honors" />

            <StaggerHeadline
              lines={["five awards.", "discipline collecting", "interest."]}
              className="text-4xl md:text-[54px] leading-[0.85] mb-14"
              dimFrom={1}
              greenWords={["interest."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map((award, i) => (
                <motion.div
                  key={award.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VP_CARDS}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-7 h-full group">
                    <div className="mb-3">
                      <span className="text-[9px] font-bold tracking-[0.25em] text-white/20 uppercase">{award.org}</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-[#D9FF00] transition-colors">{award.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{award.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <section id="contact" className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <StaggerHeadline
              lines={["let's build", "something", "impactful."]}
              className="text-[52px] md:text-[105px] leading-[0.8] mb-10 uppercase"
              dimFrom={1}
              greenWords={["impactful."]}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
              {contactItems.map(item => (
                <a key={item.label} href={item.href} className="group" target="_blank" rel="noopener noreferrer">
                  <GlassCard className="p-10 flex flex-col items-center gap-5">
                    <div className="text-white/40 group-hover:text-[#D9FF00] transition-colors">{item.icon}</div>
                    <div className="text-[9px] font-bold tracking-[0.4em] text-white/40 group-hover:text-[#D9FF00] transition-colors uppercase">{item.label}</div>
                    <div className="text-sm font-medium text-white">{item.val}</div>
                  </GlassCard>
                </a>
              ))}
            </div>

            <footer className="mt-14 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
              <div>© 2026-28 / KARTIK BHATT</div>
              <div>DELHI, INDIA</div>
            </footer>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
