"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FcGoogle } from "react-icons/fc";
import "./login-form.css";

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="lf-divider" role="separator" aria-hidden="true">
      <span className="lf-divider-line" />
      <span className="lf-divider-text">or continue with email</span>
      <span className="lf-divider-line" />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUpClick?: () => void;
  /** Server-returned error string — surfaces on the password field. */
  error?: string;
}

export default function LoginForm({
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  onForgotPassword,
  onSignUpClick,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSubmit) return;
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lf-root">
      {/* ── OAuth buttons (§08: 32px below headline, 8px between them) ── */}
      <div className="lf-oauth-group">
        <Button
          variant="oauth"
          type="button"
          icon={<FcGoogle size={18} />}
          onClick={onGoogleLogin}
        >
          Continue with Google
        </Button>
      </div>

      {/* ── Divider (§08: 24px above and below) ── */}
      <Divider />

      {/* ── Email + Password + CTA (§08 gaps applied via CSS) ── */}
      <form className="lf-form" onSubmit={handleSubmit} noValidate>
        {/* Email — 24px below divider */}
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password — 16px below email (§08) */}
        <div className="lf-password-group">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            status={error ? "error" : "default"}
            errorMessage={error}
            required
          />

          {/* "Forgot password?" — 12px, right-aligned, below password input (§08) */}
          <button
            type="button"
            className="lf-forgot"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        {/* CTA — 28px below password group (§08) */}
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          disabled={!email || !password}
          className="lf-cta"
        >
          Sign in
        </Button>
      </form>

      {/* ── Footer link — 20px below CTA (§08) ── */}
      <p className="lf-footer">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className="lf-footer-link"
          onClick={onSignUpClick}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
