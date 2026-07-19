

import React from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROOF_POINTS = [
  "50K+ resumes built",
  "12K+ jobs tracked",
  "Loved by YC founders",
] as const;

// ─── Sub-elements ─────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[18px] font-semibold tracking-tight"
        style={{ color: "#F0F0FF", letterSpacing: "-0.02em" }}
      >
        PaperTrail
      </span>
      <span
        style={{
          background: "linear-gradient(135deg, #7C6FFF, #38BDF8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: 14,
        }}
      >
        ✦
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface BrandPanelProps {
  /** Override the value statement headline (e.g. for register page). */
  headline?: string;
}

export default function BrandPanel({
  headline = "Your career,\nfinally organized.",
}: BrandPanelProps) {
  return (
    <div className="flex flex-col justify-between h-full px-14 py-12">

      {/* Logo mark — top-left (§06) */}
      <LogoMark />

      {/* Illustration zone — decorative ambient orbs (§07) */}
      <div className="relative flex flex-1 items-center justify-center my-10">
        {/* Violet nebula orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320, height: 320,
            background: "radial-gradient(circle, rgba(124,111,255,0.16) 0%, transparent 70%)",
            top: "5%", left: "10%",
          }}
        />
        {/* Sky-blue counter orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220, height: 220,
            background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
            bottom: "5%", right: "5%",
          }}
        />
        {/* Value statement */}
        <h2
          className="relative z-10 text-center font-medium whitespace-pre-line"
          style={{ fontSize: 38, lineHeight: 1.15, color: "#F0F0FF", letterSpacing: "-0.025em" }}
        >
          {headline}
        </h2>
      </div>

      {/* Bottom: proof points + social proof */}
      <div className="flex flex-col gap-7">

        {/* Proof points — §06: Geist Mono, accent ✦ */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {PROOF_POINTS.map((point) => (
            <span
              key={point}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide"
              style={{ color: "rgba(240,240,255,0.38)" }}
            >
              <span style={{ color: "#7C6FFF" }}>✦</span>
              {point}
            </span>
          ))}
        </div>

        {/* Social proof quote — §06 */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "rgba(255,255,255,0.025)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-[13px] mb-3 leading-relaxed"
            style={{ color: "rgba(240,240,255,0.65)" }}
          >
            "PaperTrail cut my job search time in half.
            I landed my offer at Stripe within 3 weeks."
          </p>
          <div className="flex items-center gap-2.5">
            {/* Initials avatar — §06: 24px, gradient */}
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #7C6FFF, #38BDF8)",
                fontSize: 9,
              }}
            >
              PK
            </div>
            <span className="text-[12px] font-medium" style={{ color: "rgba(240,240,255,0.50)" }}>
              Priya K. — Software Engineer at Stripe
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
