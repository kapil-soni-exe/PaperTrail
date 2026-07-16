"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";

const statusSteps = [
  { label: "Applied", color: "#378ADD" },
  { label: "Interview", color: "#BA7517" },
  { label: "Offer", color: "#639922" },
];

const variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={reduceMotion ? { transform: "none" } : undefined}
    >
      {children}
    </motion.div>
  );
}

function AuroraBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const indigoOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.28, 0.2, 0.16],
  );
  const statusOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.12, 0.22, 0.28],
  );
  const blueOpacity = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    [0.18, 0.24, 0.16],
  );

  const blobClass = "absolute rounded-full will-change-transform";
  const blurStyle = { filter: "blur(96px)" };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050508]"
    >
      <motion.div
        className={`${blobClass} -left-48 top-[-8rem] h-[34rem] w-[34rem] bg-[#6366F1]`}
        style={{ ...blurStyle, opacity: indigoOpacity }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 84, 26], y: [0, 48, -18], scale: [1, 1.12, 0.95] }
        }
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${blobClass} right-[-12rem] top-[8rem] h-[40rem] w-[40rem] bg-[#818CF8]`}
        style={{ ...blurStyle, opacity: indigoOpacity }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -72, 36], y: [0, 36, 96], scale: [1, 0.9, 1.08] }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${blobClass} left-[22%] top-[42%] h-[30rem] w-[30rem] bg-[#378ADD]`}
        style={{ ...blurStyle, opacity: blueOpacity }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 58, -44], y: [0, -64, 28], scale: [0.96, 1.08, 1] }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${blobClass} bottom-[-14rem] right-[18%] h-[36rem] w-[36rem] bg-[#639922]`}
        style={{ ...blurStyle, opacity: statusOpacity }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -44, 70], y: [0, -52, 22], scale: [1, 1.14, 0.92] }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${blobClass} bottom-[8%] left-[-10rem] h-[28rem] w-[28rem] bg-[#BA7517]`}
        style={{ ...blurStyle, opacity: statusOpacity }}
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 62, -28], y: [0, 34, -54], scale: [0.9, 1.05, 0.98] }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.18]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:14px_14px]" />
      <div className="absolute inset-0 bg-[#050508]/45" />
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.a
      href="/auth/register"
      whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(99,102,241,0.3)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#6366F1] px-5 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-colors hover:bg-[#4F46E5]"
    >
      {children}
      <ArrowRight size={16} />
    </motion.a>
  );
}

function SecondaryButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/10 px-5 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/[0.15]"
    >
      {children}
    </a>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 72],
    ["rgba(5,5,8,0)", "rgba(5,5,8,0.8)"],
  );
  const borderColor = useTransform(
    scrollY,
    [0, 72],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"],
  );

  return (
    <motion.header
      style={{ background, borderColor }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#818CF8]">
            <FileText size={16} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white/90">
            Papertrail
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="/auth/login"
            className="group hidden h-10 items-center rounded-full px-4 text-[14px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/90 sm:inline-flex"
          >
            <span className="relative">
              Sign in
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#818CF8] transition-transform group-hover:scale-x-100" />
            </span>
          </a>
          <motion.a
            href="/auth/register"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
            }}
            whileTap={{ scale: 0.99 }}
            className="inline-flex h-10 items-center rounded-full bg-[#6366F1] px-4 text-[14px] font-semibold text-white shadow-[0_0_18px_rgba(99,102,241,0.3)] transition-colors hover:bg-[#4F46E5]"
          >
            Get started
          </motion.a>
        </div>
      </nav>
    </motion.header>
  );
}

