import React from "react";
import type { Metadata } from "next";
import AuthBackground from "@/components/auth/AuthBackground";
import ParticleLayer from "@/components/auth/ParticleLayer";

// ─── Metadata 

export const metadata: Metadata = {
  title: {
    template: "%s | PaperTrail",
    default:  "PaperTrail — AI-powered career workspace",
  },
  description:
    "Manage resumes, track jobs, generate cover letters, and prepare for interviews — all in one place.",
};

// ─── Layout ─


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-dvh w-full overflow-hidden">

      {/* Atmospheric background — all CSS layers, no children */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <AuthBackground />
      </div>

      {/* Particle field — canvas fills the container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 3 }}
      >
        <ParticleLayer />
      </div>

      {/* Page content — sits above all background layers */}
      <div className="relative h-full w-full" style={{ zIndex: 10 }}>
        {children}
      </div>

    </div>
  );
}
