"use client";
import React from "react";

type Props = {
  permalink: string; // e.g. https://www.instagram.com/reel/XXXX/
  poster?: string | null; // fallback poster image (project.poster)
  caption?: string | null;
  aspect?: "9:16" | "16:9" | "1:1"; // default 9:16 for reels
};

function aspectPadding(aspect: Props["aspect"]) {
  switch (aspect) {
    case "16:9":
      return "56.25%";
    case "1:1":
      return "100%";
    case "9:16":
    default:
      // 9:16 = 177.78%
      return "177.78%";
  }
}

export default function StrippedInstagram({ permalink, poster, caption, aspect = "9:16" }: Props) {
  const pad = aspectPadding(aspect);
  return (
    <figure className="w-full">
      <a
        href={permalink}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Play Instagram video"
        className="group block"
        title="Open on Instagram"
      >
        <div
          className="relative w-full overflow-hidden rounded bg-black"
          style={{ paddingTop: pad }}
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt="Instagram video poster"
              className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
              decoding="async"
            />
          ) : null}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </a>
      {caption ? (
        <figcaption className="px-2 pt-2 text-center text-[14px] text-neutral-500 bg-white dark:bg-transparent">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
