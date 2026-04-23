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
      className="flex items-center gap-3.5 py-1"
    >
      <span className="t-label hidden sm:inline">
        mood
        {value === null && (
          <span className="ml-1 normal-case tracking-normal text-[var(--text-muted)] font-normal text-[11px]">
            (선택)
          </span>
        )}
      </span>
      <div className="flex gap-2.5">
        {MOODS.map((mood) => {
          const isSelected = value === mood;
          const isDimmed = value !== null && !isSelected;
          const moodColor = MOOD_META[mood].color;
          return (
            <button
              key={mood}
              type="button"
              aria-pressed={isSelected}
              aria-label={MOOD_META[mood].label}
              onClick={() => handleToggle(mood)}
              style={{
                background: isSelected
                  ? "var(--surface-3)"
                  : "var(--surface-2)",
                opacity: isDimmed ? 0.4 : 1,
                transform: isSelected ? "scale(1.08)" : "scale(1)",
                boxShadow: isSelected
                  ? `inset 0 0 0 1px ${moodColor}, 0 0 18px color-mix(in srgb, ${moodColor} 40%, transparent)`
                  : "none",
              }}
              className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-xl leading-none border-0 cursor-pointer transition-all duration-200 ease-[var(--ease-spring)] focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent),var(--glow-amber)]"
            >
              {MOOD_META[mood].emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
