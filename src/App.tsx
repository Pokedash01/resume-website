/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo, ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download, Mail, Smartphone, Linkedin, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
}: {
  lines: readonly string[];
  className?: string;
  dimFrom?: number;
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
          {line}
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
  { label: "RFP/RFIs", value: "100+",    sub: "Across 16 Sectors",      color: "border-rose-500/20"    },
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
    category: "/ POWER PLATFORM",
    items: ["Power Apps", "Power Automate", "Power BI"],
    detail: "End-to-end automation & reporting across enterprise workflows.",
  },
  {
    category: "/ MICROSOFT 365",
    items: ["SharePoint Online", "Excel", "PowerPoint"],
    detail: "Ecosystem-wide collaboration, data management & communication.",
  },
  {
    category: "/ AI & GENAI",
    items: ["Copilot", "AI Agents", "GenAI Workflows"],
    detail: "Designing and deploying intelligent agents & training pipelines.",
  },
  {
    category: "/ KNOWLEDGE MGMT.",
    items: ["RFP / RFI", "Asset Mgmt.", "Process Docs", "SQL"],
    detail: "Structured knowledge systems across 16 sectors and global teams.",
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
    desc: "Leading cross-functional projects across 12 sectors with 360° stakeholder management, business development, and Power Platform automation.",
    bullets: [
      "Power Platform automation & SharePoint Online ecosystem",
      "360° stakeholder management across 16 sectors",
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
    org: "KPMG GLOBAL SERVICES",
    desc: "Exceptional efficiency via Lean Six Sigma — saved 2,000+ hours annually. Also awarded for migrating legacy VBA / Excel to GenAI agents & Power Platform.",
  },
  {
    num: "02",
    title: "Super team award",
    org: "KPMG GLOBAL SERVICES",
    desc: "Hosting and organising employee council events for the wider KGS group, fostering community and collaboration.",
  },
  {
    num: "03",
    title: "Ally of inclusion",
    org: "KPMG GLOBAL SERVICES",
    desc: "Commitment to cultivating an inclusive and diverse work environment across KPMG Global Services.",
  },
  {
    num: "04",
    title: "Gurus@work",
    org: "KPMG GLOBAL SERVICES",
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
  "QA'd 500+ content pieces weekly",
  "Uploaded 5,000+ content assets",
  "Improved project quality from 74% → 95%",
  "Delivered project 2 weeks ahead of schedule",
];

const VP = { once: true } as const;

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

// ─── Animated background ──────────────────────────────────────────────────────
const Background = memo(function Background({ yDrift, yDriftReverse }: { yDrift: any; yDriftReverse: any }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div style={{ y: yDrift, perspective: "1000px" }} className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 origin-top h-[200%] w-full" style={{
          backgroundImage: "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
          backgroundSize: "100px 100px",
          transform: "rotateX(60deg) translateY(-20%)",
        }} />
      </motion.div>
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute opacity-10"
            style={{ y: i % 2 === 0 ? yDrift : yDriftReverse, rotate: i * 45, left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}>
            <div className="w-16 h-16 border border-neon rounded-sm transform rotate-45" />
            <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-neon to-transparent" />
          </motion.div>
        ))}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden opacity-[0.05] flex flex-col items-center py-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-1 h-32 bg-neon mt-4 rounded-full"
            style={{ animation: `datapulse ${2 + (i % 3)}s ease-in-out ${i * 0.1}s infinite` }} />
        ))}
      </div>
      <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <motion.div style={{ y: yDriftReverse }}
        className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-neon/10 rounded-full blur-[120px] mix-blend-screen opacity-20" />
      <motion.div style={{ y: yDrift }}
        className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen opacity-10" />
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { scrollYProgress } = useScroll();
  const yDrift        = useTransform(scrollYProgress, [0, 1], [0,  400]);
  const yDriftReverse = useTransform(scrollYProgress, [0, 1], [0, -400]);

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
      `}</style>

      <Background yDrift={yDrift} yDriftReverse={yDriftReverse} />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[92%] max-w-7xl z-[999]
        backdrop-blur-[24px] bg-black/45 border border-white/10 rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.35)] px-6 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon rounded-full" />
          <span className="font-bold tracking-tighter text-sm uppercase">kartik.bhatt</span>
        </div>
        <div className="hidden md:flex gap-5 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
          {["about", "experience", "education", "toolkit", "work", "honors", "contact"].map(link => (
            <a key={link} href={`#${link}`} className="hover:text-neon transition-colors">{link === "work" ? "Projects" : link.charAt(0).toUpperCase() + link.slice(1)}</a>
          ))}
        </div>
        <a href="/Resume.pdf" download="Kartik_Bhatt_Resume.pdf" target="_blank" rel="noreferrer">
          <button className="bg-neon text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
            Resume <Download size={12} />
          </button>
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
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

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
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

      {/* ── ABOUT ───────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionLabel num="01" label="About Me" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
            <div>
              <StaggerHeadline
                lines={["i turn legacy", "chaos into measurable,", "automated impact."]}
                className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
                dimFrom={1}
              />
              <p className="text-white/60 text-base leading-relaxed font-light">
                Results-driven analyst with 3+ years across{" "}
                <span className="text-white font-medium">Knowledge Management</span> &amp;{" "}
                <span className="text-white font-medium">Content Engineering</span> at top global firms.
                Specialises in Power Platform automation, SharePoint Online, and data-driven operational
                improvements. Saved 2,000+ hours annually through lean process optimisation and
                GenAI-powered workflows — across 16 sectors and global teams.
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

      {/* ── EXPERIENCE ──────────────────────────────────────────────────── */}
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

      {/* ── EDUCATION ───────────────────────────────────────────────────── */}
      <section id="education" className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionLabel num="03" label="Education" />
          <GlassCard className="p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 md:p-14 opacity-[0.03] pointer-events-none select-none">
              <div className="text-[100px] md:text-[180px] font-black italic">BCA</div>
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 uppercase">Bachelor of Computer Applications</h3>
                  <div className="text-neon text-xl font-bold italic tracking-tight">Majors: Computer Science</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
                  <div className="text-lg font-medium">JUL 2019 — AUG 2022</div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold tracking-tight text-white/60 mb-4 italic">Maharaja Surajmal Institute</div>
                  <p className="text-white/40 max-w-2xl leading-relaxed font-light text-sm">
                    Strong academic foundation in Computer Science. Analytical mindset sharpened from Top 1%
                    performance. Technical depth in systems, databases, and software that drives real-world impact at enterprise scale.
                  </p>
                </div>
                <div className="border border-neon/30 bg-neon/[0.06] backdrop-blur-sm p-10 rounded-3xl flex flex-col items-center justify-center text-neon shrink-0 shadow-[0_0_40px_0_rgba(217,255,0,0.1)]">
                  <div className="text-5xl font-black tracking-tighter">9.3 / 10</div>
                  <div className="text-[10px] font-black tracking-widest uppercase mt-2 text-white/40">GPA / TOP 1%</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── TOOLKIT & EXPERTISE ─────────────────────────────────────────── */}
      <section id="toolkit" className="py-20 border-b border-white/5">
        <SkillsCarousel />

        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-14">
          <SectionLabel num="04" label="Toolkit & Expertise" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {toolkitGroups.map((group, i) => (
              <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={VP} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 h-full group flex flex-col hover:-translate-y-1">
                  <div className="text-xl font-black tracking-tight text-white mb-7 group-hover:text-neon transition-colors duration-300">{group.category}</div>
                  <ul className="space-y-4 mb-8">
                    {group.items.map(item => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                        <span className="text-neon font-black text-base leading-none">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <p className="text-[11px] text-white/25 leading-relaxed font-light group-hover:text-white/40 transition-colors">
                      {group.detail}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS & IMPACT ────────────────────────────────────────────── */}
      <section id="work" className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionLabel num="05" label="Projects & Impact" />

          <StaggerHeadline
            lines={["projects that moved", "needles, not just decks."]}
            className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
            dimFrom={1}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={VP} transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.08 }}>
                <GlassCard className="group p-8 flex flex-col h-full gap-6 hover:-translate-y-1">
                  <span className="text-[10px] font-black text-neon tracking-[0.3em] uppercase">{p.org}</span>
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

      {/* ── HONORS / AWARDS ─────────────────────────────────────────────── */}
      <section id="honors" className="py-20 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionLabel num="06" label="Honors" />

          <StaggerHeadline
            lines={["five awards.", "discipline collecting", "interest."]}
            className="text-4xl md:text-[54px] leading-[0.85] mb-14"
            dimFrom={1}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {awards.map((award, i) => (
              <motion.div key={award.num} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={VP} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-10 h-full group">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black text-neon tracking-[0.3em]">/ {award.num}</span>
                    <span className="text-[9px] font-bold tracking-[0.25em] text-white/20 uppercase">{award.org}</span>
                  </div>
                  <h3 className="text-2xl md:text-[28px] font-black tracking-tight mb-4 group-hover:text-neon transition-colors">{award.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{award.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <StaggerHeadline
            lines={["let's build", "something", "impactful."]}
            className="text-[52px] md:text-[105px] leading-[0.8] mb-10 uppercase"
            dimFrom={1}
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
    </div>
  );
}
