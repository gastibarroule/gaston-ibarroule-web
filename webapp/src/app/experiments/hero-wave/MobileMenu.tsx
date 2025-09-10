"use client";

import { useState } from "react";
import styles from "./styles.module.css";

import Link from "next/link";

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
        <Link href="/projects" onClick={() => setOpen(false)}>Projects</Link>
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
      </div>
    </>
  );
}
