"use client";

import Image from "next/image";
import { useState } from "react";
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

/* ── Types for documentation content blocks ─────────────────── */
type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "code"; text: string }
  | { type: "tip"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

type DocSection = {
  id: string;
  title: string;
  icon: string;
  content: ContentBlock[];
};

/* ── Content block renderer ─────────────────────────────────── */
function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-neutral-400 leading-relaxed mb-4">{block.text}</p>;

    case "heading":
      return <h4 className="text-white font-semibold text-base mt-6 mb-2">{block.text}</h4>;

    case "code":
      return (
        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 mb-4 font-mono text-sm text-neutral-300 overflow-x-auto">
          {block.text}
        </div>
      );

    case "tip":
      return (
        <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 mb-4">
          <span className="shrink-0 mt-0.5 text-neutral-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>
          <p className="text-neutral-400 text-sm leading-relaxed">{block.text}</p>
        </div>
      );

    case "steps":
      return (
        <ol className="list-none space-y-3 mb-4">
          {block.items.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/70 text-xs flex items-center justify-center font-semibold mt-0.5">
                {i + 1}
              </span>
              <span className="text-neutral-400 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className="overflow-x-auto mb-4 rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-white/80 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-neutral-400 whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

/* ── Collapsible documentation section ──────────────────────── */
function DocSectionCard({ section }: { section: DocSection }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${isOpen
          ? "bg-white/[0.03] border-white/15 shadow-lg"
          : "bg-transparent border-white/8 hover:border-white/15 hover:bg-white/[0.02]"
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
      >
        <span className="text-2xl shrink-0">{section.icon}</span>
        <span className="flex-1 text-white font-semibold text-lg">{section.title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-white/40`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? "2000px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-white/10 pt-5">
            {section.content.map((block, i) => (
              <ContentBlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      </div>
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
  const docs = (s as { docs?: DocSection[] }).docs || [];

  return (
    <div className="flex flex-col items-center pt-8 pb-20 text-white selection:bg-white/20">

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto mb-24 px-4 pt-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center md:text-left z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Official Support
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            {s.title}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-light mb-10 max-w-lg mx-auto md:mx-0 whitespace-pre-line">
            {s.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a
              href={`mailto:${s.email}`}
              className="w-full sm:w-auto text-center bg-white text-black px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5 shadow-lg hover:shadow-white/20"
            >
              Contact Support
            </a>
            <a
              href="#docs"
              className="w-full sm:w-auto text-center bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white"
            >
              Read Documentation
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-xs md:max-w-md perspective-1000">
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
      <section className="w-full mb-28 border-y border-white/5 bg-black/20 backdrop-blur-sm py-16 overflow-hidden">
        <div className="container mx-auto px-4 mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">App Overview</h2>
          <div className="text-sm text-neutral-500 hidden sm:block">Swipe to explore</div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="flex gap-6 overflow-x-auto px-4 pb-8 snap-x snap-mandatory overscroll-x-contain container mx-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
          {[2, 3, 4, 5, 6].map((num) => (
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

      {/* Documentation Navigation */}
      {docs.length > 0 && (
        <section id="docs" className="w-full max-w-3xl mx-auto px-4 mb-16 scroll-mt-24">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Documentation</h2>
            <p className="text-neutral-400 font-light">
              Complete guide to every feature in Sonidata — tap any section to expand.
            </p>
            {(s as { version?: string; lastUpdated?: string }).version && (
              <div className="flex items-center gap-3 mt-4">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-400">
                  v{(s as { version?: string }).version}
                </span>
                {(s as { lastUpdated?: string }).lastUpdated && (
                  <span className="text-xs text-neutral-500">
                    Updated {(s as { lastUpdated?: string }).lastUpdated}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {docs.map((doc) => (
              <a
                key={doc.id}
                href={`#${doc.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <span className="text-base">{doc.icon}</span>
                {doc.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Documentation Sections */}
      {docs.length > 0 && (
        <section className="w-full max-w-3xl mx-auto px-4 mb-24">
          <div className="space-y-3">
            {docs.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <DocSectionCard section={section} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ / Documentation Section */}
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
