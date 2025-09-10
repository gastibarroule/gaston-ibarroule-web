import type { Metadata } from "next";
import projects from "@/data/projects.json";
import ProjectGallery from "../../projects/ProjectGallery";
import ProjectGalleryStack from "../../projects/ProjectGalleryStack";

type Project = {
  title: string;
  slug: string;
  role?: string | null;
  year?: string | null;
  poster?: string | null;
  images?: string[];
  videoUrl?: string | null;
  content?: string;
};

export async function generateStaticParams() {
  return (projects as Project[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = (projects as Project[]).find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} – Projects` : "Project",
  };
}

function toEmbedUrl(raw?: string | null): string | null {
  if (!raw) return null;
  const u = raw.trim();
  try {
    const url = new URL(u);
    const host = url.hostname.toLowerCase();
    // YouTube variants → embed
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      if (u.includes("/embed/")) return u; // already embed
      let id = "";
      if (host.includes("youtu.be")) {
        id = url.pathname.replace(/^\//, "");
      } else {
        id = url.searchParams.get("v") || "";
        if (!id && url.pathname.startsWith("/shorts/")) {
          const parts = url.pathname.split("/");
          id = parts[2] || "";
        }
      }
      return id ? `https://www.youtube.com/embed/${id}` : u;
    }
    // Vimeo page → player
    if (host.includes("vimeo.com")) {
      if (host.includes("player.vimeo.com")) return u;
      const m = url.pathname.match(/\/(\d+)/);
      if (m && m[1]) return `https://player.vimeo.com/video/${m[1]}`;
      return u;
    }
  } catch (_) {
    // fall through and return original
  }
  return u;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (projects as Project[]).find((p) => p.slug === slug);
  if (!project) {
    return <div>Not found</div>;
  }
  const embedUrl = toEmbedUrl(project.videoUrl);
  return (
    <article className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="self-center flex justify-center order-1">
          <div className="aspect-[4/5] h-[8cm] lg:h-[16cm] bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
            {project.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.poster} alt={project.title} className="w-full h-full object-cover" />
            ) : null}
          </div>
        </div>
        <div className="order-2">
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <div className="text-muted text-sm mt-1">{[project.role, project.year].filter(Boolean).join(" • ")}</div>
          {project.content ? (
            <div className="mt-3 text-sm whitespace-pre-wrap">{project.content}</div>
          ) : null}
          {/* Stacked gallery under description on small screens */}
          <div className="lg:hidden">
            <ProjectGalleryStack images={project.images || []} />
          </div>
        </div>
        {/* Horizontal gallery on large screens only */}
        <div className="h-full flex items-center hidden lg:flex order-3">
          <div className="w-full">
            <ProjectGallery images={project.images || []} />
          </div>
        </div>
        <div className="order-4">
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                title="Project video"
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}


