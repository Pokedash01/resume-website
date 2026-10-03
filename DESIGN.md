# Visual Design System & Frontend Architecture (DESIGN.md)

This document formalizes the design system and UI engineering principles for Kartik Bhatt's professional portfolio, adhering to:
- [Taste Skill](https://www.tasteskill.dev/)
- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills)
- [Vercel Web Animation Design](https://github.com/vercel-labs/open-agents/blob/main/.agents/skills/web-animation-design/SKILL.md)
- [OakOSS Agent Skills](https://github.com/oakoss/agent-skills) (Scroll Animation Storytelling Experience)
- [Awesome Design MD](https://github.com/voltagent/awesome-design-md)
- [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction)

---

## 1. Narrative Architecture & Scroll Storytelling (OakOSS Agent Skills)

The portfolio is structured as an orchestrated 6-act executive narrative rather than disjointed feature rows:
- **Prologue (Hero)**: Real-time timezone telemetry (`New Delhi IST`), live deployment role status, oversized kinetic typography, and magnetic cursor interaction.
- **Act I: The Ethos & Foundation (About)**: Core operational manifesto, annualized hours saved metrics ribbon, and executive credentials.
- **Act II: The Trajectory (Experience)**: Multi-year career narrative highlighting the October 2026 promotion to Business Associate, KPMG KM leadership, and GlobalLogic foundational pilots.
- **Act III: The Academic Benchmark (Education)**: Top 1% academic standing (9.3/10 GPA) in computer science, systems, and algorithms.
- **Act IV: The Engineering Engine (Toolkit)**: Bento architecture covering Power Platform, Copilot Studio, and Lean Six Sigma methodology with production impact tags.
- **Act V: The Case Studies (Projects & ROI)**: Filterable case study cards with gliding tab selector, deep dive architectural lightbox, and interactive ROI bar chart.
- **Act VI: The Validation (Certifications & Honors)**: Verified credentials spread with spring physics and 5 enterprise awards.
- **Epilogue: The Invitation (Contact)**: Direct executive dialogue channels and live availability.
- **Global Chapter Spine & Progress Tracker**: Fixed-top scroll progress bar + floating side chapter indicators that dynamically highlight the active story act.

---

## 2. Core Design Philosophy & Anti-Slop Directive

- **Domain-Authentic Identity**: A high-impact executive and technical portfolio representing an enterprise Knowledge Management and Power Platform leader at KPMG and GlobalLogic.
- **Strict 60-30-10 Color Budget**:
  - **60% Neutral Canvas**: Pure stark jet-black background (`#050505`).
  - **30% Structural Depth**: Translucent obsidian cards (`rgba(255, 255, 255, 0.025)`), glassmorphism layers, and subtle hairline borders (`rgba(255, 255, 255, 0.08)`).
  - **10% High-Intent Accent**: Vibrant electric lime neon (`#D9FF00`) used deliberately for primary callouts, interactive indicators, focus states, and key metric emphases.
- **Zero-Pill & Metadata Discipline**:
  - Prohibit static tags encased in rounded-full pill capsules or candy badges.
  - Render informational metadata as clean unboxed text with typographic separators (`·`, `/`) or crisp micro-radius tokens (`rounded-md`).
  - Interactive filter controls are explicit buttons (`<button>`) with clear active/inactive visual feedback.
- **Top Bar Contract**:
  - Zone 1: Single text element brand wordmark with status pulse.
  - Zone 2: Canonical navigation links (`About`, `Experience`, `Education`, `Toolkit`, `Projects`, `Certifications`, `Honors`, `Contact`). Both desktop and mobile share identical sections and naming.
  - Zone 3: 1 primary action button (`Resume Download` with accessible icon & download attribute).
  - Mobile: Fully accessible sheet/drawer navigation for mobile viewports.

---

## 2. Typography & Spatial Tokens

### Typography Scale
- **Display & Headings**: `Plus Jakarta Sans` (weights: 700 bold, 800 extra bold, 900 black).
- **Body & Editorial**: `Plus Jakarta Sans` (weights: 300 light, 400 normal, 500 medium, line-height: 1.6–1.7, measure: 60–75ch).
- **Technical & Telemetry**: `JetBrains Mono` with `tabular-nums` for all metrics, dates, percentages, hours saved, and code tokens.
- **Headline Balance**: Apply `text-wrap: balance` / max-width constraints to prevent orphan words.

### Spatial Mathematics
- Outer container padding $\ge$ inner component spacing ($P_{\text{container}} \ge 24\text{px}$).
- Button geometry: horizontal padding $\approx 2\times$ vertical padding (`px-5 py-2.5`).
- Nested border radius rule: $r_{\text{inner}} = r_{\text{outer}} - \text{padding}$.

---

## 3. Web Animation Design System (Vercel Labs Specifications)

Adhering to [Vercel Web Animation Design](https://github.com/vercel-labs/open-agents/blob/main/.agents/skills/web-animation-design/SKILL.md):

### 3.1 Compositor-Only Principle
- Animate strictly GPU-accelerated properties: `transform` (translation, scale) and `opacity`.
- Zero animation on layout geometry (`height`, `width`, `margin`, `padding`), eliminating reflow and paint cycles.

### 3.2 Timing, Easing & Duration Budgets
- **Deceleration Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and state transitions.
- **20–25% Faster Exit Rule**: Exits use faster acceleration curves (`[0.4, 0, 1, 1]` or ~160ms vs 220–240ms entrances) so dismissed elements leave immediately without lingering.
- **Interactive Springs**: Segmented tab indicators and micro-interactions use snappy critically-damped springs (`stiffness: 400–450, damping: 30–35`).

### 3.3 Interactive Web Parts Animation
- **Gliding Tab Selector (`layoutId="activeFilterTab"`)**: Active project category indicator smoothly glides across tabs with spring physics.
- **Card Micro-Interactions**: Hover lifts cards by `-4px` with subtle border illumination; active clicks scale down slightly (`scale: 0.985`).
- **Modal Lightbox**: Smooth spring scale-in from `0.95` to `1.0` with backdrop fade; faster exit on dismissal.
- **Mobile Menu Drawer**: Staggered link reveals with spring entrance.
- **Accessibility & Reduced Motion**: Automatically checks `useReducedMotion()`. If preferred by the user, all animations drop to instantaneous switches.

---

## 4. Accessibility & Playwright Invariants

In accordance with [Playwright Agent CLI](https://playwright.dev/agent-cli/introduction) testability standards:
1. **Focus Rings**: Dedicated `:focus-visible` styling (`outline: 2px solid #D9FF00; outline-offset: 3px`) ensuring 100% keyboard accessibility.
2. **Touch Targets**: All interactive elements measure $\ge 44\text{px}\times 44\text{px}$ on mobile.
3. **Semantic Landmarks**: Standard `<header>`, `<nav>`, `<main>`, `<section id="...">`, `<footer>` regions.
4. **Data Test IDs**:
   - `data-testid="filter-all"`, `data-testid="filter-power-platform"`, `data-testid="filter-genai"`
   - `data-testid="project-card-*"`
   - `data-testid="project-modal"`
   - `data-testid="mobile-menu-btn"`
   - `data-testid="download-resume-btn"`
5. **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` with zero animation latency for sensitive users.
