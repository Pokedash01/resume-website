/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  memo, useMemo, ReactNode, useEffect, useState,
  useCallback, useRef,
} from "react";
import {
  motion, useScroll, useTransform, useMotionValue,
  useSpring, AnimatePresence, animate,
} from "motion/react";
import {
  Download, Mail, Smartphone, Linkedin, CheckCircle2,
  ArrowUpRight, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Viewport thresholds ──────────────────────────────────────────────────────
const VP       = { once: true, amount: 0.15 } as const;
const VP_CARDS = { once: true, amount: 0.08 } as const;

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

// ─── Text Scramble Hook ───────────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
function useScramble(text: string, trigger: boolean, duration = 900) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = Math.floor(duration / 16);
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * text.length);
      setDisplay(
        text.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (frame >= totalFrames) { clearInterval(interval); setDisplay(text); }
    }, 16);
    return () => clearInterval(interval);
  }, [trigger, text, duration]);
  return display;
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) { node.textContent = Math.round(v).toLocaleString() + suffix; },
    });
    return () => ctrl.stop();
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── 3D Tilt Card ─────────────────────────────────────────────────────────────
const TiltCard = memo(function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glow = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    rx.set(y * -14);
    ry.set(x *  14);
    glow.set(1);
  }, [rx, ry, glow]);

  const handleLeave = useCallback(() => {
    rx.set(0); ry.set(0); glow.set(0);
  }, [rx, ry, glow]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: rx, rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.03] backdrop-blur-sm",
        "transition-[border-color,background] duration-500",
        "hover:border-[#D9FF00]/40 hover:bg-white/[0.055]",
        className,
      ].join(" ")}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ opacity: glow }}
      >
        <div className="absolute inset-0 rounded-2xl"
          style={{ boxShadow: "0 0 48px 0 rgba(217,255,0,0.10), inset 0 0 0 1px rgba(217,255,0,0.12)" }} />
      </motion.div>
      {children}
    </motion.div>
  );
});

// ─── Glass card ───────────────────────────────────────────────────────────────
const GlassCard = memo(function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={[
      "relative overflow-hidden rounded-2xl",
      "border border-white/10 bg-white/[0.03] backdrop-blur-sm",
      "transition-all duration-500",
      "hover:border-[#D9FF00]/35 hover:bg-white/[0.05]",
      "hover:shadow-[0_0_36px_0_rgba(217,255,0,0.07)]",
      className,
    ].join(" ")}>
      {children}
    </div>
  );
});

