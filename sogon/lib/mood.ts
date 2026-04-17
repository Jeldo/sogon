import type { DiaryEntry, Mood } from "@/lib/types";

export const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: "🥰", label: "좋음" },
  calm: { emoji: "😌", label: "평온" },
  sad: { emoji: "😭", label: "슬픔" },
  frustrated: { emoji: "🤬", label: "짜증" },
  tired: { emoji: "🫩", label: "피곤" },
};

export function getRepresentativeMood(entries: DiaryEntry[]): Mood | null {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return sorted.find((e) => e.mood)?.mood ?? null;
}