function HeroCursorGlow() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const background = useMotionTemplate`radial-gradient(420px circle at ${mouseX}% ${mouseY}%, rgba(99,102,241,0.18), transparent 70%)`;

  if (reduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-0"
      style={{ background }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(((event.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
    />
  );
}

function HeroVisual() {
  const bullets = [
    "Shipped a telemetry pipeline that reduced incident response time by 38%.",
    "Led migration from REST endpoints to typed server actions across hiring flows.",
    "Built dashboard primitives used by product, support, and growth teams.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      className="relative mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="absolute -inset-8 -z-10 bg-[#6366F1]/10 blur-[60px]" />
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 shadow-2xl shadow-black/40">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <p className="text-[12px] font-medium uppercase text-white/30">
              Resume editor
            </p>
            <p className="text-[14px] font-semibold text-white/80">
              Senior Frontend Engineer
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Sparkles size={13} />
            Improve bullets
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-white/[0.06] bg-[#080810] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white/80">
                Impact
              </span>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-white/40">
                AI writing
              </span>
            </div>
            <div className="space-y-3">
              {bullets.map((bullet, index) => (
                <div key={bullet} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#818CF8]" />
                  <motion.p
                    className="text-[13px] leading-6 text-white/70"
                    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.35 }}
                    animate={{
                      clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.6,
                      delay: 0.7 + index * 0.28,
                      repeat: Infinity,
                      repeatDelay: 4.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {bullet}
                  </motion.p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {["ATS score 91", "PDF ready", "Version saved"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-[12px] font-medium text-white/50"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-2xl shadow-black/30">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <p className="text-[12px] font-medium uppercase text-white/30">
              Tracker
            </p>
            <p className="text-[14px] font-semibold text-white/80">
              Gmail synced
            </p>
          </div>
          <span className="flex items-center gap-2 text-[12px] font-medium text-[#818CF8]">
            <span className="h-2 w-2 rounded-full bg-[#639922]" />
            Live
          </span>
        </div>
        <div className="space-y-3">
          {[
            ["Linear", "Product Engineer", "#BA7517", "Interview"],
            ["Vercel", "Frontend Engineer", "#378ADD", "Applied"],
            ["Stripe", "UI Engineer", "#639922", "Offer"],
          ].map(([company, role, color, status]) => (
            <motion.div
              key={company}
              className="border-l-2 bg-white/[0.02] px-4 py-3"
              style={{ borderColor: color }}
              whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.04)" }}
              transition={{ type: "spring", stiffness: 360, damping: 24 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-white/80">
                    {company}
                  </p>
                  <p className="text-[12px] text-white/40">{role}</p>
                </div>
                <span
                  className="flex items-center gap-2 text-[12px]"
                  style={{ color }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ResumeBuilderVisual() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["Generate summary", "Improve impact", "Tailor to role"].map(
          (label, index) => (
            <button
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
                index === 0
                  ? "bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "border border-[#3730A3]/30 bg-[#1E1B4B]/50 text-[#818CF8]"
              }`}
            >
              <Sparkles size={13} />
              {label}
            </button>
          ),
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-white/[0.06] bg-[#080810] p-4">
          <div className="mb-3 h-3 w-28 rounded-full bg-white/[0.08]" />
          <motion.div
            className="space-y-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[92, 76, 84].map((width, index) => (
              <motion.div
                key={width}
                variants={{
                  hidden: { width: "18%", opacity: 0.25 },
                  show: { width: `${width}%`, opacity: 1 },
                }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-3 rounded-full bg-gradient-to-r from-white/[0.08] to-[#818CF8]/40"
              />
            ))}
          </motion.div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-4 text-[12px] font-medium uppercase text-white/30">
              Version history
            </p>
            <div className="space-y-3">
              {[
                "Tailored for platform role",
                "Quantified impact",
                "Original draft",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        index === 0 ? "#6366F1" : "rgba(255,255,255,0.18)",
                    }}
                  />
                  <span className="text-[12px] text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/10 px-4 py-3 text-[13px] font-semibold text-white/80 hover:bg-white/[0.15]">
            <Download size={15} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedTimeline() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/80 hover:bg-white/[0.15]">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={15} />
          </motion.span>
          Sync Gmail
        </button>
        <Counter value={47} label="applications tracked automatically" />
      </div>

      <div className="relative mb-6 flex items-center justify-between gap-2">
        <div className="absolute left-8 right-8 top-[14px] h-px bg-white/[0.08]" />
        <motion.div
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1 },
          }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-8 right-8 top-[14px] h-px origin-left bg-[#6366F1]"
        />
        <motion.span
          variants={{
            hidden: { left: "2rem", opacity: 0 },
            show: { left: "calc(100% - 2rem)", opacity: 1 },
          }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[10px] z-10 h-2.5 w-2.5 rounded-full bg-[#818CF8] shadow-[0_0_18px_rgba(99,102,241,0.3)]"
        />
        {statusSteps.map((step, index) => (
          <div
            key={step.label}
            className="relative flex flex-col items-center gap-2"
          >
            <motion.div
              variants={{
                hidden: { scale: 0.72, opacity: 0.5 },
                show: { scale: 1, opacity: 1 },
              }}
              transition={{ duration: 0.35, delay: 0.18 + index * 0.22 }}
              className="flex h-7 w-7 items-center justify-center rounded-full border"
              style={{
                borderColor: `${step.color}55`,
                backgroundColor: `${step.color}18`,
                boxShadow:
                  index === 1 ? `0 0 0 4px ${step.color}22` : undefined,
              }}
            >
              {index === 0 ? (
                <Check size={12} style={{ color: step.color }} />
              ) : (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: step.color }}
                />
              )}
            </motion.div>
            <span
              className="text-[12px] font-medium"
              style={{ color: step.color }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-white/[0.06] bg-[#080810] p-4">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-[#818CF8]">
          <Mail size={14} />
          Follow-up draft
        </div>
        <div className="space-y-3 font-serif text-[14px] leading-6 text-white/60">
          <p>Hi Maya,</p>
          <p>
            I loved our conversation about the editor platform role. I wanted to
            share one more project that maps closely to the workflow reliability
            work you described.
          </p>
          <p>Best, Alex</p>
        </div>
      </div>
    </motion.div>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let frame = 0;
    const totalFrames = 44;
    const timer = window.setInterval(() => {
      frame += 1;
      setCurrent(Math.round((value * frame) / totalFrames));
      if (frame >= totalFrames) {
        window.clearInterval(timer);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [reduceMotion, value]);

  return (
    <div className="text-right">
      <span className="text-[26px] font-semibold tracking-tight text-white/90">
        {reduceMotion ? value : current}
      </span>
      <p className="max-w-32 text-[11px] leading-4 text-white/40">{label}</p>
    </div>
  );
}

function AmbientGlow() {
  const reduceMotion = useReducedMotion();
  const animation = useMemo(
    () =>
      reduceMotion
        ? {}
        : {
            x: [0, 18, -10, 0],
            y: [0, -12, 10, 0],
          },
    [reduceMotion],
  );

  return (
    <motion.div
      aria-hidden
      animate={animation}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 top-28 -z-10 h-64 w-[42rem] -translate-x-1/2 bg-[#6366F1]/10 blur-[60px]"
    />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050508] text-white/90">
      <AuroraBackground />
      <Nav />

      <section className="relative z-10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28">
        <HeroCursorGlow />
        <AmbientGlow />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[13px] font-medium text-white/50">
              <Zap size={14} className="text-[#818CF8]" />
              Resume builder and application tracker in one workspace
            </div>
            <h1 className="text-[40px] font-semibold leading-tight tracking-tight text-white/90 sm:text-[52px] lg:text-[56px]">
              Build your resume.
              <br />
              Never lose a{" "}
              <span className="text-[#818CF8]">job application.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/50 sm:text-[16px]">
              Papertrail helps you write sharper resumes with AI and keeps every
              Gmail-sourced application, interview, and follow-up in one place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryButton>Get started free</PrimaryButton>
              <SecondaryButton href="#demo">See how it works</SecondaryButton>
            </div>
          </motion.div>

          <HeroVisual />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-5 py-12 backdrop-blur-[1px] sm:px-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="text-[22px] font-semibold leading-snug tracking-tight text-white/80 sm:text-[28px]">
            Applying to dozens of roles should not mean rewriting the same
            resume, losing replies in your inbox, or guessing who needs a
            follow-up.
          </p>
        </FadeIn>
      </section>

      <section id="demo" className="relative z-10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute right-0 top-20 -z-10 h-64 w-[32rem] bg-[#6366F1]/10 blur-[60px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#818CF8]">
              Resume builder
            </p>
            <h2 className="max-w-xl text-[32px] font-semibold leading-tight tracking-tight text-white/90 sm:text-[44px]">
              Turn raw experience into a polished resume faster.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-white/60">
              Generate summaries, sharpen bullets, compare versions, and export
              a clean PDF without leaving your writing flow.
            </p>
            <div className="mt-7 grid max-w-xl gap-3">
              {[
                "AI actions styled like the editor, from one-click summaries to quantified bullets.",
                "Version history keeps each role-specific draft easy to recover.",
                "Export-ready resumes stay close to the data you already maintain.",
              ].map((item) => (
                <div
                  key={item}
                  className="border-l-2 border-[#6366F1] py-1 pl-4 text-[14px] leading-6 text-white/55"
                >
                  {item}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <ResumeBuilderVisual />
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <FadeIn className="lg:order-2">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#818CF8]">
              Job tracker
            </p>
            <h2 className="max-w-xl text-[32px] font-semibold leading-tight tracking-tight text-white/90 sm:text-[44px]">
              Let Gmail do the boring tracking work.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-7 text-white/60">
              Papertrail reads application signals, updates your pipeline, and
              drafts thoughtful follow-ups when momentum matters.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                ["#378ADD", "Applied"],
                ["#BA7517", "Interview"],
                ["#639922", "Offer"],
                ["#E24B4A", "Rejected"],
                ["#888780", "Cancelled"],
              ].map(([color, label]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium"
                  style={{ color }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="lg:order-1" delay={0.12}>
            <AnimatedTimeline />
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-5 py-14 backdrop-blur-[1px] sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          {[
            ["3", "core workflows connected"],
            ["47", "applications tracked in the demo pipeline"],
            ["91", "sample ATS score after AI edits"],
          ].map(([value, label], index) => (
            <FadeIn key={label} delay={index * 0.08}>
              <div>
                <p className="text-[42px] font-semibold tracking-tight text-white/90">
                  {value}
                </p>
                <p className="mt-1 text-[13px] text-white/40">{label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-x-0 top-1/2 -z-10 h-48 -translate-y-1/2 bg-[#6366F1]/10 blur-[60px]" />
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h2 className="text-[34px] font-semibold leading-tight tracking-tight text-white/90 sm:text-[46px]">
            Make every application easier to remember.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-7 text-white/60">
            Write the resume, track the reply, send the follow-up, and keep the
            whole search moving.
          </p>
          <div className="mt-8">
            <PrimaryButton>Start your Papertrail</PrimaryButton>
          </div>
        </FadeIn>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3 text-white/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#818CF8]">
              <FileText size={16} />
            </span>
            <span className="font-semibold tracking-tight">Papertrail</span>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/auth/login"
              className="transition-colors hover:text-white/70"
            >
              Sign in
            </a>
            <a
              href="/auth/register"
              className="transition-colors hover:text-white/70"
            >
              Get started
            </a>
            <a href="#demo" className="transition-colors hover:text-white/70">
              Demo
            </a>
          </div>
          <p>Copyright 2026 Papertrail.</p>
        </div>
      </footer>
    </main>
  );
}
