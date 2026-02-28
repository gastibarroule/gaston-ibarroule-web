import siteData from "@/data/site.json";
import DocPageClient from "./DocPageClient";

type DocSection = {
    id: string;
    title: string;
    icon: string;
    content: unknown[];
};

/* Generate static params for all doc slugs + FAQ */
export function generateStaticParams() {
    const docs = (siteData.sonidataSupport as unknown as { docs?: DocSection[] }).docs || [];
    const slugs = [...docs.map(d => ({ slug: d.id })), { slug: "faq" }];
    return slugs;
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <DocPageClient slug={slug} />;
}
