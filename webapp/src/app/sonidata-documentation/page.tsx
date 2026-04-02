import Link from "next/link";
import siteData from "@/data/site.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sonidata Documentation",
  description: "Official guides, tutorials, and documentation for the Sonidata field recording app.",
};

type DocContent = { type?: string; text?: string };
type DocSection = { id: string; title: string; icon: string; content: DocContent[] };

export default function SonidataDocumentation() {
  const s = siteData.sonidataSupport;
  const docs = ((s as unknown as { docs: DocSection[] }).docs) || [];

  return (
    <div className="container max-w-5xl mx-auto px-4 pt-10 pb-24 text-white selection:bg-white/20">
      
      <div className="mb-8">
        <Link 
          href="/sonidata"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Sonidata
        </Link>
      </div>

      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
          Everything you need to know about setting up and using Sonidata for professional UCS field recording.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {docs.map((doc: DocSection) => {
          const firstParagraph = doc.content.find((c: DocContent) => c.type === "paragraph");
          const description = firstParagraph ? firstParagraph.text : "";
          
          return (
            <Link
              key={doc.id}
              href={`/sonidata/${doc.id}`}
              className="flex flex-col bg-neutral-900/40 border border-white/5 hover:border-white/15 hover:bg-neutral-800/40 transition-all rounded-[24px] p-8 group shadow-lg shadow-black/20"
            >
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 origin-left">
                {doc.icon}
              </div>
              <h2 className="text-xl font-semibold mb-3 tracking-tight">
                {doc.title}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                {description}
              </p>
            </Link>
          );
        })}
        
        {/* FAQ Card */}
        <Link
          href={`/sonidata/faq`}
          className="flex flex-col bg-neutral-900/40 border border-white/5 hover:border-white/15 hover:bg-neutral-800/40 transition-all rounded-[24px] p-8 group shadow-lg shadow-black/20"
        >
          <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 origin-left">
            💬
          </div>
          <h2 className="text-xl font-semibold mb-3 tracking-tight">
            FAQ
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
            Frequently asked questions, format details, and quick answers to common issues.
          </p>
        </Link>
      </div>

    </div>
  );
}
