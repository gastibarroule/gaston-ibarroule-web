"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export function GridOverlayToggle() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        type="button"
        className={styles.navLink}
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
      >
        {visible ? "Hide grid" : "Toggle grid"}
      </button>
      {visible ? <div className={styles.gridOverlay} aria-hidden /> : null}
    </>
  );
}


