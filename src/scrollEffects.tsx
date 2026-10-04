/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Scroll-driven building blocks for the portfolio.
 * Every effect here respects `prefers-reduced-motion`: when the user asks for
 * reduced motion the transforms collapse to their resting state and content is
 * simply shown.
 */

import React, {
  Fragment,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  MotionValue,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const EASE_DECEL = [0.16, 1, 0.3, 1] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

// ─── Scroll-velocity marquee ──────────────────────────────────────────────────
// Drifts left at a constant pace; scrolling speeds it up, scrolling up reverses it.
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export const VelocityMarquee = memo(function VelocityMarquee({
  items,
}: {
  items: readonly string[];
}) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const v = smoothVelocity.get();
    if (v < -20) direction.current = 1;
    else if (v > 20) direction.current = -1;

    const boost = 1 + Math.min(Math.abs(v) / 250, 6);
    const base = 1.56; // % of one loop per second ≈ the original 32s linear loop
    baseX.set(wrap(-50, 0, baseX.get() + direction.current * base * boost * (delta / 1000)));
  });

  const x = useTransform(baseX, v => `${v}%`);

  return (
    <div className="w-full py-5 border-y border-white/5 bg-white/[0.015] overflow-hidden relative select-none">
      <motion.div className="flex w-max" style={{ x }}>
        {[...items, ...items].map((skill, idx) => (
          <div key={idx} className="flex items-center gap-4 shrink-0 pr-8">
            <span className="text-xs font-mono font-bold tracking-widest text-white/70 hover:text-[#D9FF00] transition-colors uppercase">
              {skill}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF00]/50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
});

// ─── Word-by-word reveal tied to scroll position ──────────────────────────────
type Segment = { text: string; className?: string };

const ScrollWord = memo(function ScrollWord({
  progress,
  range,
  reduced,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [reduced ? 1 : 0.2, 1]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
});

export function ScrollWords({
  segments,
  className = "",
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = !!useReducedMotion();
  // Starts early when approaching viewport, finishes 100% white when centered alongside the Executive Summary tile
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.98", "start 0.40"] });

  let prevEndsWithSpace = false;
  const words = segments.flatMap(seg => {
    const parts = seg.text.split(/\s+/).filter(Boolean);
    const gluesToPrev = !(/^\s/.test(seg.text) || prevEndsWithSpace);
    prevEndsWithSpace = /\s$/.test(seg.text);
    return parts.map((w, idx) => ({
      w,
      cls: seg.className,
      spaceBefore: idx > 0 || !gluesToPrev,
    }));
  });
  const n = words.length;

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && word.spaceBefore ? " " : null}
          <ScrollWord
            progress={scrollYProgress}
            range={[Math.max(0, (i - 1) / n), Math.min(1, (i + 1) / n)]}
            reduced={reduced}
            className={word.cls}
          >
            {word.w}
          </ScrollWord>
        </Fragment>
      ))}
    </p>
  );
}

// ─── Count-up numbers (runs once when scrolled into view) ─────────────────────
export function CountUp({
  value,
  className = "",
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const raw = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  const hasComma = raw.includes(",");
  const target = match ? parseFloat(raw.replace(/,/g, "")) : 0;

  const format = (n: number) =>
    prefix +
    (hasComma
      ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : n.toFixed(decimals)) +
    suffix;

  useEffect(() => {
    if (!match || !inView || reduced || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, target, {
      duration,
      ease: EASE_DECEL,
      onUpdate: v => { el.textContent = format(v); },
      onComplete: () => { el.textContent = value; },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className} aria-label={value}>
      {reduced ? value : format(0)}
    </span>
  );
}

// ─── Parallax wrapper ─────────────────────────────────────────────────────────
export function Parallax({
  children,
  distance = 40,
  className = "",
}: {
  children?: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : distance, reduced ? 0 : -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Timeline role: accent line draws itself as you scroll ───────────────────
export function TimelineRole({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative pl-6">
      <span aria-hidden="true" className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-white/15" />
      <motion.span
        aria-hidden="true"
        className="absolute -left-[2px] top-0 bottom-0 w-[2px] origin-top"
        style={{ background: accent, scaleY: reduced ? 1 : scaleY }}
      />
      {children}
    </div>
  );
}

// ─── Fan-out: items start stacked at the centre and spread as the row scrolls in ──
export function useSpreadProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.45"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 24, restDelta: 0.001 });
  return { ref, progress };
}

export const SpreadItem = memo(function SpreadItem({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const mid = (total - 1) / 2;
  const from = reduced ? 0 : (mid - index) * 64;
  const x = useTransform(progress, [0, 1], [from, 0]);
  const rotate = useTransform(progress, [0, 1], [reduced ? 0 : (index - mid) * 7, 0]);
  const scale = useTransform(progress, [0, 1], [reduced ? 1 : 0.7, 1]);
  const opacity = useTransform(progress, [0, 0.6], [reduced ? 1 : 0, 1]);

  return (
    <motion.div style={{ x, rotate, scale, opacity }}>
      {children}
    </motion.div>
  );
});

// ─── Pinned horizontal scroller (vertical scroll drives sideways motion) ──────
export function HorizontalScroller({
  header,
  children,
}: {
  header?: ReactNode;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distanceMV = useMotionValue(0);
  const [distance, setDistance] = useState(1200);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Maintain a consistent minimum scroll distance so the track height remains steady across filters
    const naturalTravel = track.scrollWidth - window.innerWidth + 96;
    const d = Math.max(750, naturalTravel);
    distanceMV.set(d);
    setDistance(d);
  }, [distanceMV]);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, children]);

  const x = useTransform([scrollYProgress, distanceMV], ([p, d]) => -(p as number) * (d as number));

  return (
    <div
      ref={wrapRef}
      data-testid="horizontal-scroller"
      style={{ height: `calc(100vh + ${distance}px)` }}
      className="relative"
    >
      <div className="sticky top-16 md:top-20 h-[calc(100vh-4.5rem)] flex flex-col justify-center overflow-hidden">
        {header && (
          <div className="max-w-7xl w-full mx-auto px-6 md:px-12 shrink-0">
            {header}
          </div>
        )}

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-6 px-6 md:px-12 mt-4 sm:mt-6">
          {children}
        </motion.div>

        {/* Bottom progress bar: ALWAYS rendered across all tabs with consistent layout to eliminate vertical shifting */}
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 mt-6 flex items-center gap-4 shrink-0">
          <div className="relative h-[2px] flex-1 bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-0 origin-left bg-[#D9FF00]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
