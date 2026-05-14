/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Download, Mail, Smartphone, Linkedin, ExternalLink, CheckCircle2, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ReactNode } from "react";

function SpotlightCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-500 hover:border-neon/30 neon-hover ${className}`}
    >
      {children}
    </div>
  );
}

const stats = [
  { label: "YEARS", value: "3+" },
  { label: "HRS SAVED", value: "3,000+" },
  { label: "ASSETS MANAGED", value: "50k+" },
  { label: "RFP / RFI", value: "100+" },
  { label: "AWARDS", value: "5×" },
];

const chartData = [
  { name: 'Harvesting App', hours: 1500, color: '#D9FF00' },
  { name: 'Assets Library Management', hours: 200, color: '#34D399' },
  { name: 'Legacy Excel to SPO Migration', hours: 1100, color: '#A855F7' },
  { name: 'Pillar Metrices', hours: 185, color: '#F43F5E' },
  { name: 'AI Agents', hours: 800, color: '#F59E0B' },
];

const impactMetrics = [
  { label: "Hours", value: "3,000+", sub: "Saved Annually", color: "border-yellow-500/20" },
  { label: "Assets", value: "30,000+", sub: "Managed in Repository", color: "border-emerald-500/20" },
  { label: "RFP/RFIs", value: "100+", sub: "Across 16 Sectors", color: "border-rose-500/20" },
  { label: "Pages", value: "50+", sub: "Built to KPMG Standards", color: "border-purple-500/20" },
];

const projects = [
  {
    org: "KPMG",
    title: "Power Platform Automated Harvesting",
    desc: "Built Power Apps + Power Automate solution for harvesting knowledge assets — saving 1,500 hrs. annually.",
    tags: ["POWER APPS", "POWER AUTOMATE", "POWER BI"],
    impact: "1,500 hrs saved / year"
  },
  {
    org: "KPMG",
    title: "SPO List Migration & Modernisation",
    desc: "Migrated legacy Excel data to SharePoint Online with Power Automate flows for real-time notifications.",
    tags: ["SHAREPOINT ONLINE", "POWER APPS", "POWER AUTOMATE"],
    impact: "1,100 hrs saved"
  },
  {
    org: "KPMG",
    title: "Global Sector Contact Repository",
    desc: "Comprehensive repository for sector contacts spanning globe-wide KPMG members with curated sector pages.",
    tags: ["SHAREPOINT", "KNOWLEDGE MGMT", "METADATA MGMT"],
    impact: "5,000+ members"
  },
  {
    org: "KPMG",
    title: "Engagement Metrics Dashboard",
    desc: "Centralised repository for engagement metrics across all assets, visualised in Power BI for leadership reporting.",
    tags: ["POWER BI", "EXCEL", "DATA ANALYTICS"],
    impact: "30K+ assets tracked"
  },
  {
    org: "GLOBALLOGIC",
    title: "GenAI Training Dataset — Google",
    desc: "Piloted and delivered test + main dataset for GenAI training, enabling content search on Android screens.",
    tags: ["GENAI", "QA", "PROCESS DESIGN"],
    impact: "74% → 95% quality"
  },
  {
    org: "GLOBALLOGIC",
    title: "Multi-Level Doc Retrieval AI",
    desc: "Piloted an extraction system pulling relevant answers from multi-level documents for AI training datasets — won against major MNCs.",
    tags: ["AI PIPELINES", "PILOT MGMT"],
    impact: "1 of 3 pilots secured"
  }
];

const skills = [
  "Power Apps", "Power Automate", "Power BI", "SharePoint",
  "SQL", "Copilot", "Gen AI", "AI Agents", "GenAI Workflows", 
  "RFP / RFI"
];

function SkillsCarousel() {
  const repeatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative border-y border-white/5 overflow-hidden bg-white/[0.01]">
      {/* Ribbon */}
      <div className="bg-neon py-3 flex items-center justify-center transform -skew-x-12 -rotate-2 mx-auto w-fit px-16 relative z-10 -mb-6 mt-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-black font-black text-3xl tracking-tighter italic uppercase underline decoration-black/20 underline-offset-4">
          Toolkit & Expertise
        </span>
      </div>

      <div className="relative overflow-hidden py-24">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 z-20 h-full w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />

        {/* Right Fade */}
        <div className="absolute right-0 top-0 z-20 h-full w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

        <div className="marquee">
          <div className="marquee-track">
            {repeatedSkills.map((skill, i) => (
              <div
                key={i}
                className="flex items-center gap-6 shrink-0"
              >
                <span className="text-4xl md:text-6xl font-black tracking-tighter text-white/10 hover:text-neon transition-colors duration-300 whitespace-nowrap">
                  {skill.toUpperCase()}
                </span>

                <div className="w-3 h-3 bg-neon rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const yDrift = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const yDriftReverse = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-neon selection:text-black">
      {/* Scroll-Responsive Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Moving Perspective Grid */}
        <motion.div 
          style={{ 
            y: yDrift,
            perspective: "1000px"
          }}
          className="absolute inset-0 opacity-[0.05]"
        >
          <div 
            className="absolute inset-0 origin-top h-[200%] w-full"
            style={{ 
              backgroundImage: `linear-gradient(to right, #D9FF00 1px, transparent 1px), linear-gradient(to bottom, #D9FF00 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
              transform: 'rotateX(60deg) translateY(-20%)'
            }} 
          />
        </motion.div>

        {/* Floating Geometric "Data Nodes" */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{ 
                y: i % 2 === 0 ? yDrift : yDriftReverse,
                rotate: i * 45,
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`
              }}
              className="absolute opacity-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-16 h-16 border border-neon rounded-sm transform rotate-45" />
              <div className="absolute top-1/2 left-full w-24 h-px bg-gradient-to-r from-neon to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Dynamic Data Stream (Right Side) */}
        <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden opacity-[0.05] flex flex-col items-center py-20 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 2 + i % 3, 
                repeat: Infinity,
                delay: i * 0.1
              }}
              className="w-1 h-32 bg-neon mt-4 rounded-full"
            />
          ))}
        </div>

        {/* Vertical Perspective Lines */}
        <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

        {/* Floating Gradient Orbs */}
        <motion.div 
          style={{ y: yDriftReverse, x: 20 }}
          className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-neon/10 rounded-full blur-[120px] mix-blend-screen opacity-20"
        />
        <motion.div 
          style={{ y: yDrift, x: -20 }}
          className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen opacity-10"
        />
        
        {/* Subtle Static Noise/Grain */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[999] glass nav-blur px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon rounded-full" />
          <span className="font-bold tracking-tighter text-sm uppercase">kartik.bhatt</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
          <a href="#about" className="hover:text-neon transition-colors">About</a>
          <a href="#experience" className="hover:text-neon transition-colors">Experience</a>
          <a href="#education" className="hover:text-neon transition-colors">Education</a>
          <a href="#work" className="hover:text-neon transition-colors">Projects</a>
          <a href="#impact" className="hover:text-neon transition-colors">Impact</a>
          <a href="#contact" className="hover:text-neon transition-colors">Contact</a>
        </div>
        <a 
          href="/Resume.pdf" 
          download="Kartik_Bhatt_Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          <button className="bg-neon text-black px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform">
            Resume <Download size={12} />
          </button>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-20">
        <div className="flex-1 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-px bg-neon" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Portfolio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-[80px] md:text-[159px] font-black leading-[0.75] tracking-tighter italic lg:not-italic"
          >
            kartik<br />
            <span className="text-white/20">bhatt</span>
            <span className="text-neon cursor-blink">_</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-lg md:text-xl text-white/60 font-light max-w-lg leading-relaxed"
          >
            Knowledge Management & Business Analyst.<br />
            <span className="text-white/30 text-sm font-mono tracking-widest uppercase mt-4 block">
              power platform · genai · sharepoint
            </span>
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          className="relative w-full max-w-[500px] h-[450px] shrink-0"
        >
          <div className="absolute inset-0 border border-white/10 rounded-[32px] overflow-hidden glass neon-glow">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
            <img 
              src="/profile.jpg" 
              alt="Kartik Bhatt"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            {/* Design elements from PDF */}
            <div className="absolute bottom-8 left-8 z-20">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">ANALYST · KPMG</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 glass">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-12 flex flex-col gap-2 hover:bg-white/[0.02] transition-colors cursor-default"
            >
              <div className="text-4xl md:text-5xl font-black tracking-tighter">{stat.value}</div>
              <div className="text-[9px] font-bold tracking-[0.4em] text-white/30 uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/5 min-h-[700px] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <span className="text-neon font-black text-sm">01</span>
            <div className="w-16 h-px bg-neon" />
            <span className="text-xs md:text-sm font-black tracking-[0.4em] text-neon uppercase">About Me</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {/* Left: Narrative */}
            <div>
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="text-4xl md:text-[60px] font-black tracking-tighter leading-[0.9] mb-12 uppercase w-full max-w-[650px]"
              >
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  i turn legacy
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/20 italic block"
                >
                  chaos into measurable,
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  automated impact.
                </motion.span>
              </motion.h2>
              <div className="space-y-8">
                <p className="text-white/60 text-[17px] leading-relaxed font-light italic md:not-italic">
                  Results-driven analyst with 3+ years across <span className="text-white font-medium">Knowledge Management</span> & <span className="text-white font-medium">Content Engineering</span> at top global firms. Specialises in Power Platform automation, SharePoint Online, and data-driven operational improvements. Saved 2,000+ hours annually through lean process optimisation and GenAI-powered workflows — across 16 sectors and global teams.
                </p>
              </div>
            </div>

            {/* Right: Info Cards */}
            <div className="flex flex-col gap-8">
              {/* At a Glance */}
              <SpotlightCard className="glass p-10 rounded-[40px] border border-white/10">
                <div className="text-[10px] font-bold tracking-[0.3em] text-neon uppercase mb-10">/ At a Glance</div>
                <div className="space-y-4">
                  {[
                    { l: "NAME", v: "Kartik Bhatt" },
                    { l: "ROLE", v: "Analyst · KPMG" },
                    { l: "BASED", v: "Delhi, India" },
                    { l: "DEGREE", v: "BCA · Computer Science" },
                    { l: "GPA", v: "9.3 / 10 · top 1%" },
                  ].map(item => (
                    <div key={item.l} className="flex justify-between items-center py-3 border-b border-white/5">
                      <span className="text-[9px] font-bold text-white/30 tracking-[0.2em]">{item.l}</span>
                      <span className="text-sm font-medium">{item.v}</span>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <span className="text-neon font-black text-sm">02</span>
            <div className="w-16 h-px bg-neon" />
            <span className="text-xs md:text-sm font-black tracking-[0.4em] text-neon uppercase">Experience</span>
          </div>

          <div className="space-y-32">
            {[
              {
                date: "MAY 2024 — PRESENT",
                org: "KPMG",
                role: "Analyst — Knowledge Management",
                loc: "2 YEARS · GURUGRAM, HARYANA",
                desc: "Leading cross-functional projects across 12 sectors with 360° stakeholder management, business development, and Power Platform automation.",
                bullets: ["Power Platform automation & SharePoint Online ecosystem", "360° stakeholder management across 16 sectors", "Saved 3,000+ hours annually · 5 awards earned"]
              },
              {
                date: "SEP 2022 — OCT 2023",
                org: "GlobalLogic Technologies",
                role: "Associate Analyst — Content Engineering",
                loc: "1 YEAR 2 MONTHS · GURUGRAM, HARYANA",
                desc: "Delivered content engineering and AI training datasets for Google & Microsoft, leading pilot projects against major MNC competition.",
                bullets: ["GenAI training data for Google & Microsoft", "QA error rate reduced by 25%", "Led 3 pilot projects — all secured"]
              }
            ].map((exp, i) => (
              <motion.div
                key={exp.org}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className="flex flex-col lg:flex-row gap-12 lg:gap-32 p-8 rounded-[40px] border border-white/5 glass">
                  <div className="w-48 text-[10px] font-bold text-white/30 tracking-widest pt-2">{exp.date}</div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight mb-2 italic md:not-italic">{exp.org}</h3>
                      <div className="text-neon text-sm font-medium mb-4">{exp.role}</div>
                      <div className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase mb-8">{exp.loc}</div>
                    </div>
                    <div>
                      <p className="text-white/60 mb-8 font-light italic md:not-italic">{exp.desc}</p>
                      <ul className="space-y-4">
                        {exp.bullets.map(b => (
                          <li key={b} className="flex gap-4 text-sm font-medium items-start">
                            <span className="text-neon shrink-0">+</span>
                            <span className="text-white/80">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 md:py-32 px-6 md:px-12 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <span className="text-neon font-black text-sm">03</span>
            <div className="w-16 h-px bg-neon" />
            <span className="text-xs md:text-sm font-black tracking-[0.4em] text-neon uppercase">Education</span>
          </div>

          <SpotlightCard className="glass p-8 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 md:p-16 opacity-[0.03] pointer-events-none">
              <div className="text-[120px] md:text-[240px] font-black italic">BCA</div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Bachelor of Computer Applications</h3>
                  <div className="text-neon text-xl font-bold italic tracking-tight">Majors: Computer Science</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Duration</div>
                  <div className="text-lg font-medium">JUL 2019 — AUG 2022</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight text-white/60 mb-6 italic">Maharaja Surajmal Institute</div>
                  <p className="text-white/40 max-w-2xl leading-relaxed italic md:not-italic font-light">
                    Strong academic foundation in Computer Science. Analytical mindset sharpened from Top 1% performance. Technical depth in systems, databases, and software that drives real-world impact at enterprise scale.
                  </p>
                </div>
                
                <div className="border border-neon/30 glass p-10 md:p-12 rounded-3xl flex flex-col items-center justify-center text-neon shrink-0 relative overflow-hidden">
                  <motion.div
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-neon/10 rounded-full blur-3xl pointer-events-none"
                  />
                  <div className="text-5xl font-black tracking-tighter relative z-10">9.3 / 10</div>
                  <div className="text-[10px] font-black tracking-widest uppercase mt-2 text-white/40 relative z-10">GPA / TOP 1%</div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Skills Carousel */}
      <SkillsCarousel />

      {/* Selected Work Section */}
      <section id="work" className="py-24 md:py-32 px-6 md:px-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-neon font-black text-sm">04</span>
                <div className="w-16 h-px bg-neon" />
                <span className="text-xs md:text-sm font-black tracking-[0.4em] text-neon uppercase">Projects</span>
              </div>
              <motion.h2 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]"
              >
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  projects that moved
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/20 italic block"
                >
                  needles, not just decks.
                </motion.span>
              </motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className="group glass p-8 rounded-[32px] border border-white/5 hover:-translate-y-2 transition-all flex flex-col h-full gap-8">
                  <div className="flex justify-between items-start relative z-20">
                    <span className="text-[10px] font-black text-neon tracking-[0.3em] uppercase">{p.org}</span>
                  </div>
                  <div className="relative z-20">
                    <h3 className="text-2xl font-black leading-tight mb-4 tracking-tight group-hover:text-neon transition-colors">{p.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed italic md:not-italic">{p.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 relative z-20">
                    {p.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black tracking-widest uppercase border border-white/5 transition-all duration-300 group-hover:text-neon group-hover:border-neon/40 group-hover:-translate-y-1">{t}</span>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-white/5 mt-auto flex items-center justify-between relative z-20">
                    <span className="text-[8px] font-bold text-white/30 tracking-[0.3em] uppercase">Impact</span>
                    <span className="text-xs font-bold text-neon">{p.impact}</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Metrics Section */}
      <section id="impact" className="py-24 md:py-32 px-6 md:px-12 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-20">
      <span className="text-neon font-black text-sm">05</span>
      <div className="w-16 h-px bg-neon" />
      <span className="text-xs md:text-sm font-black tracking-[0.4em] text-neon uppercase">Impact & Metrics</span>
    </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {impactMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <SpotlightCard className={`glass p-8 rounded-[24px] border ${m.color} flex flex-col items-center text-center h-full`}>
                  <div className="text-4xl font-black mb-2 tracking-tighter relative z-20">{m.value}</div>
                  <div className="text-[10px] font-black tracking-[0.2em] uppercase text-neon mb-1 relative z-20">{m.label}</div>
                  <div className="text-[10px] font-medium text-white/30 tracking-wider uppercase relative z-20">{m.sub}</div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Chart Area */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <SpotlightCard className="glass p-10 rounded-[40px] border border-white/10 h-full">
                <div className="flex justify-between items-end mb-12 relative z-20">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-2">/ Analytics</div>
                    <h3 className="text-3xl font-black tracking-tight">the receipts.<br/><span className="text-neon italic">hours saved, by initiative.</span></h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-neon">3,785_hrs</div>
                    <div className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Total Saved</div>
                  </div>
                </div>
                
                <div className="h-[400px] w-full relative z-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#ffffff40', fontSize: 9, fontWeight: 700, letterSpacing: '0.05em' }}
                        width={120}
                      />
                      <Tooltip 
                        cursor={{ fill: '#ffffff05' }}
                        contentStyle={{ background: '#111', border: '1px solid rgba(217, 255, 0, 0.2)', borderRadius: '12px' }}
                        itemStyle={{ color: '#D9FF00', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value} hrs`, 'Hours saved']}
                      />
                      <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* More Numbers List */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="h-full"
            >
              <SpotlightCard className="glass p-10 rounded-[40px] border border-white/10 flex flex-col gap-8 h-full">
                <div className="relative z-20">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase mb-4">/ More Key Numbers</div>
                  <div className="space-y-6">
                    {[
                      "Managed 5,000+ KPMG members contact system",
                      "QA'd 500+ content pieces weekly",
                      "Uploaded 5,000+ content assets",
                      "Improved project quality from 74% → 95%",
                      "Delivered project 2 weeks ahead of schedule"
                    ].map((text, i) => (
                      <div key={i} className="flex gap-4 group transition-all">
                        <div className="w-5 h-5 rounded-full bg-neon/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-neon transition-all group-hover:text-black">
                          <CheckCircle2 size={12} />
                        </div>
                        <span className="text-sm font-medium text-white/60 leading-tight group-hover:text-white transition-colors">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto p-6 bg-neon text-black rounded-2xl relative z-20">
                  <div className="font-black text-xs tracking-widest uppercase mb-1">Impact Driven</div>
                  <p className="text-xs font-bold leading-relaxed opacity-80 italic md:not-italic">"Data-driven decisions combined with automated workflows result in exponential efficiency."</p>
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
          >
            <h2 className="text-[60px] md:text-[120px] font-black leading-[0.8] tracking-tighter mb-12 uppercase">
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 80, filter: 'blur(15px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                let's build
              </motion.span>
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 80, filter: 'blur(15px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-white/20 italic block"
              >
                something
              </motion.span>
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 80, filter: 'blur(15px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-neon block"
              >
                impactful.
              </motion.span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
            {[
              { icon: <Mail size={24} />, label: "EMAIL", val: "kb270102@gmail.com", href: "mailto:kb270102@gmail.com" },
              { icon: <Smartphone size={24} />, label: "PHONE", val: "+91-7428062532", href: "tel:+917428062532" },
              { icon: <Linkedin size={24} />, label: "LINKEDIN", val: "/kartik-bhatt", href: "https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
            ].map(item => (
              <a 
                key={item.label}
                href={item.href}
                className="group transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SpotlightCard className="glass p-10 rounded-[32px] border border-white/5 flex flex-col items-center gap-6">
                  <div className="text-white/40 group-hover:text-neon transition-colors relative z-20">{item.icon}</div>
                  <div className="text-[9px] font-bold tracking-[0.4em] text-white/40 group-hover:text-neon transition-colors uppercase relative z-20">{item.label}</div>
                  <div className="text-sm font-medium text-white relative z-20 transition-colors">{item.val}</div>
                </SpotlightCard>
              </a>
            ))}
          </div>

          <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase">
            <div>© 2026-28 / KARTIK BHATT</div>
            <div>DELHI, INDIA</div>
          </footer>
        </div>
      </section>
    </div>
  );
}
