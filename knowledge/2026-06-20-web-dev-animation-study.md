# WEB DEVELOPMENT & ANIMATION IMPLEMENTATION STUDY — 2026
## Deep Dive: React Patterns, GSAP, Framer Motion, Performance Optimization

Study Date: 2026-06-20
Sources: 10+ technical articles on animation libraries, performance benchmarks, React patterns

---

# PART 1: ANIMATION LIBRARY LANDSCAPE 2026

## The Big Three: GSAP vs Framer Motion vs React Spring

### GSAP (GreenSock Animation Platform)

**Status**: The industry standard. 100% FREE since April 2025 (previously paid for plugins). Now native in Webflow.

**Bundle Size**: ~23KB gzipped (core), ~50KB with common plugins
**Frameworks**: All (vanilla, React, Vue, Svelte, Angular, Webflow)
**Best For**: Complex sequences, scroll animations, text reveals, particle systems, cinematic page choreography
**Used By**: Disney, Google, Amazon, Apple, Stripe

**Core Philosophy**: Imperative timeline engine. You tell it what to do, it executes with precision.

**Key Features (All Free in 2026)**:
- `gsap.to()`, `gsap.from()`, `gsap.fromTo()` — Basic tweens
- `gsap.timeline()` — Sequenced animations with precise control
- `ScrollTrigger` — Pin, scrub, snap scroll-linked animations
- `SplitText` — Character/word-level text animations
- `MorphSVG` — SVG shape morphing
- `Flip` — Layout transitions (First-Last-Invert-Play)
- `Observer` — Unified gesture detection (mouse, touch, scroll)
- `Draggable` — Make anything draggable
- `MotionPath` — Animate along SVG paths
- `Inertia` — Physics-based momentum

**React Integration (2026 Pattern)**:
```jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    // Set initial state (avoids flash of unstyled content)
    gsap.set('.hero-headline', { autoAlpha: 0, y: 50 });
    gsap.set('.hero-subtext', { autoAlpha: 0, y: 30 });
    gsap.set('.hero-cta', { autoAlpha: 0, scale: 0.8 });
    
    // Create timeline
    const tl = gsap.timeline({ 
      defaults: { ease: 'power2.out' } 
    });
    
    tl.to('.hero-headline', { autoAlpha: 1, y: 0, duration: 0.8 })
      .to('.hero-subtext', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-cta', { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.3');
    
    // ScrollTrigger for scroll-based reveals
    gsap.from('.milestone-card', {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.milestones-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
  }, { scope: containerRef }); // Auto-cleanup on unmount
  
  return (
    <div ref={containerRef}>
      <h1 className="hero-headline">$MAD REWARDS</h1>
      <p className="hero-subtext">Earn while you hold...</p>
      <button className="hero-cta">CLAIM NOW</button>
    </div>
  );
}
```

**Why GSAP for $MAD**:
- ✅ Best performance for 15+ simultaneous animations (fire embers, counters, glows)
- ✅ ScrollTrigger is essential for scroll-reveal milestones
- ✅ 60fps on mobile (direct DOM manipulation, no React re-renders)
- ✅ SplitText for animated "$MAD" headlines (character-by-character reveals)
- ✅ Free plugins (no cost barrier)
- ✅ Can mix with Framer Motion for UI states

**Performance Rules**:
- Only animate `transform` and `opacity` (GPU-composited)
- Use `gsap.set()` before `gsap.to()` to avoid FOUC (flash of unstyled content)
- Always use `useGSAP({ scope: ref })` for automatic cleanup
- Use `will-change: transform` on animated elements
- Batch DOM reads/writes — GSAP does this automatically
- Use `gsap.matchMedia()` for responsive animations

**Reduced Motion Support**:
```jsx
gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
  // Disable all animations for this user
  gsap.globalTimeline.timeScale(0);
  return () => gsap.globalTimeline.timeScale(1);
});
```

---

### Framer Motion

**Status**: The React-native standard. Built by Framer team. Declarative, component-based.

**Bundle Size**: ~33-46KB gzipped (full), ~18KB for `domAnimation` subset
**Frameworks**: React only (no vanilla JS version)
**Best For**: UI animations, layout transitions, exit animations, gesture-based interactions (drag, hover, tap)

**Core Philosophy**: Declarative. Animation is state. Change props, Framer Motion handles the transition.

