import type { ComponentProps } from "react";

/** Card anatomy: rounded surface with padding; optional hover lift */

type CardPadding = "sm" | "md" | "lg";

export type CardProps = ComponentProps<"div"> & {
  padding?: CardPadding;
  interactive?: boolean;
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  padding = "md",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  const baseClasses = "rounded-card bg-surface border border-border shadow-sm";
  const paddingClass = PADDING_CLASSES[padding];
  const interactiveClasses = interactive
    ? "transition-shadow duration-150 ease-out hover:shadow-md"
    : "";

  const allClasses = [baseClasses, paddingClass, interactiveClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...rest} className={allClasses}>
      {children}
    </div>
  );
}
