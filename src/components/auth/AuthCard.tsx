import React from "react";
import "./auth-card.css";

type GapSize = "sm" | "md" | "lg" | "xl" | "2xl";

const gapClass: Record<GapSize, string> = {
  sm: "auth-card-gap-sm",
  md: "auth-card-gap-md",
  lg: "auth-card-gap-lg",
  xl: "auth-card-gap-xl",
  "2xl": "auth-card-gap-2xl",
};

function Header({ children }: { children: React.ReactNode }) {
  return <div className="auth-card-header">{children}</div>;
}

function Section({
  children,
  gap,
  className = "",
}: {
  children: React.ReactNode;
  gap: GapSize;
  className?: string;
}) {
  return (
    <div className={`auth-card-section ${gapClass[gap]} ${className}`.trim()}>
      {children}
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="auth-card-footer">{children}</div>;
}

// ─── Root component

interface AuthCardProps {
  children: React.ReactNode;

  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div className={`auth-card ${className}`.trim()} role="main">
      {children}
    </div>
  );
}

// Attach sub-components as static properties
AuthCard.Header = Header;
AuthCard.Section = Section;
AuthCard.Footer = Footer;