// ─── Magnetic Button ──────────────────────────────────────────────────────────
const MagneticButton = memo(function MagneticButton({
  children, className = "", onClick, href, download, target, rel,
}: {
  children: ReactNode; className?: string; onClick?: () => void;
  href?: string; download?: string; target?: string; rel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 22 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    x.set((e.clientX - left - width  / 2) * 0.35);
    y.set((e.clientY - top  - height / 2) * 0.35);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  const inner = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
    >
      {children}
    </motion.div>
  );

  if (href) return (
    <a href={href} download={download} target={target} rel={rel} style={{ display: "inline-block" }}>
      {inner}
    </a>
  );
  return inner;
});

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
      if (!cancelled) await new Promise<void>(r =>
        requestAnimationFrame(() => { void document.body.offsetHeight; r(); })
      );
      await ramp(65, 90, 300);
      await ramp(90, 100, 220);
      if (!cancelled) await new Promise(r => setTimeout(r, 300));
      if (!cancelled) { setExiting(true); setTimeout(() => { if (!cancelled) onComplete(); }, 650); }
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
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Perspective grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <div className="absolute inset-0 origin-top h-[200%] w-full"
              style={{
                backgroundImage: "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
                backgroundSize: "80px 80px",
                transform: "rotateX(60deg) translateY(-20%)",
              }}
            />
          </div>

          {/* Radial glow */}
          <motion.div
            className="absolute w-[60vw] h-[60vw] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(217,255,0,0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corner brackets */}
          {["top-6 left-6 border-t border-l","top-6 right-6 border-t border-r","bottom-6 left-6 border-b border-l","bottom-6 right-6 border-b border-r"].map((cls, i) => (
            <motion.div key={i} className={`absolute w-8 h-8 border-white/15 ${cls}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            />
          ))}

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
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
          <motion.div className="relative z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          >
            <div className="w-[220px] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-[#D9FF00] rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.1s linear",
                  boxShadow: "0 0 12px #D9FF00, 0 0 28px rgba(217,255,0,0.4)",
                }}
              />
            </div>
            <div className="flex items-center justify-between w-[220px]">
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">Initialising</span>
              <span className="text-[9px] font-black text-[#D9FF00] tabular-nums">{progress}%</span>
            </div>
          </motion.div>

          {/* Scan line */}
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF00]/15 to-transparent pointer-events-none"
            style={{ animation: "scanline 2.8s linear infinite" }}
          />

          <style>{`
            @keyframes loaderFlicker {
              0%,100% { opacity:1; } 44% { opacity:1; } 45% { opacity:.35; } 46% { opacity:1; }
              90% { opacity:1; } 90.5% { opacity:.55; } 91% { opacity:1; }
            }
            @keyframes scanline {
              0% { top:-2px; opacity:0; } 8% { opacity:1; } 92% { opacity:1; } 100% { top:100%; opacity:0; }
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
  const [label,    setLabel]    = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX); dotY.set(e.clientY);
      ringX.set(e.clientX); ringY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("a,button,[data-hover]");
      setHovered(!!interactive);
      setLabel((interactive as HTMLElement)?.dataset?.cursorLabel ?? "");
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
        animate={{ width: clicking ? 4 : hovered ? 12 : 6, height: clicking ? 4 : hovered ? 12 : 6 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border flex items-center justify-center"
        style={{
          x: ringX, y: ringY,
          translateX: "-50%", translateY: "-50%",
          borderColor: hovered ? "rgba(217,255,0,0.9)" : "rgba(217,255,0,0.4)",
          transition: "border-color 0.18s",
        }}
        animate={{ width: clicking ? 20 : hovered ? 56 : 32, height: clicking ? 20 : hovered ? 56 : 32 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {label && (
          <span className="text-[7px] font-black tracking-widest text-[#D9FF00] uppercase whitespace-nowrap">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
});

// ─── Orb Background ───────────────────────────────────────────────────────────
const OrbBackground = memo(function OrbBackground() {
  const mouseX    = useMotionValue(0);
  const mouseY    = useMotionValue(0);
  const scrollYmv = useMotionValue(0);

  const slowX = useSpring(mouseX, { stiffness: 20, damping: 28, mass: 1.4 });
  const slowY = useSpring(mouseY, { stiffness: 20, damping: 28, mass: 1.4 });
  const midX  = useSpring(mouseX, { stiffness: 40, damping: 30, mass: 1.0 });
  const midY  = useSpring(mouseY, { stiffness: 40, damping: 30, mass: 1.0 });
  const fastX = useSpring(mouseX, { stiffness: 66, damping: 26, mass: 0.7 });
  const fastY = useSpring(mouseY, { stiffness: 66, damping: 26, mass: 0.7 });

  const scrollSlow = useTransform(scrollYmv, [0, 4000], [0,  -90]);
  const scrollMid  = useTransform(scrollYmv, [0, 4000], [0, -160]);
  const scrollFast = useTransform(scrollYmv, [0, 4000], [0,   60]);

  // Morphing glow orb follows mouse smoothly
  const orbX = useSpring(useMotionValue(50), { stiffness: 18, damping: 30, mass: 1.6 });
  const orbY = useSpring(useMotionValue(30), { stiffness: 18, damping: 30, mass: 1.6 });

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pct_x = (e.clientX / window.innerWidth)  * 100;
        const pct_y = (e.clientY / window.innerHeight) * 100;
        mouseX.set((e.clientX / window.innerWidth  - 0.5) * 55);
        mouseY.set((e.clientY / window.innerHeight - 0.5) * 55);
        orbX.set(pct_x);
        orbY.set(pct_y);
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
  }, [mouseX, mouseY, scrollYmv, orbX, orbY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Morphing cursor-following orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          left: orbX.get() + "%", top: orbY.get() + "%",
          x: "-50%", y: "-50%",
          background: "radial-gradient(circle, rgba(217,255,0,0.055) 0%, rgba(217,255,0,0.02) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ left: `${orbX.get()}%`, top: `${orbY.get()}%` }}
        transition={{ type: "spring", stiffness: 18, damping: 30 }}
      />

      {/* Static perspective grid */}
      <div className="absolute inset-0 opacity-[0.038]">
        <div className="absolute inset-0 origin-top h-[200%] w-full"
          style={{
            backgroundImage: "linear-gradient(to right,#D9FF00 1px,transparent 1px),linear-gradient(to bottom,#D9FF00 1px,transparent 1px)",
            backgroundSize: "100px 100px",
            transform: "rotateX(60deg) translateY(-20%)",
          }}
        />
      </div>

      {/* Horizontal scan lines */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(217,255,0,0.06) 3px, rgba(217,255,0,0.06) 4px)",
        }}
      />

      {/* Side bars */}
      <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
      <div className="absolute inset-y-0 right-12 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

      {/* Right accent bars */}
      <div className="absolute right-0 top-0 bottom-0 w-20 opacity-[0.035] flex flex-col items-center py-24 gap-4">
        {[...Array(18)].map((_, i) => (
          <motion.div key={i} className="w-1 bg-[#D9FF00] rounded-full"
            animate={{ height: [28, 36, 28] }}
            transition={{ duration: 2 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <div className="absolute top-[-12%] right-[-8%] w-[65vw] h-[65vw] bg-[#D9FF00]/10 rounded-full blur-[130px] opacity-18" />
      <div className="absolute bottom-[-12%] left-[-8%] w-[42vw] h-[42vw] bg-blue-500/5 rounded-full blur-[110px] opacity-8" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── SLOW parallax layer */}
      <motion.div className="absolute will-change-transform" style={{ x: slowX, y: slowY, top: "14%", left: "6%", translateY: scrollSlow }}>
        <motion.div className="w-20 h-20 border border-[#D9FF00]/10 rounded-sm"
          style={{ transform: "rotate(45deg)" }}
          animate={{ rotate: [45, 55, 45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-1/2 left-full w-28 h-px bg-gradient-to-r from-[#D9FF00]/10 to-transparent" />
      </motion.div>
      <motion.div
        className="absolute will-change-transform font-mono text-[8px] font-bold leading-[1.9] tracking-wider text-[#D9FF00]/[0.055]"
        style={{ x: slowX, y: slowY, left: "2%", top: "22%", translateY: scrollSlow }}
      >
        01101011<br />00110010<br />11010011<br />01001101<br />10110100<br />00101101
      </motion.div>

      {/* ── MID layer */}
      <motion.div className="absolute will-change-transform" style={{ x: midX, y: midY, top: "28%", left: "30%", translateY: scrollMid }}>
        <svg width="180" height="70" viewBox="0 0 180 70" fill="none">
          <path d="M0 35 H45 L60 18 H115 L130 35 H180" stroke="#D9FF00" strokeWidth="0.8" opacity="0.07"/>
          <motion.circle cx="45" cy="35" r="2.5" fill="#D9FF00"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.circle cx="130" cy="35" r="2.5" fill="#D9FF00"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
          />
          <path d="M60 18 V6"  stroke="#D9FF00" strokeWidth="0.8" opacity="0.06"/>
          <path d="M115 18 V6" stroke="#D9FF00" strokeWidth="0.8" opacity="0.06"/>
        </svg>
      </motion.div>
      <motion.div
        className="absolute will-change-transform font-mono text-[8px] leading-[2.1] text-right"
        style={{ x: midX, y: midY, right: "4%", top: "52%", translateY: scrollMid }}
      >
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> automate --run</div>
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> deploy --prod</div>
        <div className="text-[#D9FF00]/[0.06]"><span className="text-[#D9FF00]/[0.1]">$</span> flow.trigger()</div>
        <motion.div className="text-[#34D399]/[0.12]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >✓ 2,000h saved</motion.div>
      </motion.div>

      {/* ── FAST layer */}
      <motion.div
        className="absolute will-change-transform font-mono font-black text-[22px] text-[#D9FF00]/[0.05]"
        style={{ x: fastX, y: fastY, top: "10%", right: "22%", translateY: scrollFast }}
      >{"{ }"}</motion.div>
      <motion.div className="absolute will-change-transform" style={{ x: fastX, y: fastY, bottom: "12%", right: "26%", translateY: scrollFast }}>
        <svg width="90" height="50" viewBox="0 0 90 50" fill="none">
          <rect x="5" y="5" width="80" height="40" rx="3" stroke="#D9FF00" strokeWidth="0.7" opacity="0.06"/>
          <path d="M5 16 H85" stroke="#D9FF00" strokeWidth="0.7" opacity="0.05"/>
          <circle cx="14" cy="10.5" r="2" fill="#D9FF00" opacity="0.08"/>
          <circle cx="22" cy="10.5" r="2" fill="#D9FF00" opacity="0.08"/>
          <circle cx="30" cy="10.5" r="2" fill="#D9FF00" opacity="0.05"/>
        </svg>
      </motion.div>
    </div>
  );
});

// ─── Stagger headline (scroll-triggered) ─────────────────────────────────────
const StaggerHeadline = memo(function StaggerHeadline({
  lines, className = "", dimFrom = 1, greenWords = [],
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
      variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
      className={["font-black tracking-tighter", className].join(" ")}
    >
      {lines.map((line, idx) => (
        <motion.span key={line} variants={{
          hidden:  { opacity: 0, y: 64, filter: "blur(12px)", skewY: 2 },
          visible: { opacity: 1, y: 0,  filter: "blur(0px)",  skewY: 0 },
        }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={`block overflow-hidden${idx >= dimFrom ? " text-white/20 italic" : ""}`}
        >
          {greenWords.includes(line) ? <span className="text-[#D9FF00]">{line}</span> : line}
        </motion.span>
      ))}
    </motion.h2>
  );
});

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ num, label }: { num: string; label: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const scrambled = useScramble(label.toUpperCase(), inView);
  return (
    <motion.div ref={ref} className="flex items-center gap-4 mb-12"
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
    >
      <span className="text-[#D9FF00] font-black text-sm">{num}</span>
      <motion.div className="h-px bg-[#D9FF00]"
        initial={{ width: 0 }} whileInView={{ width: 56 }} viewport={VP}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-[11px] font-black tracking-[0.4em] text-[#D9FF00] uppercase font-mono">
        {scrambled}
      </span>
    </motion.div>
  );
}

// ─── Skills carousel ──────────────────────────────────────────────────────────
const skills = [
  "Power Apps","Power Automate","Power BI","SharePoint",
  "SQL","Copilot","Gen AI","AI Agents","GenAI Workflows","RFP / RFI",
];
const SkillsCarousel = memo(function SkillsCarousel() {
  const rep = useMemo(() => [...skills, ...skills, ...skills, ...skills], []);
  return (
    <div className="w-full border-y border-white/[0.06] overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
      <div style={{ display:"flex", width:"max-content", animation:"marquee 28s linear infinite" }} className="py-7">
        {rep.map((skill, i) => (
          <div key={i} className="flex items-center gap-5 shrink-0 px-3">
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-white/10 hover:text-[#D9FF00] transition-colors duration-300 whitespace-nowrap">
              {skill.toUpperCase()}
            </span>
            <motion.div className="w-2 h-2 bg-[#D9FF00] rounded-full shrink-0"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2 + i * 0.1, repeat: Infinity }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Static data ──────────────────────────────────────────────────────────────
const stats = [
  { label: "YEARS EXP",      value: 3,    suffix: "+",  display: "3+"     },
  { label: "HRS SAVED",      value: 2000, suffix: "+",  display: "2,000+" },
  { label: "ASSETS MANAGED", value: 30,   suffix: "k+", display: "30k+"   },
  { label: "RFP / RFI",      value: 100,  suffix: "+",  display: "100+"   },
  { label: "AWARDS",         value: 5,    suffix: "×",  display: "5×"     },
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
    org: "KPMG", title: "Power Platform Automated Harvesting",
    desc: "Built Power Apps + Power Automate solution for harvesting knowledge assets — saving 1,500 hrs. annually.",
    tags: ["POWER APPS","POWER AUTOMATE","POWER BI"], impact: "1,200 hrs saved / year",
  },
  {
    org: "KPMG", title: "SPO List Migration & Modernisation",
    desc: "Migrated legacy Excel data to SharePoint Online with Power Automate flows for real-time notifications.",
    tags: ["SHAREPOINT ONLINE","POWER APPS","POWER AUTOMATE"], impact: "500 hrs saved",
  },
  {
    org: "KPMG", title: "Global Sector Contact Repository",
    desc: "Comprehensive repository for sector contacts spanning globe-wide KPMG members with curated sector pages.",
    tags: ["SHAREPOINT","KNOWLEDGE MGMT","METADATA MGMT"], impact: "5,000+ members",
  },
  {
    org: "KPMG", title: "Engagement Metrics Dashboard",
    desc: "Centralised repository for engagement metrics across all assets, visualised in Power BI for leadership reporting.",
    tags: ["POWER BI","EXCEL","DATA ANALYTICS"], impact: "30K+ assets tracked",
  },
  {
    org: "GLOBALLOGIC", title: "GenAI Training Dataset — Google",
    desc: "Piloted and delivered test + main dataset for GenAI training, enabling content search on Android screens.",
    tags: ["GENAI","QA","PROCESS DESIGN"], impact: "74% → 95% quality",
  },
  {
    org: "GLOBALLOGIC", title: "Multi-Level Doc Retrieval AI",
    desc: "Piloted an extraction system pulling relevant answers from multi-level documents — won against major MNCs.",
    tags: ["AI PIPELINES","PILOT MGMT"], impact: "1 of 3 pilots secured",
  },
];

const toolkitGroups = [
  { category: "Power Platform",  items: ["Power Apps","Power Automate","Power BI"],          icon: "⚡" },
  { category: "Microsoft 365",   items: ["SharePoint Online","Excel","PowerPoint"],           icon: "🟦" },
  { category: "AI & GenAI",      items: ["Copilot","AI Agents","GenAI Workflows"],            icon: "🤖" },
  { category: "Knowledge Mgmt.", items: ["RFP / RFI","Taxonomy / Metadata Mgmt.","SQL"],     icon: "🗂" },
];

const experienceDefs = [
  {
    start:   new Date(2024, 4, 1),
    end:     null as Date | null,
    dateStr: "MAY 2024 — PRESENT",
    org:     "KPMG",
    role:    "Analyst — Knowledge Management",
    city:    "GURUGRAM, HARYANA",
    desc:    "Leading cross-functional projects across 13 sectors with 360° stakeholder management, business development, and Power Platform automation.",
    bullets: [
      "Power Platform automation & SharePoint Online ecosystem",
      "360° stakeholder management across 13 sectors",
      "Saved 2,000+ hours annually · 5 awards earned",
    ],
  },
  {
    start:   new Date(2022, 8, 1),
    end:     new Date(2023, 9, 1),
    dateStr: "SEP 2022 — OCT 2023",
    org:     "GlobalLogic Technologies",
    role:    "Associate Analyst — Content Engineering",
    city:    "GURUGRAM, HARYANA",
    desc:    "Delivered content engineering and AI training datasets for Google & Microsoft, leading pilot projects against major MNC competition.",
    bullets: [
      "GenAI training data for Google & Microsoft",
      "QA error rate reduced by 25%",
      "Led 3 pilot projects — all secured",
    ],
  },
];

const awards = [
  { num:"01", title:"Kudos Award × 2",   org:"KPMG", desc:"Exceptional efficiency via Lean Six Sigma — saved 2,000+ hours annually. Also awarded for migrating legacy VBA / Excel to GenAI agents & Power Platform." },
  { num:"02", title:"Super Team Award",  org:"KPMG", desc:"Hosting and organising employee council events for the wider KGS group, fostering community and collaboration." },
  { num:"03", title:"Ally of Inclusion", org:"KPMG", desc:"Commitment to cultivating an inclusive and diverse work environment across KPMG Global Services." },
  { num:"04", title:"Gurus@Work",        org:"KPMG", desc:"Contributions to KGS learning culture — empowering and inspiring learners across the organisation." },
];

const contactItems = [
  { icon: <Mail size={22}/>,       label:"EMAIL",    val:"kb270102@gmail.com",  href:"mailto:kb270102@gmail.com" },
  { icon: <Smartphone size={22}/>, label:"PHONE",    val:"+91-7428062532",       href:"tel:+917428062532" },
  { icon: <Linkedin size={22}/>,   label:"LINKEDIN", val:"/kartik-bhatt",        href:"https://www.linkedin.com/in/kartik-bhatt-b77249219/" },
];

const keyNumbers = [
  "Managed 5,000+ KPMG members contact system",
  "QA'd 100+ content pieces weekly",
  "Uploaded 5,000+ content assets",
  "Improved project quality from 74% → 95%",
  "Delivered project 2 weeks ahead of schedule",
];

// ─── LIVE Hours Counter Widget ────────────────────────────────────────────────
// Signature element: real-time hours saved counter — ticks up ~0.23 hrs/hr (2000/8760)
function LiveHoursWidget() {
  const BASE_HRS  = 2000;
  const START_YR  = new Date(2024, 4, 1);
  const HRS_PER_MS = BASE_HRS / (365 * 24 * 60 * 60 * 1000);
  const calcHours = () => {
    const elapsed = Date.now() - START_YR.getTime();
    return Math.floor(elapsed * HRS_PER_MS);
  };
  const [hours, setHours] = useState(calcHours);
  useEffect(() => {
    const id = setInterval(() => setHours(calcHours()), 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-3 mt-8 px-5 py-3 rounded-full border border-[#D9FF00]/25 bg-[#D9FF00]/[0.05] backdrop-blur-sm"
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-[#D9FF00]"
        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <Zap size={13} className="text-[#D9FF00]" />
      <span className="text-[11px] font-black tracking-widest text-[#D9FF00]/80 uppercase font-mono">
        {hours.toLocaleString()} hrs automated
      </span>
      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">live</span>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded,   setLoaded]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  // scroll-linked hero parallax
  const { scrollY } = useScroll();
  const heroY  = useTransform(scrollY, [0, 600], [0, 80]);
  const heroO  = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#D9FF00] selection:text-black">
      <style>{`
        @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes dotblink { 0%,100% { opacity:1; } 50% { opacity:0.15; } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        section[id] { scroll-margin-top: 100px; }
      `}</style>

      <div className="hidden md:block"><CustomCursor /></div>
      <LoadingScreen onComplete={handleLoadComplete} />

      <AnimatePresence>
        {loaded && (
          <motion.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <OrbBackground />

            {/* ── NAV ───────────────────────────────────────────── */}
            <motion.div
              className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[92%] max-w-7xl z-[999]"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <nav className="backdrop-blur-[28px] border rounded-2xl px-6 md:px-10 h-16 flex items-center justify-between"
                style={{
                  background:  scrolled ? "rgba(5,5,5,0.75)" : "rgba(5,5,5,0)",
                  borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
                  boxShadow:   scrolled ? "0 8px 32px rgba(0,0,0,0.6),0 0 0 1px rgba(217,255,0,0.04),inset 0 1px 0 rgba(217,255,0,0.06)" : "none",
                  transition: "background 0.4s ease,border-color 0.4s ease,box-shadow 0.4s ease",
                }}
              >
                <div className="flex items-center gap-2">
                  <motion.div className="w-2 h-2 bg-[#D9FF00] rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                  <span className="font-bold tracking-tighter text-sm uppercase">kartik.bhatt</span>
                </div>
                <div className="hidden md:flex gap-5 text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase">
                  {["about","experience","education","toolkit","work","honors","contact"].map(link => (
                    <a key={link} href={`#${link}`}
                      className="hover:text-[#D9FF00] transition-colors relative group"
                    >
                      {link === "work" ? "Projects" : link.charAt(0).toUpperCase() + link.slice(1)}
                      <motion.div className="absolute -bottom-1 left-0 h-px bg-[#D9FF00] w-0 group-hover:w-full transition-all duration-300" />
                    </a>
                  ))}
                </div>
                <MagneticButton
                  href="/Resume.pdf" download="Kartik_Bhatt_Resume.pdf"
                  target="_blank" rel="noreferrer"
                  className="bg-[#D9FF00] text-black px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 hover:bg-white transition-colors"
                  data-cursor-label="GRAB"
                >
                  Resume <Download size={12} />
                </MagneticButton>
              </nav>
            </motion.div>

            {/* ══════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════ */}
            <section className="min-h-screen pt-36 pb-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 relative">
              <motion.div className="flex-1 max-w-3xl" style={{ y: heroY, opacity: heroO }}>

                {/* Eyebrow */}
                <motion.div className="flex items-center gap-4 mb-10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: 0.15 }}
                >
                  <motion.div className="h-px bg-[#D9FF00]" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.5, duration: 0.6, ease: [0.16,1,0.3,1] }} />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase">Portfolio · 2026</span>
                </motion.div>

                {/* Name — split by line with individual slide-up */}
                <div className="overflow-hidden">
                  <motion.h1 className="text-[76px] md:text-[148px] font-black leading-[0.78] tracking-tighter"
                    initial={{ opacity: 0, y: 60, filter: "blur(14px)" }}
                    animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                    transition={{ duration: 0.9, ease: [0.16,1,0.3,1], delay: 0.25 }}
                  >
                    kartik<br />
                    <span className="text-white/18">bhatt</span><span className="text-[#D9FF00]">_</span>
                  </motion.h1>
                </div>

                {/* Role */}
                <motion.p className="mt-10 text-lg md:text-xl text-white/55 font-light max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: 0.45 }}
                >
                  Knowledge Management &amp; Business Analyst.<br />
                  <span className="text-white/25 text-sm font-mono tracking-widest uppercase mt-3 block">
                    power platform · genai · sharepoint
                  </span>
                </motion.p>

                {/* Tagline */}
                <motion.div className="mt-6 flex items-center gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: 0.6 }}
                >
                  <div className="w-8 h-px bg-[#D9FF00]/60" />
                  <span className="text-[11px] font-bold tracking-[0.25em] text-[#D9FF00]/65 uppercase">
                    Three years. Two global firms. One mission.
                  </span>
                </motion.div>

                {/* SIGNATURE: Live hours widget */}
                <LiveHoursWidget />
              </motion.div>

              {/* Profile photo */}
              <motion.div
                className="relative w-full max-w-[460px] h-[430px] shrink-0"
                initial={{ opacity: 0, scale: 0.86, rotate: -6 }}
                animate={{ opacity: 1, scale: 1,    rotate:  0 }}
                transition={{ type: "spring", stiffness: 55, damping: 17, delay: 0.3 }}
                style={{ animation: "floatY 6s ease-in-out infinite" }}
                data-hover
              >
                {/* Accent corner lines */}
                <motion.div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[#D9FF00]/60 rounded-tl-xl"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
                />
                <motion.div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[#D9FF00]/60 rounded-br-xl"
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
                />

                <div className="absolute inset-0 border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.03] backdrop-blur-sm shadow-[0_0_80px_0_rgba(217,255,0,0.07)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                  {/* Scanline on photo */}
                  <div className="absolute inset-0 z-20 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.6) 2px,rgba(0,0,0,0.6) 3px)" }}
                  />
                  <img src="/profile.jpg" alt="Kartik Bhatt" loading="eager" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-8 left-8 z-30">
                    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                      <motion.div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-full"
                        animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                      />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">ANALYST · KPMG</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── STATS — animated counters on scroll ────────────── */}
            <section className="border-y border-white/[0.06] bg-white/[0.012] backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/[0.05]">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={{ delay: i * 0.09 }}
                    className="p-10 flex flex-col gap-2 hover:bg-white/[0.025] transition-colors cursor-default group"
                  >
                    <div className="text-4xl md:text-5xl font-black tracking-tighter group-hover:text-[#D9FF00] transition-colors duration-400">
                      {stat.display}
                    </div>
                    <div className="text-[9px] font-bold tracking-[0.4em] text-white/25 uppercase">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── ABOUT ─────────────────────────────────────────── */}
            <section id="about" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto">
                <SectionLabel num="01" label="About Me" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
                  <div>
                    <StaggerHeadline
                      lines={["i turn legacy","chaos into measurable,","automated impact."]}
                      className="text-4xl md:text-[54px] leading-[0.9] mb-9 lowercase"
                      dimFrom={1} greenWords={["automated impact."]}
                    />
                    <motion.p className="text-white/55 text-base leading-relaxed font-light"
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                      transition={{ delay: 0.3 }}
                    >
                      Results-driven analyst with 3+ years across{" "}
                      <span className="text-white font-medium">Knowledge Management</span> &amp;{" "}
                      <span className="text-white font-medium">Content Engineering</span> at top global firms.
                      Specialises in Power Platform automation, SharePoint Online, and data-driven operational
                      improvements. Saved 2,000+ hours annually through lean process optimisation and
                      GenAI-powered workflows — across 13 sectors and global teams.
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <GlassCard className="p-9">
                      <div className="text-[10px] font-bold tracking-[0.3em] text-[#D9FF00] uppercase mb-7">/ At a Glance</div>
                      {[
                        { l:"NAME",   v:"Kartik Bhatt"          },
                        { l:"ROLE",   v:"Analyst · KPMG"         },
                        { l:"BASED",  v:"Delhi, India"            },
                        { l:"DEGREE", v:"BCA · Computer Science" },
                        { l:"GPA",    v:"9.3 / 10 · top 1%"     },
                      ].map((item, i) => (
                        <motion.div key={item.l}
                          className="flex justify-between items-center py-3 border-b border-white/[0.05]"
                          initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                          transition={{ delay: i * 0.07 }}
                        >
                          <span className="text-[9px] font-bold text-white/25 tracking-[0.2em]">{item.l}</span>
                          <span className="text-sm font-medium">{item.v}</span>
                        </motion.div>
                      ))}
                    </GlassCard>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ── EXPERIENCE — timeline ──────────────────────────── */}
            <section id="experience" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto">
                <SectionLabel num="02" label="Experience" />
                <div className="relative">
                  {/* Timeline connector */}
                  <div className="absolute left-0 md:left-[180px] top-0 bottom-0 w-px bg-gradient-to-b from-[#D9FF00]/30 via-[#D9FF00]/10 to-transparent hidden md:block" />

                  <div className="space-y-10">
                    {experienceDefs.map((exp, idx) => {
                      const tenure = calcTenure(exp.start, exp.end ?? now);
                      return (
                        <motion.div key={exp.org}
                          initial={{ opacity: 0, y: 36, filter: "blur(6px)" }}
                          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          viewport={VP}
                          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                          className="relative"
                        >
                          {/* Timeline dot */}
                          <motion.div
                            className="absolute left-0 md:left-[180px] top-9 w-3 h-3 bg-[#D9FF00] rounded-full -translate-x-1/2 hidden md:block"
                            animate={{ boxShadow: ["0 0 0 0 rgba(217,255,0,0.4)", "0 0 0 8px rgba(217,255,0,0)", "0 0 0 0 rgba(217,255,0,0)"] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.5 }}
                          />
                          <TiltCard className="flex flex-col lg:flex-row gap-10 lg:gap-20 p-8 md:ml-8">
                            <div className="w-44 text-[10px] font-bold text-white/25 tracking-widest pt-1 shrink-0">
                              {exp.dateStr}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">{exp.org}</h3>
                                <div className="text-[#D9FF00] text-sm font-medium mb-2">{exp.role}</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-bold tracking-[0.18em] text-white/18 uppercase">
                                    {tenure} · {exp.city}
                                  </span>
                                  {!exp.end && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D9FF00]/10 border border-[#D9FF00]/20">
                                      <motion.span className="w-1 h-1 rounded-full bg-[#D9FF00]"
                                        animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                                      />
                                      <span className="text-[8px] font-black text-[#D9FF00] tracking-wider uppercase">Live</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-white/45 mb-5 font-light text-sm leading-relaxed">{exp.desc}</p>
                                <ul className="space-y-3">
                                  {exp.bullets.map(b => (
                                    <li key={b} className="flex gap-3 text-sm font-medium items-start group">
                                      <motion.span className="text-[#D9FF00] shrink-0 mt-px"
                                        whileHover={{ scale: 1.4 }}
                                      >+</motion.span>
                                      <span className="text-white/75 group-hover:text-white transition-colors">{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </TiltCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ── EDUCATION ──────────────────────────────────────── */}
            <section id="education" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto">
                <SectionLabel num="03" label="Education" />
                <motion.div
                  initial={{ opacity: 0, x: -36, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={VP}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard className="p-6 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.025] pointer-events-none select-none">
                      <div className="text-[80px] md:text-[140px] font-black italic leading-none">BCA</div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 uppercase">
                            Bachelor of Computer Applications
                          </h3>
                          <div className="text-[#D9FF00] text-base font-bold italic tracking-tight">Majors: Computer Science</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Duration</div>
                          <div className="text-sm font-medium">JUL 2019 — AUG 2022</div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                          <div className="text-lg font-bold tracking-tight text-white/50 mb-2 italic">Maharaja Surajmal Institute</div>
                          <p className="text-white/35 max-w-2xl leading-relaxed font-light text-xs">
                            Strong academic foundation in Computer Science. Analytical mindset sharpened from Top 1%
                            performance. Technical depth in systems, databases, and software that drives real-world impact at enterprise scale.
                          </p>
                        </div>
                        <motion.div
                          className="border border-[#D9FF00]/30 bg-[#D9FF00]/[0.06] backdrop-blur-sm px-8 py-5 rounded-2xl flex flex-col items-center justify-center text-[#D9FF00] shrink-0"
                          whileHover={{ scale: 1.04, boxShadow: "0 0 40px 0 rgba(217,255,0,0.15)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-3xl font-black tracking-tighter">9.3 / 10</div>
                          <div className="text-[10px] font-black tracking-widest uppercase mt-1 text-white/35">GPA / TOP 1%</div>
                        </motion.div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            </section>

            {/* ── TOOLKIT ────────────────────────────────────────── */}
            <section id="toolkit" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="-mx-6 md:-mx-12"><SkillsCarousel /></div>
              <div className="max-w-7xl mx-auto mt-16">
                <SectionLabel num="04" label="Toolkit & Expertise" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {toolkitGroups.map((group, i) => (
                    <motion.div key={group.category}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={VP}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TiltCard className="p-6 h-full group">
                        <div className="text-base font-black tracking-tight text-white mb-5 group-hover:text-[#D9FF00] transition-colors duration-300 flex items-center gap-2">
                          {group.category}
                        </div>
                        <ul className="space-y-3">
                          {group.items.map(item => (
                            <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/50 group-hover:text-white/80 transition-colors duration-300">
                              <motion.span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]/40 group-hover:bg-[#D9FF00] shrink-0 transition-colors duration-300"
                                whileHover={{ scale: 1.5 }}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── PROJECTS ───────────────────────────────────────── */}
            <section id="work" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto">
                <SectionLabel num="05" label="Projects & Impact" />
                <StaggerHeadline
                  lines={["projects that moved","needles, not just","decks."]}
                  className="text-4xl md:text-[54px] leading-[0.9] mb-10 lowercase"
                  dimFrom={1} greenWords={["decks."]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                  {projects.map((p, i) => (
                    <motion.div key={p.title}
                      initial={{ opacity: 0, y: 28, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={VP_CARDS}
                      transition={{ type:"spring", stiffness:90, damping:20, delay: i * 0.07 }}
                    >
                      <TiltCard className="group p-8 flex flex-col h-full gap-5">
                        <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">{p.org}</span>
                        <div>
                          <h3 className="text-xl font-black leading-tight mb-3 tracking-tight group-hover:text-[#D9FF00] transition-colors duration-300">{p.title}</h3>
                          <p className="text-sm text-white/38 leading-relaxed">{p.desc}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map(t => (
                            <span key={t} className="px-3 py-1 bg-white/[0.04] rounded-full text-[8px] font-black tracking-widest uppercase border border-white/[0.06] group-hover:text-[#D9FF00] group-hover:border-[#D9FF00]/25 transition-all duration-300">{t}</span>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-white/[0.05] mt-auto flex items-center justify-between">
                          <span className="text-[8px] font-bold text-white/25 tracking-[0.3em] uppercase">Impact</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#D9FF00]">{p.impact}</span>
                            <ArrowUpRight size={11} className="text-[#D9FF00] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>

                {/* Impact metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {impactMetrics.map((m, i) => (
                    <motion.div key={m.label}
                      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={VP}
                      transition={{ delay: i * 0.08 }}
                    >
                      <TiltCard className={`p-7 border ${m.color} flex flex-col items-center text-center h-full`}>
                        <div className="text-3xl font-black mb-1 tracking-tighter">{m.value}</div>
                        <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[#D9FF00] mb-1">{m.label}</div>
                        <div className="text-[9px] font-medium text-white/25 tracking-wider uppercase">{m.sub}</div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar chart */}
                  <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={VP} className="lg:col-span-2">
                    <GlassCard className="p-10 h-full">
                      <div className="flex justify-between items-end mb-10">
                        <div>
                          <div className="text-[10px] font-bold tracking-[0.3em] text-white/18 uppercase mb-2">/ Analytics</div>
                          <h3 className="text-2xl font-black tracking-tight">
                            the receipts.<br /><span className="text-[#D9FF00] italic">hours saved, by initiative.</span>
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-[#D9FF00]">2,185_hrs</div>
                          <div className="text-[9px] font-bold tracking-widest text-white/18 uppercase">Total Saved</div>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical" margin={{ left:20, right:30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                              tick={{ fill:"#ffffff35", fontSize:9, fontWeight:700 }} width={130} />
                            <Tooltip
                              cursor={{ fill:"#ffffff04" }}
                              contentStyle={{ background:"#0e0e0e", border:"1px solid rgba(217,255,0,0.18)", borderRadius:"14px" }}
                              itemStyle={{ color:"#D9FF00", fontWeight:"bold" }}
                              formatter={(v: any) => [`${v} hrs`,"Hours saved"]}
                            />
                            <Bar dataKey="hours" radius={[0,6,6,0]} barSize={20} isAnimationActive={false}>
                              {chartData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Key numbers */}
                  <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={VP}>
                    <GlassCard className="p-10 flex flex-col gap-6 h-full">
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.3em] text-white/18 uppercase mb-5">/ Key Numbers</div>
                        <div className="space-y-5">
                          {keyNumbers.map((text, i) => (
                            <motion.div key={i} className="flex gap-4 group"
                              initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                              transition={{ delay: i * 0.07 }}
                            >
                              <div className="w-5 h-5 rounded-full bg-[#D9FF00]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#D9FF00] transition-all duration-300 group-hover:text-black">
                                <CheckCircle2 size={11} />
                              </div>
                              <span className="text-sm font-medium text-white/55 leading-tight group-hover:text-white transition-colors duration-300">{text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-auto p-5 bg-[#D9FF00] text-black rounded-2xl">
                        <div className="font-black text-xs tracking-widest uppercase mb-1">Impact Driven</div>
                        <p className="text-xs font-bold leading-relaxed opacity-75">
                          "Data-driven decisions combined with automated workflows result in exponential efficiency."
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ── HONORS ─────────────────────────────────────────── */}
            <section id="honors" className="py-24 px-6 md:px-12 border-b border-white/[0.06]">
              <div className="max-w-7xl mx-auto">
                <SectionLabel num="06" label="Honors" />
                <StaggerHeadline
                  lines={["five awards.","discipline collecting","interest."]}
                  className="text-4xl md:text-[54px] leading-[0.85] mb-14"
                  dimFrom={1} greenWords={["interest."]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {awards.map((award, i) => (
                    <motion.div key={award.num}
                      initial={{ opacity:0, y:28, scale:0.97 }}
                      whileInView={{ opacity:1, y:0, scale:1 }}
                      viewport={VP_CARDS}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TiltCard className="p-8 h-full group">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-[9px] font-bold tracking-[0.25em] text-white/18 uppercase">{award.org}</span>
                          <span className="text-[#D9FF00]/30 font-black text-3xl font-mono">{award.num}</span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-[#D9FF00] transition-colors duration-300">{award.title}</h3>
                        <p className="text-sm text-white/38 leading-relaxed">{award.desc}</p>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CONTACT ────────────────────────────────────────── */}
            <section id="contact" className="py-24 px-6 md:px-12">
              <div className="max-w-7xl mx-auto text-center">
                <StaggerHeadline
                  lines={["let's build","something","impactful."]}
                  className="text-[50px] md:text-[100px] leading-[0.8] mb-10 uppercase"
                  dimFrom={1} greenWords={["impactful."]}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
                  {contactItems.map(item => (
                    <motion.a key={item.label} href={item.href} className="group" target="_blank" rel="noopener noreferrer"
                      data-hover data-cursor-label="OPEN"
                      whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                    >
                      <TiltCard className="p-10 flex flex-col items-center gap-5">
                        <div className="text-white/35 group-hover:text-[#D9FF00] transition-colors duration-300">{item.icon}</div>
                        <div className="text-[9px] font-bold tracking-[0.4em] text-white/30 group-hover:text-[#D9FF00] transition-colors duration-300 uppercase">{item.label}</div>
                        <div className="text-sm font-medium text-white">{item.val}</div>
                      </TiltCard>
                    </motion.a>
                  ))}
                </div>

                <footer className="mt-16 pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-white/18 uppercase">
                  <div>© 2026 / KARTIK BHATT</div>
                  <div className="flex items-center gap-2">
                    <motion.div className="w-1.5 h-1.5 bg-[#D9FF00] rounded-full"
                      animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>DELHI, INDIA</span>
                  </div>
                  <div>BUILT WITH PRECISION</div>
                </footer>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
