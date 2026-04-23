import type { DiaryEntry, Mood } from "@/lib/types";

export const MOOD_META: Record<
  Mood,
  { emoji: string; label: string; color: string }
> = {
  happy: { emoji: "🥰", label: "좋음", color: "var(--mood-happy)" },
  calm: { emoji: "😌", label: "평온", color: "var(--mood-calm)" },
  sad: { emoji: "😭", label: "슬픔", color: "var(--mood-sad)" },
  frustrated: { emoji: "🤬", label: "짜증", color: "var(--mood-frustrated)" },
  tired: { emoji: "🫩", label: "피곤", color: "var(--mood-tired)" },
};

export function getRepresentativeMood(entries: DiaryEntry[]): Mood | null {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return sorted.find((e) => e.mood)?.mood ?? null;
}
