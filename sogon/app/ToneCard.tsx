"use client";

import { Check } from "lucide-react";

type ToneCardProps = {
  emoji: string;
  bgColor: string;
  name: string;
  exampleReaction: string;
  selected: boolean;
  onSelect: () => void;
};

export function ToneCard({
  emoji,
  bgColor,
  name,
  exampleReaction,
  selected,
  onSelect,
}: ToneCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="w-full flex items-center gap-4 p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] text-left border-0 cursor-pointer transition-all duration-200 ease-[var(--ease-out)] active:scale-[0.99]"
      style={{
        boxShadow: selected
          ? "inset 0 0 0 2px var(--accent), var(--glow-amber)"
          : "none",
        opacity: selected ? 1 : 0.7,
      }}
    >
      {/* Emoji badge (tone-colored circle) */}
      <span
        className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[22px] leading-none"
        style={{ background: bgColor, color: "var(--accent-ink)" }}
      >
        {emoji}
      </span>

      {/* Text */}
      <span className="flex-1 min-w-0">
        <span className="block t-body-bold truncate">{name}</span>
        <span
          className="block mt-0.5 truncate"
          style={{
            fontFamily: "var(--font-hand)",
            fontSize: 20,
            lineHeight: 1.25,
            color: selected ? "var(--accent-hi)" : "var(--text-dim)",
          }}
        >
          &ldquo;{exampleReaction}&rdquo;
        </span>
      </span>

      {/* Check badge (shown when selected) */}
      {selected && (
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          <Check size={14} strokeWidth={2.4} />
        </span>
      )}
    </button>
  );
}
