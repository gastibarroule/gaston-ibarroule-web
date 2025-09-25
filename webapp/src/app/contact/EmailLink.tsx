"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

type Props = {
  user: number[];    // obfuscated user part (encoded)
  domain: number[];  // obfuscated domain part (encoded)
  label?: string;    // fallback label before hydration
  className?: string;
};

function decodePart(codes: number[]): string {
  // Reverse the simple encoding applied on the server:
  // - original string reversed
  // - each char code +1
  // Here we -1 then reverse back.
  const chars = codes.map((c) => String.fromCharCode(c - 1));
  return chars.reverse().join("");
}

export default function EmailLink({ user, domain, label = "Email", className }: Props) {
  const [addr, setAddr] = useState<string | null>(null);

  const decoded = useMemo(() => {
    try {
      const u = decodePart(user);
      const d = decodePart(domain);
      if (!u || !d) return null;
      return `${u}@${d}`;
    } catch {
      return null;
    }
  }, [user, domain]);

  useEffect(() => {
    // Only assign on client to avoid exposing the full address in static HTML
    setAddr(decoded);
  }, [decoded]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!addr) return;
      // Ensure navigation even if some crawlers disable href
      e.preventDefault();
      window.location.href = `mailto:${addr}`;
    },
    [addr]
  );

  return (
    <a
      href={addr ? `mailto:${addr}` : undefined}
      onClick={onClick}
      className={className ?? "underline"}
      aria-label="email"
      // Rel intentionally omitted for mailto
    >
      {addr ?? label}
    </a>
  );
}
