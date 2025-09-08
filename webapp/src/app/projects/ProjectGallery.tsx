"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function ProjectGallery({ images }: { images: string[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const quickToRef = useRef<((value: number) => void) | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    quickToRef.current = null; // disable GSAP smoothing; use native
  }, []);

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return; // no overflow
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const scale = e.deltaMode === 1 ? 30 : e.deltaMode === 2 ? 120 : 1;
    const dx = e.deltaX * scale;
    const dy = e.deltaY * scale;
    const intentThreshold = 4;
    const isHorizontalIntent = (Math.abs(dx) - Math.abs(dy) > intentThreshold) || e.shiftKey;
    if (!isHorizontalIntent) return; // allow vertical page scroll
    const horiz = dx !== 0 ? dx : e.shiftKey ? dy : 0;
    if (horiz === 0) return;
    const canLeft = el.scrollLeft > 0;
    const canRight = el.scrollLeft < max;
    const intendsLeft = horiz < 0;
    const intendsRight = horiz > 0;
    const shouldHijack = (intendsLeft && canLeft) || (intendsRight && canRight);
    if (!shouldHijack) return;
    e.preventDefault();
    el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + horiz));
  };

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    let target = el.scrollLeft + amount;
    if (target < 0) target = 0;
    if (target > max) target = max;
    if (quickToRef.current) quickToRef.current(target);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onWheel={onWheel}
        className="no-scrollbar overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 py-2 flex gap-4 overscroll-contain scroll-x"
      >
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            className="snap-start shrink-0 w-full group"
            aria-label={`Open image ${idx + 1}`}
            onClick={() => { setLightboxIndex(idx); setIsLightboxOpen(true); }}
          >
            <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Gallery image" className="w-full h-full object-cover group-hover:opacity-95" />
            </div>
          </button>
        ))}
      </div>
      <button aria-label="Previous" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/20 bg-black/30 hover:bg-black/40 flex items-center justify-center" onClick={() => scrollBy(-1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
      </button>
      <button aria-label="Next" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/20 bg-black/30 hover:bg-black/40 flex items-center justify-center" onClick={() => scrollBy(1)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
      </button>

      {isLightboxOpen ? (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onIndexChange={(i) => setLightboxIndex(i)}
        />
      ) : null}
    </div>
  );
}

function Lightbox({ images, index, onClose, onIndexChange }: { images: string[]; index: number; onClose: () => void; onIndexChange: (i: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(Math.min(images.length - 1, index + 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
    };
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [images.length, index, onClose, onIndexChange]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 max-w-5xl w-[90vw]">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute -top-10 right-0 h-8 w-8 rounded-full border border-white/30 bg-black/60 hover:bg-black/70 flex items-center justify-center"
        >
          ×
        </button>
        <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index]} alt="Expanded image" className="w-full h-full object-contain bg-black" />
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <button type="button" className="px-3 py-1 rounded border border-white/20" onClick={() => onIndexChange(Math.max(0, index - 1))} disabled={index === 0}>
            Prev
          </button>
          <span>
            {index + 1} / {images.length}
          </span>
          <button type="button" className="px-3 py-1 rounded border border-white/20" onClick={() => onIndexChange(Math.min(images.length - 1, index + 1))} disabled={index === images.length - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


