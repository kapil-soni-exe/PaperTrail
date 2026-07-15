"use client";


import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import BrandPanel from "@/components/auth/BrandPanel";

// Animation variants

const panelVariant: Variants = {
  hidden:  { x: -20, opacity: 0 },
  visible: {
    x: 0, opacity: 1,
    transition: { duration: 0.45, ease: [0, 0, 0.2, 1], delay: 0.15 },
  },
};

const cardVariant: Variants = {
  hidden:  { y: 16, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 0.30 },
  },
};

// Wordmark

function Wordmark() {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="text-[18px] font-semibold"
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

// Headline 

function RegisterHeadline() {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="font-medium" style={{ fontSize: 26, lineHeight: 1.2, color: "#F0F0FF" }}>
        Start building your career.{" "}
        {/* §16: "Free" rendered in accent gradient */}
        <span
          style={{
            background: "linear-gradient(135deg, #7C6FFF, #38BDF8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Free.
        </span>
      </h1>
      <p className="text-[15px]" style={{ color: "rgba(240,240,255,0.55)", lineHeight: 1.5 }}>
        Your next role is closer than you think.
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | undefined>();

  const handleRegister = async (name: string, email: string, password: string) => {
    setError(undefined);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create account. Please try again.");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">

      {/* ── Left: brand panel — desktop only ── */}
      <motion.div
        variants={panelVariant}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex lg:w-[55%] relative border-r lg:overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(13,13,26,0.25)" }}
        />
        <div className="relative z-10 w-full">
          {/* §16: left panel copy is slightly different for sign-up */}
          <BrandPanel headline={"Your next role,\nalready within reach."} />
        </div>
      </motion.div>

      {/* ── Right: auth card ── */}
      <div
        className="flex-1 flex p-4 py-12 lg:p-12 lg:w-[45%] lg:overflow-y-auto"
        style={{ background: "rgba(8,8,16,0.15)" }}
      >
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          className="w-full flex justify-center m-auto"
        >
          <AuthCard>

            {/* Wordmark + headline (§08 / §16) */}
            <AuthCard.Header>
              <Wordmark />
              <RegisterHeadline />
            </AuthCard.Header>

            {/* Form — 32px below header */}
            <AuthCard.Section gap="2xl">
              <RegisterForm
                onSubmit={handleRegister}
                error={error}
                onSignInClick={() => router.push("/login")}
              />
            </AuthCard.Section>

          </AuthCard>
        </motion.div>
      </div>

    </div>
  );
}
