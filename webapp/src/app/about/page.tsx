import site from "@/data/site.json";

export const metadata = { title: "About" };

type SiteData = { aboutText?: string };

export default function AboutPage() {
  const aboutText = (site as SiteData).aboutText || "";
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">About</h1>
      <div className="prose prose-invert max-w-none whitespace-pre-wrap">{aboutText}</div>
    </div>
  );
}


