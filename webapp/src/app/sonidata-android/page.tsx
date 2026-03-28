"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

/* ── Config ──────────────────────────────────────────────────── */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3haFMZxSvvCYhwk3fIMgIcv8GWYo7_V9Nyl26fpOLsDggUcwgWWmO1Dzzt7ZKqnlp/exec";

/* ── Floating particles background ───────────────────────────── */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    const count = 40;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      if (!canvas) return;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 0.5,
          o: Math.random() * 0.15 + 0.03,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(61, 220, 132, ${p.o})`;
        ctx!.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", () => { resize(); init(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ── Main page ──────────────────────────────────────────────── */
export default function SonidataAndroidWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      if (!GOOGLE_SCRIPT_URL) {
        window.location.href = `mailto:sonidata.info@gmail.com?subject=Android%20Waitlist%20Signup&body=Please%20add%20me%20to%20the%20Sonidata%20Android%20waitlist.%0A%0AEmail:%20${encodeURIComponent(email)}`;
        setStatus("success");
        return;
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), timestamp: new Date().toISOString(), source: "website" }),
      });

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  return (
    <div className="flex flex-col items-center pt-2 pb-20 text-white selection:bg-emerald-500/20">

      {/* ── Hero Section ── */}
      <section className="w-full relative overflow-hidden -mt-10 mb-16 md:mb-24">
        <FloatingParticles />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] backdrop-blur-md text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Coming Soon
          </div>

          {/* Android icon */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl shadow-2xl shadow-emerald-500/10">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="md:w-14 md:h-14">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" fill="#3DDC84"/>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 leading-[1.1]">
            Sonidata for{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Android
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 font-light mb-4 max-w-xl">
            Professional UCS field recording is coming to Android. Get notified when it launches.
          </p>

          <p className="text-sm text-neutral-500 mb-10 max-w-md">
            I&apos;m migrating Sonidata for Android from the ground up — same pro-grade workflow, native performance, full UCS integration.
          </p>

          {/* ── Signup Form ── */}
          {status === "success" ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-6 max-w-md w-full animate-fade-in">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-2">You&apos;re on the list!</h3>
              <p className="text-neutral-400 text-sm">
                We&apos;ll notify you as soon as Sonidata for Android is ready. Keep an ear out.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="relative flex items-center bg-white/[0.05] border border-white/10 rounded-full overflow-hidden focus-within:border-emerald-500/40 transition-colors duration-200 shadow-lg shadow-black/20">
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white px-6 py-4 text-base outline-none placeholder:text-neutral-500"
                  style={{ borderRadius: "9999px" }}
                  disabled={status === "sending"}
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 sm:px-7 py-2.5 rounded-full mr-1.5 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  style={{ borderRadius: "9999px" }}
                >
                  {status === "sending" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Joining…
                    </span>
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="text-red-400 text-sm mt-3 text-center">{errorMsg}</p>
              )}
              <p className="text-neutral-600 text-xs mt-4 text-center">
                No spam, ever. We&apos;ll only email you about the Android launch.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── iOS badge ── */}
      <section className="w-full max-w-3xl mx-auto px-4 mb-24">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-[28px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-48 h-48 bg-white/[0.03] rounded-full blur-[60px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">Already on iOS?</h3>
              <p className="text-neutral-400 mb-5 max-w-md">
                Sonidata is available now on the App Store. Professional UCS field recording with everything you need — recording, tagging, export, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/sonidata"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:-translate-y-0.5 shadow-lg"
                  style={{ borderRadius: "9999px" }}
                >
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="w-full max-w-3xl mx-auto px-4">
        <div className="text-center">
          <p className="text-neutral-500 text-sm">
            Have questions about Sonidata for Android?{" "}
            <a href="mailto:sonidata.info@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2">
              Get in touch
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
