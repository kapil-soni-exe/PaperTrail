"use client";

import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  opacity: number; // 0.02 – 0.06
  vx: number; // pixels per frame
  vy: number;
}

// ─── Constants (from §05) ────────────────────────────────────────────────────

const PARTICLE_COUNT_MIN = 120;
const PARTICLE_COUNT_MAX = 180;
const PARTICLE_RADIUS = 0.75; // sub-pixel — renders as a crisp 1px dot at 1x

// Diagonal drift direction: roughly 30° from horizontal (down-right)
// "consistent diagonal direction" — all particles share this base angle.
const BASE_ANGLE_RAD = (30 * Math.PI) / 180;

// Speed range — pixels per frame at 60fps.
// At 0.12 px/frame the particle travels ~7px per second — imperceptible.
const SPEED_MIN = 0.06;
const SPEED_MAX = 0.14;

// Jitter: random angular variance around the base angle (±10°)
const ANGLE_JITTER_RAD = (10 * Math.PI) / 180;

// Cluster bias: pulls random spawn positions toward the aurora origin (28%, 18%)
// A value of 0 = fully random; 1 = always at the origin.
const CLUSTER_STRENGTH = 0.35;

// ─── Utilities ───────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticle(w: number, h: number): Particle {
  // Base random position
  const rx = Math.random() * w;
  const ry = Math.random() * h;

  // Aurora origin in absolute pixels (28% from left, 18% from top — §05 Layer 2)
  const ox = w * 0.28;
  const oy = h * 0.18;

  // Blend toward the origin based on cluster strength
  const x = lerp(rx, ox, Math.random() * CLUSTER_STRENGTH);
  const y = lerp(ry, oy, Math.random() * CLUSTER_STRENGTH);

  // Velocity: shared base direction + small jitter
  const angle = BASE_ANGLE_RAD + rand(-ANGLE_JITTER_RAD, ANGLE_JITTER_RAD);
  const speed = rand(SPEED_MIN, SPEED_MAX);

  return {
    x,
    y,
    opacity: rand(0.02, 0.06),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function initParticles(w: number, h: number): Particle[] {
  const count = Math.round(rand(PARTICLE_COUNT_MIN, PARTICLE_COUNT_MAX));
  return Array.from({ length: count }, () => createParticle(w, h));
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
    ctx.fill();
  }
}

function stepParticles(particles: Particle[], w: number, h: number): void {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Wrap at canvas edges so particles never disappear
    if (p.x > w + 1) p.x = -1;
    if (p.x < -1) p.x = w + 1;
    if (p.y > h + 1) p.y = -1;
    if (p.y < -1) p.y = h + 1;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ParticleLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect prefers-reduced-motion — spec §17 + §18
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let rafId: number;
    let particles: Particle[] = [];

    // ── Size canvas to its CSS display size (device pixel ratio aware) ──
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas!.offsetWidth;
      const height = canvas!.offsetHeight;

      canvas!.width = width * dpr;
      canvas!.height = height * dpr;

      ctx!.scale(dpr, dpr);

      // Re-create particles for new dimensions to preserve distribution
      particles = initParticles(width, height);

      if (reducedMotion) {
        // Static draw only — no animation loop
        drawParticles(ctx!, particles, width, height);
      }
    }

    // ── Animation loop ──
    function tick() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      stepParticles(particles, w, h);
      drawParticles(ctx!, particles, w, h);
      rafId = requestAnimationFrame(tick);
    }

    // ── ResizeObserver — keeps canvas sharp on resize / mobile rotation ──
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      resize();
      if (!reducedMotion) {
        rafId = requestAnimationFrame(tick);
      }
    });

    observer.observe(canvas);
    resize();

    if (!reducedMotion) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        userSelect: "none",
        display: "block",
        
        zIndex: 2,
      }}
    />
  );
}
