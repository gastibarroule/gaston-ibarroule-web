import styles from "./styles.module.css";
import { HoverWords } from "./HoverWords";
import site from "@/data/site.json";
import projects from "@/data/projects.json";
// Removed experiment nav to avoid duplication with site header

export const metadata = {
  title: "Hero Wave Experiment",
  description: "Hover to distort the hero image like a sound wave.",
};

type Project = { title: string; slug: string; poster?: string | null; role?: string; year?: string };

function FeaturedFromData() {
  const list: Project[] = (projects as Project[]).filter((p) => p.poster).slice(0, 3);
  return (
    <section className={styles.featured}>
      <div className={styles.featuredHeaderRow}>
        <h2 className={styles.featuredTitle}>Featured</h2>
        <a className={styles.featuredButton} href="/projects">Show all projects</a>
      </div>
      <div className={styles.featuredDivider} />
      <div className={styles.featuredGrid}>
        {list.map((p) => (
          <a key={p.slug} className={styles.card} href={`/projects/${p.slug}`}>
            <img className={styles.cardImg} src={p.poster || ""} alt={p.title} />
            <div className={styles.cardMeta}>
              <div className={styles.cardTitle}>{p.title}</div>
              <div className={styles.cardSub}>{p.role}{p.year ? ` • ${p.year}` : ""}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Page() {
  const intro = (site as { homeIntro?: string }).homeIntro || "";
  return (
    <main className={styles.wrapper}>
      {/* Use global header; no local nav here */}

      <section className={styles.hero}>
        <div className={styles.copy}>
          <HoverWords text={intro} />
        </div>
      </section>

      <FeaturedFromData />

      {/* footer removed per request */}
    </main>
  );
}


