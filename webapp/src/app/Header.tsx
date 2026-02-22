"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 header-bleed backdrop-saturate-150 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide inline-block uppercase text-xl">
          Gaston Ibarroule
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-base">
          <Link href="/projects" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">
            Projects
          </Link>
          <Link href="/about" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">
            About
          </Link>
          <Link href="/contact" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">
            Contact
          </Link>
          <Link href="/metasound-support" className="opacity-90 hover:opacity-100 px-3 py-2 rounded-[30px] fx-enter">
            Metasound
          </Link>
        </nav>

        <div className="md:hidden">
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
        </div>
      </div>

      {/* Mobile sub-row that displaces content and matches header/container width */}
      <div
        id="global-mobile-menu"
        className={`md:hidden border-t border-white/10 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}
      >
        <div className="container py-3">
          <div className="grid grid-cols-4 gap-2">
            <Link href="/projects" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">
              Projects
            </Link>
            <Link href="/about" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">
              About
            </Link>
            <Link href="/contact" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">
              Contact
            </Link>
            <Link href="/metasound-support" className="text-center px-3 py-2 rounded-[30px] fx-enter opacity-90 hover:opacity-100">
              Metasound
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
