"use client";



import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FcGoogle } from "react-icons/fc";

// ─── Divider ────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3 my-6" role="separator" aria-hidden="true">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)" }} />
      <span className="flex-shrink-0 text-[12px]" style={{ color: "rgba(240,240,255,0.30)" }}>
        or continue with email
      </span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)" }} />
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegisterFormProps {
  onSubmit?: (name: string, email: string, password: string) => Promise<void>;
  onGoogleSignUp?: () => void;
  onGithubSignUp?: () => void;
  onSignInClick?: () => void;
  error?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RegisterForm({
  onSubmit,
  onGoogleSignUp,
  onGithubSignUp,
  onSignInClick,
  error,
}: RegisterFormProps) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSubmit) return;
    setIsLoading(true);
    try {
      await onSubmit(name, email, password);
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = Boolean(name && email && password);

  return (
    <div className="w-full">

      {/* OAuth buttons — §08 / §16: same pattern as login */}
      <div className="flex flex-col gap-2">
        <Button variant="oauth" type="button" icon={<FcGoogle size={18} />} onClick={onGoogleSignUp}>
          Continue with Google
        </Button>
      </div>

      <Divider />

      {/* Email / password form */}
      <form className="flex flex-col gap-0" onSubmit={handleSubmit} noValidate>

        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="mt-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            status={error ? "error" : "default"}
            errorMessage={error}
            required
          />
        </div>

        {/* CTA — §16: "Create account →" */}
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          disabled={!canSubmit}
          className="mt-7"
        >
          Create account →
        </Button>

      </form>

      {/* Footer — §16 */}
      <p className="mt-5 text-center text-[13px]" style={{ color: "rgba(240,240,255,0.40)" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignInClick}
          className="font-medium transition-colors duration-150 bg-transparent border-0 p-0 cursor-pointer"
          style={{ color: "rgba(124,111,255,0.90)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(124,111,255,1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(124,111,255,0.90)")}
        >
          Sign in
        </button>
      </p>

    </div>
  );
}
