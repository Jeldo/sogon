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
      className={`w-full flex items-center gap-4 p-4 rounded-[16px] border-2 bg-white text-left transition-all duration-200 hover:scale-[1.02] ${
        selected
          ? "border-primary-500 shadow-[0_0_0_3px_rgba(110,189,90,0.15)]"
          : "border-neutral-200"
      }`}
    >
      {/* Check icon (left) */}
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 ${
          selected
            ? "bg-primary-600 border-primary-600"
            : "border-neutral-300 bg-white"
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} className="text-white" />}
      </div>

      {/* Emoji */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center text-xl"
        style={{ backgroundColor: bgColor }}
      >
        {emoji}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-base font-body text-neutral-600">{name}</p>
        <p className="text-sm font-handwriting text-neutral-400 truncate">
          &ldquo;{exampleReaction}&rdquo;
        </p>
      </div>
    </button>
  );
}
