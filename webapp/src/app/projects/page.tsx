import projects from "@/data/projects.json";
import ProjectsBrowser, { Project as ProjectType } from "./ProjectsBrowser";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const list = (projects as ProjectType[]).filter((p) => p.slug);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>
      <p className="text-muted">Browse the full list. Filter by role to narrow down the view.</p>
      <ProjectsBrowser projects={list} />
    </div>
  );
}