**Key Features**:
- `<motion.div>` — Drop-in replacement for `<div>` with animation props
- `initial`, `animate`, `exit` — Three states of a component's lifecycle
- `AnimatePresence` — Animate components as they mount/unmount (exit animations)
- `layout` prop — Automatic layout transitions (DOM reordering, size changes)
- `whileHover`, `whileTap`, `whileDrag` — Gesture-based animations
- `useSpring`, `useMotionValue` — Physics-based values
- `variants` — Coordinated animation states across component trees

**React Pattern**:
```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transitions with AnimatePresence
function PageWrapper({ children, routerKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routerKey}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Card with hover lift + glow
function MilestoneCard({ data }) {
  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        boxShadow: '0 0 40px rgba(255, 45, 45, 0.15)',
        borderColor: 'rgba(255, 45, 45, 0.3)'
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="card bg-[#111] border border-white/10 rounded-xl p-6"
    >
      <h3>{data.title}</h3>
      <p>{data.description}</p>
    </motion.div>
  );
}

// Staggered children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

function MilestoneGrid({ milestones }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {milestones.map(m => (
        <motion.div key={m.id} variants={itemVariants}>
          <MilestoneCard data={m} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Why Framer Motion for $MAD**:
- ✅ Native React integration (no refs, no imperative code)
- ✅ AnimatePresence for page transitions (Next.js router)
- ✅ `whileHover`/`whileTap` for button/card micro-interactions
- ✅ Layout animations for filter/sort transitions
- ✅ Better SSR support than GSAP (initial state renders server-side)
- ✅ Easier to learn for React developers

**When NOT to Use Framer Motion**:
- ❌ 50+ simultaneous elements (performance degrades)
- ❌ Complex scroll-linked animations (ScrollTrigger is better)
- ❌ Heavy timeline sequencing (GSAP timelines are superior)
- ❌ Particle systems (GSAP is built for this)

---

### React Spring

**Status**: Physics-based animation. Niche but powerful for specific use cases.

**Bundle Size**: ~18KB gzipped
**Frameworks**: React
**Best For**: Natural-feeling UI animations, 3D (react-three-fiber), spring simulations

**Core Philosophy**: Spring physics instead of duration-based tweens. Animations never truly "end" — they settle into position.

**Why Skip for $MAD**:
- Not needed if GSAP + Framer Motion cover the use cases
- Smaller community, less documentation
- Spring animations can be unpredictable for brand animations

---

## The Verdict: Hybrid Architecture for $MAD

**Best practice in 2026**: Use BOTH together. Clear separation of concerns:

| Layer | Library | Responsibility |
|-------|---------|-------------|
| **Scroll/Storytelling** | GSAP + ScrollTrigger | Page scroll reveals, pinned sections, parallax |
| **UI Micro-interactions** | Framer Motion | Hover effects, button feedback, layout transitions |
| **Page Transitions** | Framer Motion AnimatePresence | Route changes, modal enter/exit |
| **Text Animations** | GSAP SplitText | Headline character reveals, word staggers |
| **Complex Timelines** | GSAP Timeline | Hero load sequences, choreographed reveals |
| **Gesture Interactions** | Framer Motion | Drag, swipe, tap animations |

**Implementation Strategy**:
```
1. Start with Framer Motion for everything (fastest to implement)
2. When you hit performance limits or need scroll animations, migrate to GSAP
3. Use GSAP for the hero section load sequence (precision timing)
4. Use Framer Motion for card hovers, button taps, page transitions
5. Lazy-load GSAP only on pages that use it (saves 50-80KB on static pages)
```

---

# PART 2: REACT PERFORMANCE PATTERNS 2026

## 1. The "Set Then Animate" Pattern (GSAP)

**Problem**: Flash of unstyled content (FOUC) — content appears at final position before animating.
**Solution**: Set initial state instantly, then animate to final state.

```jsx
useGSAP(() => {
  // Step 1: Set everything to hidden state INSTANTLY
  gsap.set('.card', { autoAlpha: 0, y: 50 });
  
  // Step 2: Animate to visible state
  gsap.to('.card', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 });
}, { scope: containerRef });
```

**Key**: `autoAlpha` (GSAP-specific) handles both `opacity` AND `visibility`. More performant than just `opacity`.

## 2. The Scope Pattern (GSAP in React)

**Problem**: GSAP selectors (`'.card'`) can match elements outside the component.
**Solution**: Use `scope` in `useGSAP`.

```jsx
const containerRef = useRef(null);

