"use client";
import React, { useEffect, useRef } from "react";

type Props = { html: string };

type ScriptWithLoaded = HTMLScriptElement & { _loaded?: boolean };

type InstagramGlobal = {
  Embeds?: { process?: () => void };
};

declare global {
  interface Window {
    instgrm?: InstagramGlobal;
  }
}

function toAbsoluteUrl(src: string): string {
  return src.startsWith("//") ? "https:" + src : src;
}

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const url = toAbsoluteUrl(src);
      const existing = document.querySelector(
        `script[src="${url}"]`
      ) as ScriptWithLoaded | null;

      if (existing && existing._loaded) {
        resolve();
        return;
      }

      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => resolve());
        return;
      }

      const scriptEl = document.createElement("script") as ScriptWithLoaded;
      scriptEl.src = url;
      scriptEl.async = true;
      scriptEl._loaded = false;
      scriptEl.addEventListener("load", () => {
        scriptEl._loaded = true;
        resolve();
      });
      scriptEl.addEventListener("error", () => resolve());
      document.head.appendChild(scriptEl);
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
          window.instgrm?.Embeds?.process?.();
        } catch {
          // ignore best-effort third-party processing errors
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
