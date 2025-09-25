import styles from "./experiments/hero-wave/styles.module.css";
import { HoverWords } from "./experiments/hero-wave/HoverWords";
import site from "@/data/site.json";
import projects from "@/data/projects.json";
import Link from "next/link";

export const metadata = {
  title: "Home",
  description: "Hover to distort the hero image like a sound wave.",
};

type Project = { title: string; slug: string; poster?: string | null; role?: string; year?: string; featured?: boolean };

function FeaturedFromData() {
  const data = projects as Project[];
  const primary = data.filter((p) => p.featured && p.poster).slice(0, 4);
  const fallback = data.filter((p) => !primary.includes(p) && p.poster).slice(0, 4 - primary.length);
  const list: Project[] = [...primary, ...fallback].slice(0, 4);
  return (
    <section className={styles.featured}>
      <div className={styles.featuredHeaderRow}>
        <h2 className={styles.featuredTitle}>Featured</h2>
        <Link className="btn btn-outline fx-enter" href="/projects">Show all projects</Link>
      </div>
      <div className={styles.featuredDivider} />
      <div className={styles.featuredGrid}>
        {list.map((p) => (
          <Link key={p.slug} className={styles.card} href={`/projects/${p.slug}`}>
            <img className={styles.cardImg} src={p.poster || ""} alt={p.title} />
            <div className={styles.cardMeta}>
              <div className={styles.cardTitle}>{p.title}</div>
              <div className={styles.cardSub}>{p.role}{p.year ? ` • ${p.year}` : ""}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const intro = (site as { homeIntro?: string }).homeIntro || "";
  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.copy}>
          <HoverWords text={intro} interactive={false} sequence="none" />
        </div>
      </section>

      <FeaturedFromData />
    </main>
  );
}