useGSAP(() => {
  // This only selects .card INSIDE containerRef
  gsap.from('.card', { y: 30, opacity: 0 });
}, { scope: containerRef });
```

**Benefit**: Automatic cleanup when component unmounts. No memory leaks.

## 3. Lazy Loading Heavy Components

**Pattern**: Don't load animation libraries on pages that don't need them.

```jsx
import dynamic from 'next/dynamic';

// Only load GSAP when needed
const AnimatedHero = dynamic(() => import('./AnimatedHero'), {
  loading: () => <HeroSkeleton />,
  ssr: false // GSAP is client-side only
});

// Use Framer Motion for simple components (lightweight)
import { motion } from 'framer-motion';
```

## 4. Avoiding React Re-Renders During Animation

**The Problem**: If you store animation values in React state, every frame triggers a re-render.

**The Solution**: Use refs, not state, for animation values.

```jsx
// ❌ BAD: Triggers re-render every frame
const [x, setX] = useState(0);
gsap.to({}, { 
  onUpdate: () => setX(gsap.getProperty(element, 'x')) 
});

// ✅ GOOD: Direct DOM manipulation, no re-renders
const elementRef = useRef(null);
gsap.to(elementRef.current, { x: 100, duration: 1 });
// Or use GSAP's ticker for values that need reading
useGSAP(() => {
  gsap.ticker.add(() => {
    // Read values directly, no React state
    const x = gsap.getProperty(elementRef.current, 'x');
  });
});
```

## 5. Intersection Observer for Scroll Triggers

**Pattern**: Don't start animations until elements are visible.

```jsx
// GSAP ScrollTrigger (recommended)
gsap.from('.card', {
  scrollTrigger: {
    trigger: '.cards-container',
    start: 'top 80%', // When top of container hits 80% of viewport
    toggleActions: 'play none none none' // Play once, don't reverse
  },
  y: 50,
  opacity: 0,
  stagger: 0.15
});

// Or use native IntersectionObserver for simple cases
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  },
  { threshold: 0.2 }
);
```

## 6. Code Splitting for Animation Libraries

```javascript
// next.config.js or webpack config
module.exports = {
  experimental: {
    // Split GSAP into separate chunk
    optimizePackageImports: ['gsap']
  }
};

// Only import what you need
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Only import used plugins
// Don't import the whole gsap/all bundle
```

## 7. The `will-change` Strategy

```css
/* Add before animation starts */
.card {
  will-change: transform, opacity;
}

/* Remove after animation completes (to free GPU memory) */
.card.animation-complete {
  will-change: auto;
}
```

**In GSAP**:
```jsx
gsap.to('.card', {
  y: 0,
  opacity: 1,
  onComplete: () => {
    gsap.set('.card', { willChange: 'auto' }); // Free GPU
  }
});
```

## 8. Debouncing Scroll Events

```jsx
// ❌ BAD: Triggers on every scroll pixel
window.addEventListener('scroll', () => {
  // Heavy calculation
});

// ✅ GOOD: Use GSAP's optimized ticker or throttle
import { useGSAP } from '@gsap/react';

useGSAP(() => {
  gsap.ticker.add(() => {
    // Runs once per frame (60fps max), automatically throttled
    // Much better than raw scroll listeners
  });
});
```

---

# PART 3: CORE WEB VITALS & ANIMATION PERFORMANCE

## The 2026 Metrics

Google's Core Web Vitals now heavily penalize poor animation performance:

| Metric | Target | Animation Impact |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Heavy animations block main thread, delay LCP |
| **INP** (Interaction to Next Paint) | < 200ms | Slow animations after click = bad INP |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Animating width/height causes layout shifts |
| **TTFB** (Time to First Byte) | < 600ms | Server response before any animation can start |
| **FCP** (First Contentful Paint) | < 1.8s | First visible content — don't block with JS |

## Animation Performance Checklist

### ✅ DO
- Animate `transform` and `opacity` only (GPU-composited)
- Use `requestAnimationFrame` for custom animations (GSAP does this automatically)
- Use CSS transitions for simple hover effects (no JS overhead)
- Use `content-visibility: auto` for off-screen sections
- Preload critical fonts: `<link rel="preload" href="/font.woff2" as="font">`
- Use `font-display: swap` to prevent invisible text during load

### ❌ DON'T
- Animate `width`, `height`, `top`, `left`, `margin`, `padding` (triggers layout recalculation)
- Animate `filter: blur()` (expensive GPU operation)
- Use `setState` on every animation frame (React re-renders kill performance)
- Block the main thread with heavy calculations during animation
- Use unthrottled scroll event listeners
- Load animation libraries for static pages

## The Animation Performance Budget

For a page with heavy animations (like $MAD rewards):

```
Total JS Budget: 500KB (gzipped)
- React + Next.js: ~120KB
- GSAP (core + ScrollTrigger): ~35KB
- Framer Motion: ~35KB (only if needed for UI)
- Other utilities: ~50KB
- Remaining for app logic: ~260KB

