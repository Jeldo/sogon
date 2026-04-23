"use client";

import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = Omit<ComponentProps<"button">, "children"> & {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-[11px] px-4 py-2",
  md: "text-[13px] px-[22px] py-[11px]",
  lg: "text-[13px] px-8 py-[14px]",
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-ink)] shadow-[var(--glow-amber)] hover:bg-[var(--amber-500)]",
  secondary:
    "bg-[var(--surface-3)] text-[var(--text)] hover:bg-[var(--ink-5)]",
  outline:
    "bg-transparent text-[var(--text)] border border-[var(--ink-6)] hover:bg-[var(--surface-3)]",
  ghost:
    "bg-transparent text-[var(--text-dim)] hover:bg-[var(--surface-3)] hover:text-[var(--text)]",
  danger:
    "bg-transparent text-[var(--negative)] border border-[var(--negative)] hover:bg-[var(--negative)]/10",
};

export function Button({
  variant = "primary",
  size = "md",
  leading,
  trailing,
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--r-pill)]
        font-bold uppercase tracking-[0.12em]
        transition-all duration-150 ease-[var(--ease-out)]
        active:scale-[0.97]
        disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:active:scale-100
        focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent),var(--glow-amber)]
        ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`.replace(/\s+/g, " ").trim()}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
