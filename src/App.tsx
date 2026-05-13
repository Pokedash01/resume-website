/**
 * OPTIMIZED 60FPS APP.TSX
 * Performance-focused rewrite
 */

import { motion } from "framer-motion";
import {
  Download,
  Mail,
  Smartphone,
  Linkedin,
  CheckCircle2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

import { memo, ReactNode } from "react";

function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/5 bg-white/[0.02] transition-transform duration-300 hover:-translate-y-1 will-change-transform ${className}`}
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
  { name: "Harvesting App", hours: 1500, color: "#D9FF00" },
  { name: "Assets Library", hours: 200, color: "#34D399" },
  { name: "Excel Migration", hours: 1100, color: "#A855F7" },
  { name: "Pillar Metrics", hours: 185, color: "#F43F5E" },
  { name: "AI Agents", hours: 800, color: "#F59E0B" },
];

const projects = [
  {
    org: "KPMG",
    title: "Power Platform Automation",
    desc: "Built automation workflows saving 1,500 hrs annually.",
    impact: "1,500 hrs saved",
  },
  {
    org: "KPMG",
    title: "SharePoint Modernisation",
    desc: "Migrated legacy Excel systems to SharePoint Online.",
    impact: "1,100 hrs saved",
  },
  {
    org: "GLOBALLOGIC",
    title: "GenAI Training Dataset",
    desc: "Delivered AI training pipelines for Google.",
    impact: "95% quality",
  },
];

const skills = [
  "Power Apps",
  "Power Automate",
  "Power BI",
  "SharePoint",
  "GenAI",
  "SQL",
  "Copilot",
  "AI Agents",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const SkillsCarousel = memo(function SkillsCarousel() {
  return (
    <section className="border-y border-white/5 overflow-hidden py-16">
      <div className="mb-10 flex justify-center">
        <div className="bg-[#D9FF00] px-8 py-3 rounded-full">
          <span className="text-black font-black uppercase tracking-wider text-sm">
            Toolkit & Expertise
          </span>
        </div>
      </div>

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ willChange: "transform" }}
        className="flex gap-10 whitespace-nowrap"
      >
        {[...skills, ...skills].map((skill, i) => (
          <div key={i} className="flex items-center gap-5">
            <span className="text-3xl md:text-5xl font-black text-white/10 uppercase">
              {skill}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#D9FF00]" />
          </div>
        ))}
      </motion.div>
    </section>
  );
});

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Optimized Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,255,0,0.08),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_30%)]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#D9FF00]" />
          <span className="uppercase text-xs font-bold tracking-widest">
            kartik.bhatt
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#impact">Impact</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          href="/Resume.pdf"
          target="_blank"
          rel="noreferrer"
          download
        >
          <button className="bg-[#D9FF00] text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 transition-transform hover:scale-105">
            Resume <Download size={12} />
          </button>
        </a>
      </nav>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-16 px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-[#D9FF00]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                Portfolio
              </span>
            </div>

            <h1 className="text-[72px] md:text-[140px] font-black leading-[0.8] tracking-tighter uppercase">
              kartik
              <br />
              <span className="text-white/20">bhatt</span>
            </h1>

            <p className="mt-10 text-lg text-white/60 leading-relaxed max-w-lg">
              Knowledge Management & Business Analyst focused on
              automation, SharePoint, Power Platform, and GenAI workflows.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[420px] h-[420px]"
        >
          <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-white/10 bg-white/[0.02]">
            <img
              src="/profile.jpg"
              alt="Kartik Bhatt"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105 will-change-transform"
            />

            <div className="absolute bottom-6 left-6 bg-black/60 px-4 py-2 rounded-full border border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Analyst · KPMG
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative z-10 border-y border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-10 border-white/5 md:border-r"
            >
              <div className="text-4xl font-black tracking-tight">
                {stat.value}
              </div>

              <div className="text-[10px] tracking-[0.2em] uppercase text-white/30 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative z-10 py-24 px-6 md:px-12"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex items-center gap-4">
            <span className="text-[#D9FF00] font-black">01</span>
            <div className="w-16 h-px bg-[#D9FF00]" />
            <span className="uppercase tracking-[0.3em] text-xs text-[#D9FF00]">
              About
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
                Turning legacy systems into automated impact.
              </h2>

              <p className="mt-8 text-white/60 leading-relaxed text-lg">
                Results-driven analyst with 3+ years experience across
                Knowledge Management and Content Engineering.
              </p>
            </div>

            <SpotlightCard className="rounded-[32px] p-10">
              <div className="space-y-5">
                {[
                  ["NAME", "Kartik Bhatt"],
                  ["ROLE", "Analyst · KPMG"],
                  ["LOCATION", "Delhi, India"],
                  ["DEGREE", "BCA · Computer Science"],
                  ["GPA", "9.3 / 10"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between border-b border-white/5 pb-4"
                  >
                    <span className="text-[10px] tracking-[0.2em] text-white/30">
                      {label}
                    </span>

                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <SkillsCarousel />

      {/* PROJECTS */}
      <section
        id="projects"
        className="relative z-10 py-24 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase">
              Selected Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <SpotlightCard
                key={project.title}
                className="rounded-[28px] p-8 flex flex-col"
              >
                <span className="text-[#D9FF00] text-[10px] tracking-[0.3em] uppercase font-bold">
                  {project.org}
                </span>

                <h3 className="mt-6 text-2xl font-black leading-tight">
                  {project.title}
                </h3>

                <p className="mt-4 text-white/50 leading-relaxed">
                  {project.desc}
                </p>

                <div className="mt-auto pt-8">
                  <span className="text-sm font-bold text-[#D9FF00]">
                    {project.impact}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section
        id="impact"
        className="relative z-10 py-24 px-6 md:px-12 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">
            <SpotlightCard className="rounded-[32px] p-8 h-full">
              <div className="mb-10">
                <h3 className="text-3xl font-black">
                  Hours Saved by Initiative
                </h3>
              </div>

              <div className="h-[400px]">
                <ResponsiveContainer width="99%" height={400}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 10, right: 10 }}
                  >
                    <XAxis type="number" hide />

                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={120}
                      tick={{
                        fill: "#ffffff80",
                        fontSize: 10,
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="hours"
                      radius={[0, 4, 4, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </div>

          <SpotlightCard className="rounded-[32px] p-8">
            <div className="space-y-6">
              {[
                "Managed 5,000+ member systems",
                "QA'd 500+ content pieces weekly",
                "Uploaded 5,000+ assets",
                "95% project quality achieved",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 items-start"
                >
                  <div className="w-5 h-5 rounded-full bg-[#D9FF00]/20 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 size={12} />
                  </div>

                  <span className="text-white/70">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative z-10 py-24 px-6 md:px-12"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-[60px] md:text-[120px] font-black leading-[0.8] tracking-tight uppercase">
            Let's Build
            <br />
            <span className="text-[#D9FF00]">
              Something Impactful
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: <Mail size={24} />,
                label: "EMAIL",
                value: "kb270102@gmail.com",
                href: "mailto:kb270102@gmail.com",
              },
              {
                icon: <Smartphone size={24} />,
                label: "PHONE",
                value: "+91-7428062532",
                href: "tel:+917428062532",
              },
              {
                icon: <Linkedin size={24} />,
                label: "LINKEDIN",
                value: "/kartik-bhatt",
                href: "https://linkedin.com",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <SpotlightCard className="rounded-[28px] p-10 flex flex-col items-center gap-5">
                  <div className="text-white/60">
                    {item.icon}
                  </div>

                  <div className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                    {item.label}
                  </div>

                  <div className="font-medium">
                    {item.value}
                  </div>
                </SpotlightCard>
              </a>
            ))}
          </div>

          <footer className="mt-20 pt-10 border-t border-white/5 text-white/20 text-[10px] tracking-[0.2em] uppercase flex flex-col md:flex-row justify-between gap-4">
            <div>© 2026 Kartik Bhatt</div>
            <div>Delhi, India</div>
          </footer>
        </div>
      </section>
    </div>
  );
}
