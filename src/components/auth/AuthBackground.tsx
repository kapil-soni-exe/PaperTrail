import React from "react";
import "./auth-background.css";

const NoiseSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    aria-hidden="true"
  >
    <filter id="noise-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="200" height="200" filter="url(#noise-filter)" />
  </svg>
);

// ---------------------------------------------------------------------------
// Component

export default function AuthBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="auth-bg-root">
      <div className="auth-bg-aurora-violet" aria-hidden="true" />

      <div className="auth-bg-aurora-blue" aria-hidden="true" />

      <div className="auth-bg-grid" aria-hidden="true" />

      <div className="auth-bg-noise" aria-hidden="true">
        <NoiseSVG />
      </div>

      {children && <div className="auth-bg-content">{children}</div>}
    </div>
  );
}
