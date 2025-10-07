"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export type Project = {
  title: string;
  slug: string;
  role?: string | null;
  year?: string | null;
  poster?: string | null;
};

function groupByYear(projects: Project[]): Record<string, Project[]> {
  const map: Record<string, Project[]> = {};
  for (const p of projects) {
    const key = p.year && /\d{4}/.test(p.year) ? p.year : "Unknown";
    if (!map[key]) map[key] = [];
    map[key].push(p);
  }
  return map;
}

function sortedYears(groups: Record<string, Project[]>): string[] {
  const years = Object.keys(groups);
  const nums = years
    .filter((y) => y !== "Unknown")
    .map((y) => parseInt(y, 10))
    .sort((a, b) => b - a)
    .map((n) => String(n));
  return [...nums, ...(groups["Unknown"] ? ["Unknown"] : [])];
}

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const roles = useMemo(() => {
    return Array.from(
      new Set(
        projects.flatMap((p) => (p.role ? p.role.split(",").map((r) => r.trim()) : []))
      )
    );
  }, [projects]);

  const filtered = useMemo(() => {
    if (!activeRole) return projects;
    return projects.filter((p) => (p.role || "").split(",").map((r) => r.trim()).includes(activeRole));
  }, [projects, activeRole]);

  const groups = useMemo(() => groupByYear(filtered), [filtered]);
  const years = useMemo(() => sortedYears(groups), [groups]);

  const Y_UNKNOWN = "Unknown";
  const orderedYears = useMemo(() => years.filter((y) => y !== Y_UNKNOWN), [years]);
  const { leadingYears, suffixYears } = useMemo(() => {
    let splitIndex = orderedYears.length;
    for (let i = orderedYears.length - 1; i >= 0; i--) {
      const y = orderedYears[i];
      if ((groups[y]?.length ?? 0) < 4) {
        splitIndex = i;
      } else {
        break;
      }
    }
    return {
      leadingYears: orderedYears.slice(0, splitIndex),
      suffixYears: orderedYears.slice(splitIndex),
    };
  }, [orderedYears, groups]);

  const combinedLabel = useMemo(
    () => (suffixYears.length ? suffixYears.join(" • ") : null),
    [suffixYears]
  );
  const combinedProjects = useMemo(
    () => suffixYears.flatMap((y) => groups[y] || []),
    [suffixYears, groups]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`chip fx-enter ${activeRole ? "" : "chip--active scale-up"}`}
          onClick={() => setActiveRole(null)}
        >
          All
        </button>
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            className={`chip fx-enter ${activeRole === r ? "chip--active scale-up" : ""}`}
            onClick={() => setActiveRole((prev) => (prev === r ? null : r))}
          >
            {r}
          </button>
        ))}
      </div>

      {leadingYears.map((year) => (
        <YearRow key={year} year={year} projects={groups[year]} />
      ))}
      {combinedLabel ? (
        <YearRow
          key={`combined-${combinedLabel}`}
          year={combinedLabel}
          projects={combinedProjects}
        />
      ) : null}
      {years.includes(Y_UNKNOWN) ? (
        <YearRow key={Y_UNKNOWN} year={Y_UNKNOWN} projects={groups[Y_UNKNOWN]} />
      ) : null}
    </div>
  );
}

function YearRow({ year, projects }: { year: string; projects: Project[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    // Pure native mode – no JS smoothing initializer
  }, []);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy(e.key === "ArrowLeft" ? -1 : 1);
    }
  };

  // No pointer drag handlers in pure-native mode

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{year}</h2>
      <div className="border-t border-white/10"></div>
      <div className="relative">
        <div
          ref={scrollerRef}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-label={`Projects ${year}`}
          data-rowscroller="true"
          className="no-scrollbar overflow-x-auto snap-x snap-proximity -mx-4 px-4 lg:mx-0 lg:px-0 py-2 flex gap-4 overscroll-x-contain"
        >
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="block snap-start shrink-0 w-60">
              <div className="card aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded">
                {p.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.poster} alt={p.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="mt-2 text-sm">
                <div className="opacity-90 truncate" title={p.title}>{p.title}</div>
                <div className="text-muted text-xs truncate" title={`${p.role ?? ''}${p.year ? ` • ${p.year}` : ''}`}>
                  {p.role}{p.year ? ` • ${p.year}` : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button
          aria-label="Previous"
          className="arrow-btn absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center"
          onClick={() => scrollBy(-1)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
        </button>
        <button
          aria-label="Next"
          className="arrow-btn absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center"
          onClick={() => scrollBy(1)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
        </button>
      </div>
    </section>
  );
}
