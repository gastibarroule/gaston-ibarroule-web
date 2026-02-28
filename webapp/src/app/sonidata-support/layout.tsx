"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import siteData from "@/data/site.json";

/* ── Types ──────────────────────────────────────────────────── */
type DocSection = {
    id: string;
    title: string;
    icon: string;
};

/* ── Sidebar nav item ───────────────────────────────────────── */
function SidebarLink({ doc, isActive }: { doc: DocSection; isActive: boolean }) {
    return (
        <Link
            href={`/sonidata-support/${doc.id}`}
            className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] transition-all duration-150 group ${isActive
                ? "bg-white/8 text-white font-medium"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
                }`}
        >
            <span className={`text-[15px] shrink-0 transition-all ${isActive ? "" : "grayscale group-hover:grayscale-0"}`}>{doc.icon}</span>
            <span className="truncate">{doc.title}</span>
        </Link>
    );
}

/* ── Docs layout ────────────────────────────────────────────── */
export default function SonidataSupportLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const s = siteData.sonidataSupport;
    const docs = (s as unknown as { docs?: DocSection[] }).docs || [];

    /* Is the user on the landing page or a doc subpage? */
    const isLanding = pathname === "/sonidata-support" || pathname === "/sonidata-support/";
    const currentSlug = pathname.split("/").pop();

    /* Extra sidebar sections */
    const faqSection = { id: "faq", title: "FAQ", icon: "💬" };
    const allNavItems = [...docs, faqSection];

    /* Mobile chips scroll hint */
    const mobileChipsRef = useRef<HTMLDivElement>(null);
    const [showHintArrow, setShowHintArrow] = useState(false);

    useEffect(() => {
        const el = mobileChipsRef.current;
        if (!el || isLanding) return;

        const prefersReduced =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isDesktop =
            typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

        const shouldHint = !prefersReduced && !isDesktop && el.scrollWidth > el.clientWidth;
        setShowHintArrow(shouldHint);

        let t1: number | undefined;
        let t2: number | undefined;

        if (shouldHint) {
            const to = Math.min(64, el.scrollWidth - el.clientWidth);
            t1 = window.setTimeout(() => {
                el.scrollTo({ left: to, behavior: "smooth" });
                t2 = window.setTimeout(() => {
                    el.scrollTo({ left: 0, behavior: "smooth" });
                }, 900);
            }, 600);
        }

        const onScroll = () => {
            if (el.scrollLeft > 4) setShowHintArrow(false);
        };
        el.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            if (t1) window.clearTimeout(t1);
            if (t2) window.clearTimeout(t2);
            el.removeEventListener("scroll", onScroll);
        };
    }, [isLanding, allNavItems.length]);

    return (
        <div className="flex flex-col text-white selection:bg-white/20">
            {isLanding ? (
                /* Landing page renders full-width without sidebar */
                <>{children}</>
            ) : (
                /* Doc subpages get the sidebar layout */
                <div className="flex flex-col gap-0 relative min-h-[calc(100vh-160px)]">

                    {/* ── Mobile doc index ── */}
                    <div className="lg:hidden -mt-8 mb-6">
                        <div className="-mx-6 px-6 pt-6 pb-4">
                            <h2 className="text-lg font-semibold mb-1">Documentation</h2>
                            <p className="text-sm text-neutral-500 mb-3">Browse topics or swipe to explore.</p>
                            <div className="relative">
                                <div ref={mobileChipsRef} className="chips-row no-scrollbar overflow-x-auto snap-x snap-proximity -mx-2 px-2 py-2 flex gap-2 overscroll-x-contain">
                                    <Link
                                        href="/sonidata-support"
                                        className="chip chip--all shrink-0 snap-start flex items-center gap-1.5"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6" />
                                        </svg>
                                        Back
                                    </Link>
                                    {allNavItems.map((doc) => {
                                        const active = currentSlug === doc.id;
                                        return (
                                            <Link
                                                key={doc.id}
                                                href={`/sonidata-support/${doc.id}`}
                                                className={`chip shrink-0 snap-start flex items-center gap-1.5 ${active ? "chip--active" : ""}`}
                                            >
                                                <span>{doc.icon}</span>
                                                <span className="whitespace-nowrap">{doc.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {showHintArrow ? (
                                    <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-8 px-2 rounded-[10px] border border-white/10 bg-black/30 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-0">

                        {/* ── Left sidebar ──────────────────────────── */}
                        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/6 pr-6 -ml-2">
                            <nav className="sticky top-24 space-y-0.5 pb-8">
                                <Link
                                    href="/sonidata-support"
                                    className="flex items-center gap-2 text-[13px] text-neutral-600 hover:text-neutral-300 transition-colors mb-4 px-3 py-1"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Back to Sonidata
                                </Link>

                                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 px-3 mb-2">
                                    Documentation
                                </div>

                                {allNavItems.map((doc) => (
                                    <SidebarLink
                                        key={doc.id}
                                        doc={doc}
                                        isActive={currentSlug === doc.id}
                                    />
                                ))}

                                {/* Sidebar footer */}
                                <div className="border-t border-white/6 mt-6 pt-5 px-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] font-mono text-neutral-600">
                                            v{(s as unknown as { version?: string }).version}
                                        </span>
                                    </div>
                                    <a
                                        href={`mailto:${s.email}`}
                                        className="text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors flex items-center gap-1.5"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        {s.email}
                                    </a>
                                </div>
                            </nav>
                        </aside>

                        {/* ── Main content ──────────────────────────── */}
                        <div className="flex-1 min-w-0 lg:pl-8">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
