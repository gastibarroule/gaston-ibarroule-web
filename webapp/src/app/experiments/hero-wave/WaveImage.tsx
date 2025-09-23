/* Reason: WebGL context is guarded at runtime; TS narrowing across inner closures
   still flags `gl` as possibly null. This is an experimental visual component. */
"use client";

import { useEffect, useRef, useState } from "react";

type WaveImageProps = {
  src: string;
  alt: string;
  intensity?: number; // 0..~0.1 recommended
};

export function WaveImage({ src, alt, intensity = 0.03 }: WaveImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setFallback(true);
      return;
    }
    const canvasEl = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const maybeGl = canvasEl.getContext("webgl", { antialias: true, powerPreference: "high-performance" });
    if (!maybeGl) {
      setFallback(true);
      return;
    }
    const gl = maybeGl as WebGLRenderingContext;

    let raf = 0;
    let startTime = performance.now();
    let image: HTMLImageElement | null = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;

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
        float wave = sin((vUv.y + uTime * 0.8) * 12.0) * uIntensity * uHover;
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
    if (!program) {
      setFallback(true);
      return;
    }
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

    function resize() {
      if (!containerEl || !canvasEl) return;
      const rect = containerEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    }

    function updateTexture() {
      if (!image) return;
      if (!image.complete) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uTex, 0);
    }

    let hoverState = 0;
    let targetHover = 0;

    function onEnter() { targetHover = 1; }
    function onLeave() { targetHover = 0; }

    containerEl.addEventListener("mouseenter", onEnter);
    containerEl.addEventListener("mouseleave", onLeave);

    function render(now: number) {
      const t = (now - startTime) / 1000;
      hoverState += (targetHover - hoverState) * 0.12;
      gl.uniform1f(uTime, t);
      gl.uniform1f(uHover, hoverState);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    }

    function onLoad() {
      updateTexture();
      resize();
      startTime = performance.now();
      raf = requestAnimationFrame(render);
    }

    image.addEventListener("load", onLoad);
    if (image.complete) onLoad();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      containerEl.removeEventListener("mouseenter", onEnter);
      containerEl.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      image && image.removeEventListener("load", onLoad);
      image = null;
    };
  }, [src, intensity]);

  if (fallback) {
    return (
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
