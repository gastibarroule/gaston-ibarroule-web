"use client";

import { useEffect, useState } from "react";

export default function ProjectGalleryStack({ images }: { images: string[] }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            className="group w-full text-left"
            aria-label={`Open image ${idx + 1}`}
            onClick={() => { setLightboxIndex(idx); setIsLightboxOpen(true); }}
          >
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Gallery image" className="w-full h-auto object-contain group-hover:opacity-95" />
            </div>
          </button>
        ))}
      </div>

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
        <div className="bg-black rounded overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[index]} alt="Expanded image" className="w-full h-auto object-contain" />
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


