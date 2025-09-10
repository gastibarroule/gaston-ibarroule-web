"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.mobileMenuBtn}
        aria-expanded={open}
        aria-controls="exp-mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.burger} aria-hidden>
          <span></span><span></span><span></span>
        </span>
        <span className="sr-only">Toggle navigation</span>
      </button>
      <div id="exp-mobile-menu" className={`${styles.mobileMenuPanel} ${open ? styles.mobileMenuPanelOpen : ""}`}>
        <a href="/projects" onClick={() => setOpen(false)}>Projects</a>
        <a href="/about" onClick={() => setOpen(false)}>About</a>
        <a href="/contact" onClick={() => setOpen(false)}>Contact</a>
      </div>
    </>
  );
}


