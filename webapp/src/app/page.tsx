import Link from "next/link";
import projects from "@/data/projects.json";
import site from "@/data/site.json";

type Project = { title: string; slug: string; poster?: string | null };

export default function Home() {
  const featured = (projects as Project[]).slice(0, 6);
  const intro = (site as any).homeIntro || "";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Featured</h1>
        <Link className="px-4 py-2 rounded-md border border-white/15 opacity-90 hover:opacity-100" href="/projects">Show all projects</Link>
      </div>
      <p className="p-responsive text-muted whitespace-pre-line">{intro}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.slice(0, 2).map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="relative block">
            <div className="card aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded">
              {p.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.poster} alt={p.title} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="text-sm font-medium">{p.title}</div>
              {/* simple meta lookup */}
              <div className="text-xs text-muted">{(p as any).role}{(p as any).year ? ` • ${(p as any).year}` : ''}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
