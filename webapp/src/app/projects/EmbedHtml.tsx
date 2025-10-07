"use client";
import React, { useEffect, useRef } from "react";

type Props = { html: string };

interface LoadedScript extends HTMLScriptElement {
  _loaded?: boolean;
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const url = src.startsWith("//") ? "https:" + src : src;
      const existing = document.querySelector(`script[src="${url}"]`) as LoadedScript | null;
      if (existing?._loaded) {
        resolve();
        return;
      }
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => resolve());
        return;
      }
      const s = document.createElement("script") as LoadedScript;
      s.src = url;
      s.async = true;
      s._loaded = false;
      s.addEventListener("load", () => {
        s._loaded = true;
        resolve();
      });
      s.addEventListener("error", () => resolve());
      document.head.appendChild(s);
    } catch {
      resolve();
    }
  });
}

export default function EmbedHtml({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Insert raw HTML (scripts inside won't auto-execute in React)
    el.innerHTML = html;

    // Heuristics for Instagram embeds
    const needsInstagram =
      /instagram\.com\/(p|reel|tv)\//i.test(html) ||
      /class=["']instagram-media["']/i.test(html);

    // Remove any inline script tags to avoid duplicate loads
    const scriptsInHtml = Array.from(el.querySelectorAll("script"));
    scriptsInHtml.forEach((s) => s.parentElement?.removeChild(s));

    const ensure = async () => {
      if (needsInstagram) {
        await loadScriptOnce("https://www.instagram.com/embed.js");
        try {
          // @ts-expect-error: third-party global may not be typed
          window.instgrm?.Embeds?.process();
        } catch {
          // Silently fail if Instagram embed script is not available
        }
      }
    };
    ensure();
  }, [html]);

  return (
    <div className="rounded border border-white/10 bg-black/20 p-2">
      <div ref={containerRef} />
    </div>
  );
}
