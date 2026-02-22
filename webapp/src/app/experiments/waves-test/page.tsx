import Link from "next/link";
import { WavesBackground } from "./WavesBackground";
import styles from "./styles.module.css";

export const metadata = {
  title: "Waves Background Test",
  description: "Experimental page testing animated waves background",
};

export default function WavesTestPage() {
  return (
    <div className={styles.wrapper}>
      {/* Waves canvas as full background */}
      <WavesBackground
        lineColor="rgba(234, 236, 238, 0.15)"
        backgroundColor="transparent"
        waveSpeedX={0.0125}
        waveSpeedY={0.01}
        waveAmpX={30}
        waveAmpY={20}
        xGap={20}
        yGap={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
      />

      {/* Content layered on top */}
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Waves Background</h1>
          <p className={styles.subtitle}>
            Interactive animated waves with cursor response
          </p>
          <p className={styles.description}>
            Move your cursor around to see the waves react. This is a full-viewport
            background implementation inspired by reactbits.dev/backgrounds/waves
          </p>
          <div className={styles.controls}>
            <Link href="/" className={styles.backLink}>
              ← Back to Home
            </Link>
            <Link href="/experiments/hero-wave" className={styles.backLink}>
              View Hero Wave
            </Link>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionText}>
            The waves are rendered on a canvas element positioned as a fixed background.
            Each wave line is made up of points that follow spring physics, creating
            smooth, organic movement. When you move your cursor, nearby points are
            pushed away, creating an interactive ripple effect.
          </p>
        </section>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Canvas Animation</h3>
            <p className={styles.cardText}>
              Uses requestAnimationFrame for smooth 60fps rendering across the
              entire viewport.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Spring Physics</h3>
            <p className={styles.cardText}>
              Each point uses tension and friction to create natural, flowing
              movement patterns.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Cursor Interaction</h3>
            <p className={styles.cardText}>
              Wave points detect mouse proximity and react with repulsive forces
              for dynamic interaction.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Responsive Design</h3>
            <p className={styles.cardText}>
              Automatically adapts to window size changes and maintains
              performance across devices.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Theme Integration</h3>
            <p className={styles.cardText}>
              Waves use your existing CSS custom properties for seamless
              integration with the dark theme.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Performance Optimized</h3>
            <p className={styles.cardText}>
              Efficient rendering and cleanup prevent memory leaks and ensure
              smooth operation.
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Implementation Details</h2>
          <p className={styles.sectionText}>
            This is a client-side React component that can be easily integrated
            into any page. The waves sit at z-index: 0 as a fixed background, while
            all your content is positioned at z-index: 10 or higher to appear on top.
            The component is fully customizable with props for colors, speeds,
            amplitudes, and physics parameters.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>Waves Background Test • Gaston Ibarroule Portfolio</p>
          <p>Inspired by reactbits.dev/backgrounds/waves</p>
        </footer>
      </div>
    </div>
  );
}
