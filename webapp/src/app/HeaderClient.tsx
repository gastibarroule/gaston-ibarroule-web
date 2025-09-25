"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function HeaderClient() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the pathname changes (navigation occurs)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="global-mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-9 inline-flex items-center justify-center border border-white/10 rounded-[30px] fx-enter"
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
        className={`absolute left-1/2 -translate-x-1/2 top-full w-screen border-t border-white/10 backdrop-blur bg-[rgba(28,28,30,0.7)] transition-[opacity,transform] duration-200 ${open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"}`}
      >
        <div className="container py-3">
          <div className="grid grid-cols-3 gap-2">
            <Link href="/projects" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">Projects</Link>
            <Link href="/about" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">About</Link>
            <Link href="/contact" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
