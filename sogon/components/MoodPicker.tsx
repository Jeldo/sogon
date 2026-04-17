"use client";

import { MOODS, type Mood } from "@/lib/types";
import { MOOD_META } from "@/lib/mood";

type MoodPickerProps = {
  value: Mood | null;
  onChange: (mood: Mood | null) => void;
};

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  function handleToggle(mood: Mood) {
    onChange(value === mood ? null : mood);
  }

  return (
    <div
      role="group"
      aria-label="오늘 기분"
      className="flex items-center gap-4 py-1"
    >
      <span className="hidden md:inline text-xs text-text-tertiary font-body select-none">
        오늘 기분
        {value === null && (
          <span className="ml-1 text-text-placeholder">(선택)</span>
        )}
      </span>
      <div className="flex gap-2">
        {MOODS.map((mood) => {
          const isSelected = value === mood;
          const isDimmed = value !== null && !isSelected;
          return (
            <button
              key={mood}
              type="button"
              aria-pressed={isSelected}
              aria-label={MOOD_META[mood].label}
              onClick={() => handleToggle(mood)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl leading-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 ${
                isSelected
                  ? "bg-primary-100 ring-2 ring-primary-300 opacity-100 scale-105"
                  : isDimmed
                    ? "opacity-40 hover:opacity-70 hover:bg-neutral-100"
                    : "opacity-70 hover:opacity-100 hover:bg-neutral-100"
              }`}
            >
              {MOOD_META[mood].emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
