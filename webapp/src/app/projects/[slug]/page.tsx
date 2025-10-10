import type { Metadata } from "next";
import projects from "@/data/projects.json";
import ProjectGallery from "../../projects/ProjectGallery";
import ProjectGalleryStack from "../../projects/ProjectGalleryStack";
import EmbedHtml from "../../projects/EmbedHtml";

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

function localVideoSrc(raw?: string | null): string | null {
  if (!raw) return null;
  const u = raw.trim();
  if (!u.startsWith("/")) return null;
  const lower = u.toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg") || lower.endsWith(".ogv")) return u;
  return null;
}

function mimeForVideo(src: string): string {
  const l = src.toLowerCase();
  if (l.endsWith(".webm")) return "video/webm";
  if (l.endsWith(".ogg") || l.endsWith(".ogv")) return "video/ogg";
  return "video/mp4";
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (projects as Project[]).find((p) => p.slug === slug);
  if (!project) {
    return <div>Not found</div>;
  }
  const isHtml = !!project.videoUrl && project.videoUrl.trim().includes("<");
  const fileVideo = isHtml ? null : localVideoSrc(project.videoUrl);
  const embedUrl = fileVideo || isHtml ? null : toEmbedUrl(project.videoUrl);
  return (
    <article className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="self-center flex justify-center order-1">
          <div className="aspect-[4/5] h-[8cm] lg:h-[16cm] bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
            {project.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.poster} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <span className="text-white/90 text-base font-semibold uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
                  COMING SOON
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="order-2">
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <div className="text-muted text-sm mt-1">{[project.role, project.year].filter(Boolean).join(" • ")}</div>
          {project.content ? (
            <div className="mt-3 text-sm whitespace-pre-wrap">{project.content}</div>
          ) : null}
        </div>
        {/* Horizontal gallery on large screens only */}
        <div className="h-full flex items-center hidden lg:flex order-3">
          <div className="w-full">
            <ProjectGallery images={project.images || []} />
          </div>
        </div>
        {(fileVideo || embedUrl || isHtml) ? (
          <div className="order-3 lg:order-4">
            {fileVideo ? (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <video
                  className="absolute inset-0 w-full h-full object-contain rounded border border-white/10 bg-black"
                  controls
                  preload="metadata"
                  poster={project.poster || undefined}
                >
                  <source src={fileVideo} type={mimeForVideo(fileVideo)} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : embedUrl ? (
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
            ) : (
              <EmbedHtml html={project.videoUrl || ""} />
            )}
          </div>
        ) : null}
        {/* Stacked gallery under description on small screens (moved below video) */}
        <div className="lg:hidden order-4">
          <ProjectGalleryStack images={project.images || []} />
        </div>
      </div>
    </article>
  );
}
