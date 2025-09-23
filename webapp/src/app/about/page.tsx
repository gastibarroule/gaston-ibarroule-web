import styles from "./styles.module.css";
import { HoverWords } from "../experiments/hero-wave/HoverWords";
import site from "@/data/site.json";

export const metadata = { title: "About" };

type SiteData = { aboutText?: string };

export default function AboutPage() {
  const aboutText = (site as SiteData).aboutText || "";
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">About</h1>
      <div className={styles.grid}>
        <section className={styles.copy}>
          <HoverWords text={aboutText} variant="md" />
        </section>
        <aside className={styles.media}>
          <img
            src="/about/gaston-capadoccia.jpg"
            alt="Portrait of Gaston Ibarroule"
            className={styles.portrait}
            loading="eager"
            decoding="async"
          />
        </aside>
      </div>
    </div>
  );
}
