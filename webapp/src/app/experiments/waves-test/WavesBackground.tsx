"use client";

import { useEffect, useRef } from "react";

interface WavesBackgroundProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  className?: string;
}

export function WavesBackground({
  lineColor = "rgba(234, 236, 238, 0.15)",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.01,
  waveAmpX = 30,
  waveAmpY = 20,
  xGap = 20,
  yGap = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  className = "",
}: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Wave state
    let t = 0;
    const waves: Array<{ points: Array<{ x: number; y: number; vx: number; vy: number; ox: number; oy: number }> }> = [];
    
    // Mouse/cursor position
    const mouse = { x: width / 2, y: height / 2 };

    // Initialize wave lines
    const initWaves = () => {
      waves.length = 0;
      const numWaves = Math.ceil(height / yGap) + 2;
      
      for (let i = 0; i < numWaves; i++) {
        const points = [];
        const y = i * yGap - yGap;
        const numPoints = Math.ceil(width / xGap) + 2;
        
        for (let j = 0; j < numPoints; j++) {
          const x = j * xGap - xGap;
          points.push({
            x,
            y,
            vx: 0,
            vy: 0,
            ox: x,
            oy: y,
          });
        }
        waves.push({ points });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      t += 0.01;

      waves.forEach((wave, waveIndex) => {
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        wave.points.forEach((point, i) => {
          // Calculate wave offset
          const waveX = Math.sin(t * waveSpeedX + point.ox * 0.01) * waveAmpX;
          const waveY = Math.cos(t * waveSpeedY + point.oy * 0.01) * waveAmpY;

          // Calculate distance to mouse
          const dx = mouse.x - point.ox;
          const dy = mouse.y - point.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Apply cursor influence
          let targetX = point.ox + waveX;
          let targetY = point.oy + waveY;
          
          if (dist < 200) {
            const force = (200 - dist) / 200;
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * force * maxCursorMove;
            const moveY = Math.sin(angle) * force * maxCursorMove;
            targetX += moveX;
            targetY += moveY;
          }

          // Spring physics
          point.vx += (targetX - point.x) * tension;
          point.vy += (targetY - point.y) * tension;
          point.vx *= friction;
          point.vy *= friction;
          point.x += point.vx;
          point.y += point.vy;

          // Draw line
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initWaves();
    };

    // Initialize and start
    initWaves();
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap, friction, tension, maxCursorMove]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
