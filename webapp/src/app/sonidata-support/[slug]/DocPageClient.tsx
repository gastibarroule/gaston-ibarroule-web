"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import siteData from "@/data/site.json";

/* ── Types ──────────────────────────────────────────────────── */
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
            return <p className="text-neutral-400 leading-[1.8] mb-5 text-[15px]">{block.text}</p>;

        case "heading":
            return (
                <h3
                    id={block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
                    className="text-white font-semibold text-lg mt-10 mb-4 flex items-center gap-2.5 scroll-mt-24"
                >
                    <span className="w-1 h-5 bg-white/15 rounded-full shrink-0" />
                    {block.text}
                </h3>
            );

        case "code":
            return (
                <div className="bg-black/50 border border-white/8 rounded-lg px-4 py-3 mb-5 font-mono text-[13px] text-neutral-300 overflow-x-auto leading-relaxed">
                    {block.text}
                </div>
            );

        case "tip":
            return (
                <div className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-lg px-4 py-3.5 mb-5">
                    <span className="shrink-0 mt-0.5 text-neutral-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </span>
                    <p className="text-neutral-500 text-[13px] leading-relaxed">{block.text}</p>
                </div>
            );

        case "steps":
            return (
                <ol className="list-none space-y-3 mb-5 ml-1">
                    {block.items.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-white/8 text-white/50 text-[11px] flex items-center justify-center font-semibold mt-0.5">
                                {i + 1}
                            </span>
                            <span className="text-neutral-400 leading-[1.75] text-[15px]">{step}</span>
                        </li>
                    ))}
                </ol>
            );

        case "table":
            return (
                <div className="overflow-x-auto mb-5 rounded-lg border border-white/8">
                    <table className="w-full text-[13px]">
                        <thead>
                            <tr className="border-b border-white/8 bg-white/[0.02]">
                                {block.headers.map((h, i) => (
                                    <th key={i} className="text-left px-4 py-2.5 text-white/50 font-semibold whitespace-nowrap uppercase tracking-wider text-[11px]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-white/5 last:border-0">
                                    {row.map((cell, ci) => (
                                        <td key={ci} className={`px-4 py-2.5 whitespace-nowrap ${ci === 0 ? "text-neutral-300 font-medium" : "text-neutral-500"}`}>{cell}</td>
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

/* ── FAQ Accordion ──────────────────────────────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left py-4 flex items-center justify-between focus:outline-none hover:bg-white/[0.02] transition-colors rounded-lg px-1"
            >
                <span className="text-[15px] font-medium text-white pr-4">{question}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""} text-white/30 shrink-0`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? "300px" : "0", opacity: isOpen ? 1 : 0 }}
            >
                <p className="pb-5 px-1 text-neutral-500 leading-relaxed text-[14px] max-w-2xl">{answer}</p>
            </div>
        </div>
    );
}

/* ── On This Page (right sidebar) ───────────────────────────── */
function OnThisPage({ headings }: { headings: string[] }) {
    if (headings.length === 0) return null;
    return (
        <aside className="hidden xl:block w-48 shrink-0">
            <nav className="sticky top-24 pl-6 border-l border-white/6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-3">
                    On this page
                </div>
                <div className="space-y-1.5">
                    {headings.map((h) => (
                        <a
                            key={h}
                            href={`#${h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                            className="block text-[12px] text-neutral-600 hover:text-neutral-300 transition-colors leading-snug"
                        >
                            {h}
                        </a>
                    ))}
                </div>
            </nav>
        </aside>
    );
}

/* ── Main doc page ──────────────────────────────────────────── */
export default function DocPageClient({ slug }: { slug: string }) {
    const s = siteData.sonidataSupport;
    const docs = (s as unknown as { docs?: DocSection[] }).docs || [];
    const faqs = s.faqs;

    /* ── Build navigation order (docs + faq) ──── */
    const allNavIds = [...docs.map(d => d.id), "faq"];
    const allNavItems = [...docs.map(d => ({ id: d.id, title: d.title, icon: d.icon })), { id: "faq", title: "FAQ", icon: "💬" }];
    const currentIndex = allNavIds.indexOf(slug);

    /* ── FAQ page ─────────────────────────────── */
    if (slug === "faq") {
        const prevItem = allNavItems[currentIndex - 1];
        return (
            <div className="flex gap-0">
                <article className="flex-1 min-w-0 max-w-3xl pb-20">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-[12px] text-neutral-600 mb-8">
                        <Link href="/sonidata-support" className="hover:text-neutral-300 transition-colors">Sonidata</Link>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 6 15 12 9 18" /></svg>
                        <span className="text-neutral-400">FAQ</span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h1>
                    <p className="text-neutral-500 text-[15px] mb-10">Everything you need to know about using Sonidata.</p>

                    <div className="border-t border-white/8">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>

                    {/* Prev/Next nav */}
                    <div className="mt-14 pt-8 border-t border-white/6 flex justify-between items-center">
                        {prevItem ? (
                            <Link href={`/sonidata-support/${prevItem.id}`} className="group flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                <span>{prevItem.icon} {prevItem.title}</span>
                            </Link>
                        ) : <div />}
                        <div />
                    </div>
                </article>
            </div>
        );
    }

    /* ── Regular doc page ─────────────────────── */
    const doc = docs.find(d => d.id === slug);
    if (!doc) {
        notFound();
    }

    /* Extract headings for "On this page" */
    const headings = doc.content
        .filter((b): b is { type: "heading"; text: string } => b.type === "heading")
        .map(b => b.text);

    /* Prev/next */
    const prevItem = currentIndex > 0 ? allNavItems[currentIndex - 1] : null;
    const nextItem = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : null;

    return (
        <div className="flex gap-0">
            <article className="flex-1 min-w-0 max-w-3xl pb-20">

                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[12px] text-neutral-600 mb-8">
                    <Link href="/sonidata-support" className="hover:text-neutral-300 transition-colors">Sonidata</Link>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 6 15 12 9 18" /></svg>
                    <span className="text-neutral-400">{doc.title}</span>
                </div>

                {/* Page title */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-3xl">{doc.icon}</span>
                        <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
                    </div>
                </div>

                {/* Content blocks */}
                <div className="leading-relaxed">
                    {doc.content.map((block, i) => (
                        <ContentBlockRenderer key={i} block={block} />
                    ))}
                </div>

                {/* Prev/Next nav */}
                <div className="mt-14 pt-8 border-t border-white/6 flex justify-between items-center">
                    {prevItem ? (
                        <Link href={`/sonidata-support/${prevItem.id}`} className="group flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            <span>{prevItem.icon} {prevItem.title}</span>
                        </Link>
                    ) : <div />}
                    {nextItem ? (
                        <Link href={`/sonidata-support/${nextItem.id}`} className="group flex items-center gap-2 text-[13px] text-neutral-500 hover:text-white transition-colors">
                            <span>{nextItem.icon} {nextItem.title}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                                <polyline points="9 6 15 12 9 18" />
                            </svg>
                        </Link>
                    ) : <div />}
                </div>
            </article>

            {/* Right sidebar — "On this page" */}
            <OnThisPage headings={headings} />
        </div>
    );
}