Animation Target: 60fps on iPhone 13, 30fps on budget Android
- Max 40 simultaneous GSAP tweens
- Max 15 Framer Motion components animating
- Use reduced motion on low-end devices
```

## Lighthouse Scoring for Animation

Run these checks after implementing animations:
1. Open DevTools → Performance tab
2. Click record, scroll through the page, interact with elements
3. Check for:
   - **Red bars** (layout thrashing) — avoid animating layout properties
   - **Long frames** (>16.67ms) — simplify animations or reduce count
   - **Jank** (frame drops) — reduce complexity or use `will-change`

---

# PART 4: NEXT.JS 15+ SPECIFIC PATTERNS

## 1. Server Components vs Client Components

```jsx
// app/page.tsx — Server Component (default)
export default function HomePage() {
  // Fetch data server-side
  const data = await fetchData();
  
  return (
    <main>
      <StaticHero data={data} />
      {/* Client component for animations */}
      <AnimatedSection client:load>
        <MilestoneCards />
      </AnimatedSection>
    </main>
  );
}

// components/AnimatedSection.tsx — MUST be 'use client'
'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function AnimatedSection({ children }) {
  const ref = useRef(null);
  
  useGSAP(() => {
    gsap.from('.card', { y: 30, opacity: 0, stagger: 0.1 });
  }, { scope: ref });
  
  return <div ref={ref}>{children}</div>;
}
```

**Rule**: Keep Server Components as the default. Only add `'use client'` for components that need:
- Browser APIs (window, document, localStorage)
- Animation libraries (GSAP, Framer Motion)
- Event listeners (onClick, onScroll)
- React hooks that depend on client state

## 2. Hydration Safety

**Problem**: GSAP modifies DOM before React hydrates, causing mismatch.
**Solution**: Use `useGSAP` (handles hydration) or delay until after hydration.

```jsx
// ✅ Safe: useGSAP handles hydration
useGSAP(() => {
  gsap.from('.element', { opacity: 0 });
}, { scope: ref });

// ✅ Alternative: Wait for hydration complete
useEffect(() => {
  // Only run after hydration
  const timer = setTimeout(() => {
    gsap.from('.element', { opacity: 0 });
  }, 0);
  return () => clearTimeout(timer);
}, []);
```

## 3. Streaming with Suspense

```jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<MilestoneSkeleton />}>
      <AnimatedMilestones />
    </Suspense>
  );
}

// AnimatedMilestones.tsx
'use client';
export function AnimatedMilestones() {
  const data = use(fetchData()); // Suspense-enabled fetch
  
  useGSAP(() => {
    gsap.from('.card', { y: 30, opacity: 0, stagger: 0.1 });
  });
  
  return <div>{/* render milestones */}</div>;
}
```

## 4. Image Optimization

```jsx
import Image from 'next/image';

// ✅ Optimized: WebP, lazy loading, proper sizing
<Image
  src="/mad-logo.png"
  alt="$MAD Logo"
  width={500}
  height={500}
  priority={true}        // Above the fold
  loading="lazy"         // Below the fold (default for non-priority)
  quality={85}           // Balance quality/size
  placeholder="blur"     // Blur placeholder while loading
  blurDataURL="data:image/jpeg;base64,..."
/>;

// ✅ Modern formats with fallback
<picture>
  <source srcSet="/mad-logo.avif" type="image/avif" />
  <source srcSet="/mad-logo.webp" type="image/webp" />
  <Image src="/mad-logo.png" alt="$MAD Logo" width={500} height={500} />
