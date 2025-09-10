"use client";

import { useState } from "react";

import Link from "next/link";

export function HeaderClient() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="global-mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-9 inline-flex items-center justify-center border border-white/10 rounded"
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="relative w-[18px] h-[12px] text-white/90">
          <span className="absolute inset-x-0 top-0 h-[2px] bg-current rounded" />
          <span className="absolute inset-x-0 top-[5px] h-[2px] bg-current rounded" />
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-current rounded" />
        </span>
      </button>
      <div
        id="global-mobile-menu"
        className={`absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden border border-white/10 rounded-md backdrop-blur bg-[rgba(28,28,30,0.7)] transition-[opacity,transform] duration-200 ${open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"}`}
      >
        <Link href="/projects" className="block px-4 py-3 opacity-90 hover:opacity-100">Projects</Link>
        <Link href="/about" className="block px-4 py-3 opacity-90 hover:opacity-100">About</Link>
        <Link href="/contact" className="block px-4 py-3 opacity-90 hover:opacity-100">Contact</Link>
      </div>
    </div>
  );
}
