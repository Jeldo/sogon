"use client";

import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = Omit<ComponentProps<"button">, "children"> & {
  circle?: boolean;
  children?: ReactNode;
  size?: number;
};

export function IconButton({
  circle = false,
  children,
  size = 40,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      style={{ width: size, height: size, ...rest.style }}
      className={`inline-flex items-center justify-center border-0
        bg-[var(--surface-3)] text-[var(--text)]
        transition-all duration-150 ease-[var(--ease-out)]
        hover:bg-[var(--ink-5)] active:scale-[0.97]
        disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:active:scale-100
        focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent),var(--glow-amber)]
        ${circle ? "rounded-full" : "rounded-[var(--r-sm)]"}
        ${className}`.replace(/\s+/g, " ").trim()}
    >
      {children}
    </button>
  );
}
