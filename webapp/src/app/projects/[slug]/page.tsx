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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (projects as Project[]).find((p) => p.slug === slug);
  if (!project) {
    return <div>Not found</div>;
  }
  return (
    <article className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="self-center flex justify-center order-1">
          <div className="aspect-[4/5] h-[8cm] bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden">
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
          {project.videoUrl ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={project.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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


