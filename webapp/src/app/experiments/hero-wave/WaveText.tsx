"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type WaveTextProps = {
  text: string;
  intensity?: number; // 0..~0.12 recommended
  maxLines?: number;
};

export function WaveText({ text, intensity = 0.04, maxLines = 3 }: WaveTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  // Split text into lines with a simple greedy wrap in the render pass
  function wrapLines(ctx: CanvasRenderingContext2D, words: string[], maxWidth: number) {
    const lines: string[] = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines.slice(0, maxLines);
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setFallback(true);
      return;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true, powerPreference: "high-performance" });
    if (!gl) {
      setFallback(true);
      return;
    }

    // Offscreen canvas to draw the text texture
    const textCanvas = document.createElement("canvas");
    const tctx = textCanvas.getContext("2d")!;

    const vertexSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fragmentSrc = `
      precision mediump float;
      uniform sampler2D uTex;
      uniform float uTime;
      uniform float uHover;
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        float wave = sin((vUv.y + uTime * 0.9) * 12.0) * uIntensity * uHover;
        vec2 uv = vec2(vUv.x + wave, vUv.y);
        vec4 color = texture2D(uTex, uv);
        gl_FragColor = color;
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    function createProgram(vsSrc: string, fsSrc: string) {
      const vs = createShader(gl.VERTEX_SHADER, vsSrc);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) return null;
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Program link error", gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    }

    const program = createProgram(vertexSrc, fragmentSrc);
    if (!program) { setFallback(true); return; }
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, "position");
    const uTex = gl.getUniformLocation(program, "uTex");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uHover = gl.getUniformLocation(program, "uHover");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const quad = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let raf = 0;
    let startTime = performance.now();
    let hoverState = 0;
    let targetHover = 0;

    function onEnter() { targetHover = 1; }
    function onLeave() { targetHover = 0; }
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    function layoutAndDrawText() {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(160, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      tctx.setTransform(1, 0, 0, 1, 0, 0);
      tctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

      // Determine font size from width
      const base = width; // CSS px
      const fontPx = Math.max(40, Math.min(120, Math.floor(base * 0.12)));
      const lineGap = Math.floor(fontPx * 0.14);
      tctx.font = `600 ${Math.floor(fontPx * dpr)}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
      tctx.fillStyle = "rgba(230,231,234,1)"; // near-white
      tctx.textBaseline = "top";

      const maxTextWidth = Math.floor(textCanvas.width * 0.92);
      const words = text.split(/\s+/);
      // A temporary context for measuring at 1x scale
      const measureCtx = document.createElement("canvas").getContext("2d")!;
      measureCtx.font = `600 ${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial`;
      const lines = (function () {
        const arr: string[] = [];
        let line = "";
        for (let i = 0; i < words.length; i++) {
          const test = line ? line + " " + words[i] : words[i];
          if (measureCtx.measureText(test).width * dpr > maxTextWidth && line) {
            arr.push(line);
            line = words[i];
          } else {
            line = test;
          }
        }
        if (line) arr.push(line);
        return arr.slice(0, maxLines);
      })();

      // Draw centered vertically within the container
      let y = Math.floor((textCanvas.height - (lines.length * (fontPx * dpr + lineGap * dpr) - lineGap * dpr)) / 2);
      const x = Math.floor(textCanvas.width * 0.04);
      for (let i = 0; i < lines.length; i++) {
        tctx.fillText(lines[i], x, y);
        y += Math.floor(fontPx * dpr + lineGap * dpr);
      }

      // Upload to GL
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    }

    function render(now: number) {
      const t = (now - startTime) / 1000;
      hoverState += (targetHover - hoverState) * 0.12;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uHover, hoverState);
      gl.uniform1f(uIntensity, intensity);
      gl.uniform1i(uTex, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    }

    function onResize() {
      layoutAndDrawText();
    }

    layoutAndDrawText();
    startTime = performance.now();
    raf = requestAnimationFrame(render);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [text, intensity, maxLines]);

  if (fallback) {
    return (
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <h1 style={{ fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.98, letterSpacing: "-0.02em", margin: 0 }}>
          {text}
        </h1>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "min(36vh, 320px)" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}


