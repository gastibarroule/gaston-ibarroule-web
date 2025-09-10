"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type HoverWordsProps = {
  text: string;
};

export function HoverWords({ text }: HoverWordsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

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
    return () => io.disconnect();
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

  return (
    <div ref={containerRef} className={`${styles.words} ${inView ? styles.inView : ""}`} aria-label={text}>
      {result}
    </div>
  );
}
