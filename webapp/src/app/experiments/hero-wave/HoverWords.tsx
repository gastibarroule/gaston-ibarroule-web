"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type HoverWordsProps = {
  text: string;
  variant?: 'md' | 'sm';
  className?: string;
  interactive?: boolean;
  sequence?: 'always' | 'mobile' | 'none';
};

export function HoverWords({ text, variant, className, interactive = true, sequence = 'mobile' }: HoverWordsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { root: null, rootMargin: "0px 0px -20% 0px", threshold: 0.15 }
    );
    io.observe(el);
    // Immediate visibility check for cases where IO may not fire initially (mobile)
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setInView(true);
      io.disconnect();
    }
    return () => io.disconnect();
  }, []);

  // One-time sequential activation of animated words, top-to-bottom
  useEffect(() => {
    if (!inView || hasRun.current) return;
    if (sequence === 'none') return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // Run sequence on mobile-like environments or small viewports
    // Broaden beyond strict AND to catch devices that report only one of the features,
    // and also trigger on small screens.
    const mqHoverNone = window.matchMedia("(hover: none)").matches;
    const mqAnyHoverNone = window.matchMedia("(any-hover: none)").matches;
    const mqCoarse = window.matchMedia("(pointer: coarse)").matches;
    const mqAnyCoarse = window.matchMedia("(any-pointer: coarse)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallViewport = window.matchMedia("(max-width: 900px)").matches || window.innerWidth < 900;
    const isMobileLike = mqHoverNone || mqAnyHoverNone || mqCoarse || mqAnyCoarse || hasTouch || isSmallViewport;
    if (!(sequence === 'always' || isMobileLike)) return;

    const el = containerRef.current;
    if (!el) return;

    // Select words that should animate (marked with wordActive in markup)
    let nodes = Array.from(el.querySelectorAll(`.${styles.wordActive}`)) as HTMLElement[];
    // Fallback: if none match (UA/text differences), sequence all words
    if (!nodes.length) {
      nodes = Array.from(el.querySelectorAll(`.${styles.word}`)) as HTMLElement[];
    }
    if (!nodes.length) return;

    // Lock to one-time
    hasRun.current = true;

    let i = 0;
    let stepTimer: number | undefined;
    let cleanupLastTimer: number | undefined;

    const next = () => {
      if (i > 0) nodes[i - 1]?.classList.remove(styles.isActive);
      if (i >= nodes.length) {
        // remove last highlight after a short beat
        cleanupLastTimer = window.setTimeout(() => {
          nodes[nodes.length - 1]?.classList.remove(styles.isActive);
          el.classList.remove(styles.sequencing);
        }, 520);
        return;
      }
      nodes[i].classList.add(styles.isActive);
      i += 1;
      stepTimer = window.setTimeout(next, 520);
    };

    // Allow layout/styles to flush before starting sequence (helps iOS Safari)
    const start = () => {
      // debug: count how many nodes will sequence
      try { console.log("[HoverWords] mobile sequence starting", { count: nodes.length }); } catch {}
      el.classList.add(styles.sequencing);
      next();
    };
    requestAnimationFrame(() => requestAnimationFrame(start));

    return () => {
      if (stepTimer) window.clearTimeout(stepTimer);
      if (cleanupLastTimer) window.clearTimeout(cleanupLastTimer);
      nodes.forEach((n) => n.classList.remove(styles.isActive));
      el.classList.remove(styles.sequencing);
    };
  }, [inView]);

  // Failsafe: if IntersectionObserver/inView path doesn't trigger on some mobile UAs,
  // start a one-time sequence shortly after mount on mobile-like devices.
  useEffect(() => {
    if (sequence === 'none') return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const mqHoverNone = window.matchMedia("(hover: none)").matches;
    const mqAnyHoverNone = window.matchMedia("(any-hover: none)").matches;
    const mqCoarse = window.matchMedia("(pointer: coarse)").matches;
    const mqAnyCoarse = window.matchMedia("(any-pointer: coarse)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallViewport = window.matchMedia("(max-width: 900px)").matches || window.innerWidth < 900;
    const isMobileLike = mqHoverNone || mqAnyHoverNone || mqCoarse || mqAnyCoarse || hasTouch || isSmallViewport;
    if (!(sequence === 'always' || isMobileLike)) return;

    const el = containerRef.current;
    if (!el) return;

    const timer = window.setTimeout(() => {
      if (hasRun.current) return;

      let nodes = Array.from(el.querySelectorAll(`.${styles.wordActive}`)) as HTMLElement[];
      if (!nodes.length) {
        nodes = Array.from(el.querySelectorAll(`.${styles.word}`)) as HTMLElement[];
      }
      if (!nodes.length) return;

      hasRun.current = true;
      el.classList.add(styles.sequencing);

      let i = 0;
      const step = () => {
        if (i > 0) nodes[i - 1]?.classList.remove(styles.isActive);
        if (i >= nodes.length) {
          window.setTimeout(() => {
            nodes[nodes.length - 1]?.classList.remove(styles.isActive);
            el.classList.remove(styles.sequencing);
          }, 520);
          return;
        }
        nodes[i].classList.add(styles.isActive);
        i += 1;
        window.setTimeout(step, 520);
      };

      requestAnimationFrame(() => requestAnimationFrame(step));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // Normalize a known typo for this experiment view only
  const normalized = text.replace(/installationsl\b/g, "installations");
  const tokens = normalized.split(/(\s+)/); // preserve whitespace tokens

  const result: React.ReactNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (/^\s+$/.test(tok)) {
      result.push(<span key={`s-${i}`}>{tok}</span>);
      continue;
    }

    const stripPunct = (s: string) => {
      const core = s.replace(/[.,;:!?]+$/g, "");
      const punct = s.slice(core.length);
      return { core, punct };
    };

    // Multi-word: "Sound designer"
    if (i + 2 < tokens.length) {
      const { core: c0 } = stripPunct(tok);
      const ws = tokens[i + 1];
      const { core: c2, punct: p2 } = stripPunct(tokens[i + 2]);
      if (!/^\s+$/.test(ws) === false) {
        // no-op, just clarity
      }
      if (!/^\s+$/.test(ws) && false) {
        // keep TS happy in inline transforms
      }
      if (/^\s+$/.test(ws) && c0 === "Sound" && c2 === "designer") {
        // Animate as a single word (including inner space)
        result.push(
          <span key={`sound-designer-${i}`} className={`${styles.word} ${styles.wordActive}`}>
            {"Sound designer"}
          </span>
        );
        if (p2) result.push(<span key={`p-sd-${i}`}>{p2}</span>);
        i += 2;
        continue;
      }

      // Multi-word: "art installation(s)" — animate as one unit including the trailing 's' when present
      if (/^\s+$/.test(ws) && c0.toLowerCase() === "art" && c2.toLowerCase().startsWith("installation")) {
        const pluralRest = c2.length > "installation".length ? c2.slice("installation".length) : ""; // e.g., 's'
        const label = `art installation${pluralRest}`;
        result.push(
          <span key={`art-installation-${i}`} className={`${styles.word} ${styles.wordActive}`}>
            {label}
          </span>
        );
        if (p2) result.push(<span key={`p-ai-${i}`} className={styles.word}>{p2}</span>);
        i += 2;
        continue;
      }
    }

    // Single-word targets and morphs
    const { core, punct } = stripPunct(tok);
    const coreLower = core.toLowerCase();
    const isAnim = (
      core === "Composer" ||
      core === "Argentina" ||
      core === "Berlin" ||
      coreLower === "film" ||
      coreLower === "series" ||
      coreLower === "documentary" ||
      core === "TV" ||
      coreLower === "ads"
    );

    if (core === "Argentina") {
      result.push(
        <span key={`arg-${i}`} className={`${styles.word} ${styles.wordActive} ${styles.wordFlag}`}>
          <span className={styles.wordFaceText}>Argentina</span>
          <span className={styles.wordFaceEmoji} role="img" aria-label="Argentina flag">🇦🇷</span>
        </span>
      );
      if (punct) result.push(<span key={`p-arg-${i}`} className={styles.word}>{punct}</span>);
      continue;
    }

    if (core === "Berlin") {
      result.push(
        <span key={`ber-${i}`} className={`${styles.word} ${styles.wordActive} ${styles.wordFlag}`}>
          <span className={styles.wordFaceText}>Berlin</span>
          <span className={styles.wordFaceEmoji} role="img" aria-label="German flag">🇩🇪</span>
        </span>
      );
      if (punct) result.push(<span key={`p-ber-${i}`} className={styles.word}>{punct}</span>);
      continue;
    }

    if (isAnim) {
      result.push(
        <span key={`w-${i}`} className={`${styles.word} ${styles.wordActive}`}>{core}</span>
      );
      if (punct) result.push(<span key={`p-${i}`} className={styles.word}>{punct}</span>);
      continue;
    }

    // Non-animated word (still part of content, but no scaling, no hover trigger)
    result.push(
      <span key={`w-${i}`} className={styles.word}>{tok}</span>
    );
  }

  const variantClass = variant === 'md' ? styles.wordsMd : variant === 'sm' ? styles.wordsSm : '';
  const interactivityClass = interactive ? "" : styles.noInteractive;
  return (
    <div
      ref={containerRef}
      className={`${styles.words} ${variantClass} ${interactivityClass} ${inView ? styles.inView : ""} ${className || ""}`.trim()}
      aria-label={text}
    >
      {result}
    </div>
  );
}
