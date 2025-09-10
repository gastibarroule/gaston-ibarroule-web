"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";

export function ExperimentNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.navWrap}>
      <div className={styles.navBar}>
        <Link href="/" className={styles.brand}>Gaston Ibarroule</Link>
        <nav className={styles.navLinks}>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <button className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="exp-menu">
          Menu
        </button>
      </div>
      <div id="exp-menu" className={`${styles.menuPanel} ${open ? styles.menuPanelOpen : ""}`}>
        <Link href="/projects" onClick={() => setOpen(false)}>Projects</Link>
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </div>
    </div>
  );
}
