"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export function ExperimentNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.navWrap}>
      <div className={styles.navBar}>
        <a href="/" className={styles.brand}>Gaston Ibarroule</a>
        <nav className={styles.navLinks}>
          <a href="/projects">Projects</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <button className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="exp-menu">
          Menu
        </button>
      </div>
      <div id="exp-menu" className={`${styles.menuPanel} ${open ? styles.menuPanelOpen : ""}`}>
        <a href="/projects" onClick={() => setOpen(false)}>Projects</a>
        <a href="/about" onClick={() => setOpen(false)}>About</a>
        <a href="/contact" onClick={() => setOpen(false)}>Contact</a>
      </div>
    </div>
  );
}


