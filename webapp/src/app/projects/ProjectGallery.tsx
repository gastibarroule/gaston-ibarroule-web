"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectGallery({ images }: { images: string[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);


  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar overflow-x-auto snap-x snap-mandatory -mx-4 px-4 lg:mx-0 lg:px-0 py-2 flex gap-4 overscroll-x-contain"
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

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [index]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) onIndexChange(Math.max(0, Math.min(images.length - 1, i)));
  };

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
        <div className="relative">
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="no-scrollbar overflow-x-auto snap-x snap-mandatory flex w-[90vw] max-w-5xl"
          >
            {images.map((src, i) => (
              <div key={src} className="snap-center shrink-0 w-full">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Expanded image ${i + 1}`} className="w-full h-full object-contain bg-black" />
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Previous"
            className="arrow-btn absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center"
            onClick={() => onIndexChange(Math.max(0, index - 1))}
            disabled={index === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
          </button>
          <button
            aria-label="Next"
            className="arrow-btn absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center"
            onClick={() => onIndexChange(Math.min(images.length - 1, index + 1))}
            disabled={index === images.length - 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span>
            {index + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
