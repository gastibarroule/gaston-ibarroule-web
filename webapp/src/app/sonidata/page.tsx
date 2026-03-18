"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import siteData from "@/data/site.json";

/* ── Accordion item for FAQ ─────────────────────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-lg px-2 -mx-2 bg-transparent hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-white/50 group-hover:text-white/80`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out px-2`}
        style={{ maxHeight: isOpen ? "200px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pb-6 text-neutral-400 leading-relaxed max-w-2xl">{answer}</p>
      </div>
    </div>
  );
}

/* ── OS-aware download buttons ──────────────────────────────── */
const PRIMARY = "w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-semibold transition-transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2";
const SECONDARY = "w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-semibold transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2";

function DownloadButtons() {
  const [os, setOs] = useState<"mac" | "win" | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("mac")) setOs("mac");
    else if (ua.includes("win")) setOs("win");
    else setOs("mac"); // default
  }, []);

  const macBtn = (
    <div className="flex flex-col items-center gap-1.5">
      <a href="/downloads/Sonidata_Embed_macOS.dmg" className={os === "win" ? SECONDARY : PRIMARY}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        <span>Download for macOS</span>
      </a>
      <a
        href="/downloads/Sonidata_Embed_1.0.0_universal.dmg"
        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-2"
      >
        Intel Mac? Download Universal build
      </a>
    </div>
  );

  const winBtn = (
    <a href="/downloads/Sonidata_Embed_Windows.exe" className={os === "win" ? PRIMARY : SECONDARY}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
      <span>Download for Windows</span>
    </a>
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
      {os === "win" ? <>{winBtn}{macBtn}</> : <>{macBtn}{winBtn}</>}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function SonidataSupport() {
  const s = siteData.sonidataSupport || {
    title: "Sonidata",
    subtitle: "Pro Field Recording.\nSimplified.",
    email: "sonidata.info@gmail.com",
    faqs: [],
    docs: [],
    version: "",
    lastUpdated: "",
  };
  const faqs = s.faqs;

  return (
    <div className="flex flex-col items-center pt-2 pb-20 text-white selection:bg-white/20">

      {/* Hero Section — Mobile: full-bleed blurred screenshot bg / Desktop: side-by-side */}

      {/* ── Mobile Hero ── */}
      <section className="md:hidden w-full relative overflow-hidden -mt-10 mb-16">
        {/* Logo background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Image
            src="/sonidata/logo.png"
            alt=""
            width={600}
            height={600}
            className="w-[80%] max-w-[400px] h-auto opacity-[0.08] blur-[2px]"
            priority
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/60 via-transparent to-[var(--bg)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16">
          <div className="inline-block px-3 py-1 mb-5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Official Support
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3 leading-tight">
            Sonidata
          </h1>
          <p className="text-xl text-neutral-300 font-light mb-8">
            UCS Field Recorder
          </p>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <a
              href={`mailto:${s.email}`}
              className="w-full text-center bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5 shadow-lg hover:shadow-white/20"
            >
              Contact Support
            </a>
            <Link
              href="/sonidata/recording"
              className="w-full text-center bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/5"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* ── Desktop Hero ── */}
      <section className="hidden md:flex w-full max-w-5xl mx-auto mb-24 px-4 pt-0 flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-left z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Official Support
          </div>
          <h1 className="text-7xl font-bold tracking-tight mb-6 leading-tight">
            {s.title}
          </h1>
          <p className="text-2xl text-neutral-400 font-light mb-10 max-w-lg">
            UCS Field Recording.{"\n"}Simplified.
          </p>
          <div className="flex flex-row items-center gap-4 justify-start">
            <a
              href={`mailto:${s.email}`}
              className="text-center bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5 shadow-lg hover:shadow-white/20"
            >
              Contact Support
            </a>
            <Link
              href="/sonidata/recording"
              className="text-center bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white"
            >
              Read Documentation
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-md perspective-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-[6px] border-[#2a2a2d] bg-black transform rotate-y-[-5deg] rotate-x-[2deg] transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
            <Image
              src="/sonidata/1.png"
              alt="Sonidata App Demo"
              width={1284}
              height={2778}
              className="w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Feature Gallery Sidebar/Strip */}
      <section className="w-full mb-28 border-y border-white/5 py-16 overflow-hidden">
        <div className="container mx-auto px-4 mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">App Overview</h2>
          <div className="text-sm text-neutral-500 hidden sm:block">Swipe to explore</div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="flex gap-6 overflow-x-auto px-4 pb-8 snap-x snap-mandatory overscroll-x-contain container mx-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="shrink-0 w-[260px] sm:w-[320px] snap-center rounded-[24px] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl transition-all hover:border-white/20 cursor-grab active:cursor-grabbing group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <Image
                src={`/sonidata/${num}.png`}
                alt={`Sonidata feature ${num}`}
                width={1284}
                height={2778}
                className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Desktop App Download */}
      <section id="download" className="w-full max-w-4xl mx-auto px-4 mb-28 scroll-mt-24">
        <div className="bg-neutral-900/50 border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Download Sonidata Embed (Desktop)</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              The missing link in your field recording workflow. Burn your iOS field metadata straight into your WAVs.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex flex-col items-center gap-2 max-w-[200px] text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold mb-1">1</div>
              <p className="text-sm text-neutral-300">Export ZIP from iOS</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-white/20" />
            <div className="flex flex-col items-center gap-2 max-w-[200px] text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold mb-1">2</div>
              <p className="text-sm text-neutral-300">Drop ZIP and WAVs here</p>
            </div>
            <div className="hidden md:block w-8 h-px bg-white/20" />
            <div className="flex flex-col items-center gap-2 max-w-[200px] text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold mb-1">3</div>
              <p className="text-sm text-neutral-300">Embed!</p>
            </div>
          </div>

          <DownloadButtons />
          
          <p className="text-center text-sm text-neutral-500 max-w-lg mx-auto">
            Sonidata Embed requires the Pro version of the Sonidata iOS app to unlock full export functionality.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full max-w-3xl mx-auto px-4 mb-24 scroll-mt-24">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
          <p className="text-neutral-400 font-light">
            Everything you need to know about setting up and using Sonidata for your field recordings.
          </p>
        </div>

        <div className="border-t border-white/10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full max-w-4xl mx-auto px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1c1c1e] pointer-events-none -z-10" />
        <div className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-white/5 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/5 rounded-full blur-[60px] pointer-events-none" />

          <h2 className="text-3xl font-semibold mb-4 text-white">Need personal assistance?</h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto text-lg font-light">
            Our support team is ready to help you troubleshoot, optimize your workflow, or receive bug reports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`mailto:${s.email}`}
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Email Support
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