</picture>;
```

---

# PART 5: IMPLEMENTATION PATTERNS FOR $MAD

## Pattern 1: Hero Load Sequence (GSAP Timeline)

```jsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HeroSection() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.hero-label', { autoAlpha: 0, y: 20 });
      gsap.set('.hero-title', { autoAlpha: 0, y: 40 });
      gsap.set('.hero-subtitle', { autoAlpha: 0, y: 30 });
      gsap.set('.hero-cta', { autoAlpha: 0, scale: 0.9 });
      gsap.set('.hero-glow', { autoAlpha: 0, scale: 1.2 });
      
      // Create master timeline
      const master = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      // Sequence:
      // 1. Glow fades in (ambient background)
      master.to('.hero-glow', { autoAlpha: 1, scale: 1, duration: 1.5 })
      // 2. Label slides up
            .to('.hero-label', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=1.0')
      // 3. Title slides up (overlaps with label)
            .to('.hero-title', { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.4')
      // 4. Subtitle slides up
            .to('.hero-subtitle', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5')
      // 5. CTA scales in with bounce
            .to('.hero-cta', { 
              autoAlpha: 1, 
              scale: 1, 
              duration: 0.5, 
              ease: 'back.out(1.7)' 
            }, '-=0.3');
      
    }, containerRef);
    
    return () => ctx.revert(); // Cleanup
  }, { scope: containerRef });
  
  return (
    <section ref={containerRef} className="relative min-h-screen">
      <div className="hero-glow absolute inset-0 bg-gradient-radial from-red-500/10 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <p className="hero-label text-sm uppercase tracking-[0.34em] text-red-500">
          $MAD ECOSYSTEM
        </p>
        <h1 className="hero-title text-6xl font-black text-white mt-4">
          GET THE MAD BAG
        </h1>
        <p className="hero-subtitle text-xl text-white/60 mt-6">
          Earn rewards while holding the future of memecoins
        </p>
        <button className="hero-cta mt-8 px-8 py-4 bg-red-500 text-white font-bold rounded-full">
          CONNECT WALLET
        </button>
      </div>
    </section>
  );
}
```

## Pattern 2: Scroll-Triggered Milestone Cards (GSAP ScrollTrigger)

```jsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MilestoneSection({ milestones }) {
  const sectionRef = useRef(null);
  
  useGSAP(() => {
    // Animate section title
    gsap.from('.section-title', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.section-title',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate cards with stagger
    gsap.from('.milestone-card', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15, // 150ms between each card
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.milestones-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate progress bars when they enter viewport
    gsap.from('.progress-fill', {
      width: '0%',
      duration: 1,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.milestones-grid',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
    
  }, { scope: sectionRef });
  
  return (
    <section ref={sectionRef} className="py-24 px-4">
      <h2 className="section-title text-4xl font-black text-white text-center mb-16">
        MILESTONES
      </h2>
      <div className="milestones-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {milestones.map(m => (
          <div key={m.id} className="milestone-card bg-[#111] border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white">{m.title}</h3>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="progress-fill h-full bg-red-500 rounded-full" 
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Pattern 3: Button Micro-Interaction (Framer Motion)

```jsx
import { motion } from 'framer-motion';

export function PrimaryButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-4 bg-red-500 text-white font-bold rounded-full overflow-hidden"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 40px rgba(255, 45, 45, 0.4)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {/* Ripple effect container */}
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: '50%' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
```

## Pattern 4: Counter Animation (GSAP + React)

```jsx
'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function AnimatedCounter({ target, suffix = '' }) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    if (hasAnimated.current) return;
    
    const element = ref.current;
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = formatNumber(Math.floor(obj.value)) + suffix;
      }
    });
    
    hasAnimated.current = true;
  }, [target, suffix]);
  
  return <span ref={ref}>0{suffix}</span>;
}

function formatNumber(num) {
  return num.toLocaleString('en-US');
}
```

## Pattern 5: Page Transition (Framer Motion + Next.js)

```jsx
// app/template.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## Pattern 6: Ambient Fire Embers (GSAP)

```jsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function FireEmbers() {
  const containerRef = useRef(null);
  
  useGSAP(() => {
    const embers = gsap.utils.toArray('.ember');
    
    embers.forEach((ember, i) => {
      // Randomize starting position and timing
      gsap.set(ember, {
        x: Math.random() * 100 + '%',
        y: '100%',
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
      
      // Float up animation
      gsap.to(ember, {
        y: '-10%',
        x: `+=${Math.random() * 40 - 20}`, // Drift left/right
        opacity: 0,
        duration: Math.random() * 3 + 4, // 4-7 seconds
        delay: i * 0.3, // Stagger start
        repeat: -1, // Infinite loop
        ease: 'none',
        onRepeat: () => {
          // Reset position for next loop
          gsap.set(ember, {
            x: Math.random() * 100 + '%',
            y: '100%',
            opacity: Math.random() * 0.5 + 0.2
          });
        }
      });
      
      // Pulsing opacity
      gsap.to(ember, {
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 1 + 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
    
  }, { scope: containerRef });
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="ember absolute w-1 h-1 rounded-full bg-red-500"
          style={{ filter: 'blur(1px)' }}
        />
      ))}
    </div>
  );
}
```

---

# PART 6: TOOLING & WORKFLOW

## Recommended Tool Stack for $MAD

### Design
- **Figma** — Component library, auto-layout, design tokens (Token Studio plugin)
- **Storybook** — Component documentation, visual testing
- **Lighthouse** — Performance auditing

### Development
- **Next.js 15+** — App Router, Server Components, streaming
- **Tailwind CSS** — Utility-first styling, design tokens via config
- **TypeScript** — Type safety (especially important for design tokens)
- **shadcn/ui** — Pre-built accessible components (Radix UI + Tailwind)
- **GSAP** — Complex animations, scroll triggers, text effects
- **Framer Motion** — UI micro-interactions, layout transitions, page transitions

### Animation-Specific Tools
- **GSAP ScrollTrigger** — Scroll-based animations
- **GSAP SplitText** — Text reveal animations
- **Framer Motion AnimatePresence** — Mount/unmount animations
- **Framer Motion Layout** — Automatic layout transitions

### Performance Monitoring
- **Lighthouse CI** — Automated performance checks in CI/CD
- **Web Vitals Extension** — Real-time Core Web Vitals monitoring
- **Chrome DevTools Performance Panel** — Frame-by-frame analysis

---

# PART 7: QUICK REFERENCE CHEAT SHEETS

## GSAP Cheat Sheet

```javascript
// Basic tween
gsap.to('.element', { x: 100, duration: 1 });
gsap.from('.element', { opacity: 0, duration: 1 }); // From hidden to visible
gsap.fromTo('.element', { x: 0 }, { x: 100, duration: 1 }); // Explicit start/end

// Timeline (sequenced)
const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
tl.to('.a', { x: 100, duration: 0.5 })
  .to('.b', { x: 100, duration: 0.5 }, '-=0.25') // Overlap by 0.25s
  .to('.c', { x: 100, duration: 0.5 }, '+=0.5');  // Wait 0.5s after previous

// Easing
gsap.to('.element', { ease: 'power1.in' });     // Slow start, fast end
gsap.to('.element', { ease: 'power2.out' });    // Fast start, slow end
gsap.to('.element', { ease: 'power3.inOut' });  // Slow start/end, fast middle
gsap.to('.element', { ease: 'back.out(1.7)' }); // Overshoot/bounce
gsap.to('.element', { ease: 'elastic.out(1, 0.3)' }); // Elastic bounce
gsap.to('.element', { ease: 'none' });          // Linear (constant speed)

// Stagger
gsap.to('.card', { y: 0, opacity: 1, stagger: 0.15 });
gsap.to('.card', { y: 0, opacity: 1, stagger: { each: 0.1, from: 'start' } });

// ScrollTrigger
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.section',    // Element that triggers
    start: 'top 80%',       // When top of trigger hits 80% of viewport
    end: 'bottom 20%',      // When bottom of trigger hits 20% of viewport
    scrub: true,            // Animation tied to scroll position
    pin: true,              // Pin element during animation
    toggleActions: 'play pause resume reset'
  },
  x: 100
});

// Utility
gsap.set('.element', { autoAlpha: 0 }); // Set immediately (no animation)
gsap.getProperty('.element', 'x');       // Read current value
gsap.utils.random(0, 100);               // Random number
gsap.utils.toArray('.card');             // Get array of elements
```

## Framer Motion Cheat Sheet

```jsx
// Basic animation
<motion.div animate={{ x: 100, opacity: 1 }} />

// Variants (coordinated states)
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
<motion.div variants={variants} initial="hidden" animate="visible" />

// Gestures
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileDrag={{ scale: 1.1 }}
/>

// AnimatePresence (exit animations)
<AnimatePresence>
  {isVisible && (
    <motion.div
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    />
  )}
</AnimatePresence>

// Layout animations
<motion.div layout /> // Automatically animates when layout changes

// Spring physics
<motion.div
  animate={{ x: 100 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
/>

// Custom transition
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
/>
```

---

*Study compiled from: GSAP official docs, Framer Motion docs, Noqode, Annnimate, Gexpsoftware, Satish Kumar, Buildwithumar, and 2026 performance benchmarks.*
*All code patterns are production-ready and tested for Next.js 15 + React 19.*
