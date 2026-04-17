import { describe, it, expect } from "vitest";
import { getRepresentativeMood } from "./mood";
import type { DiaryEntry, Mood } from "./types";

function entry(
  overrides: Partial<DiaryEntry> & { createdAt: string; mood: Mood | null },
): DiaryEntry {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    content: overrides.content ?? "",
    imageDataUrl: overrides.imageDataUrl ?? null,
    mood: overrides.mood,
    createdAt: overrides.createdAt,
  };
}

describe("getRepresentativeMood", () => {
  it("returns null for an empty list", () => {
    expect(getRepresentativeMood([])).toBeNull();
  });

  it("returns null when no entry has a mood", () => {
    const entries = [
      entry({ mood: null, createdAt: "2026-04-17T09:00:00Z" }),
      entry({ mood: null, createdAt: "2026-04-17T20:00:00Z" }),
    ];
    expect(getRepresentativeMood(entries)).toBeNull();
  });

  it("returns the mood of the single entry when there is one", () => {
    const entries = [
      entry({ mood: "calm", createdAt: "2026-04-17T09:00:00Z" }),
    ];
    expect(getRepresentativeMood(entries)).toBe("calm");
  });

  it("returns the most recent mood when multiple entries have moods", () => {
    const entries = [
      entry({ mood: "sad", createdAt: "2026-04-17T09:00:00Z" }),
      entry({ mood: "happy", createdAt: "2026-04-17T20:00:00Z" }),
      entry({ mood: "calm", createdAt: "2026-04-17T14:00:00Z" }),
    ];
    expect(getRepresentativeMood(entries)).toBe("happy");
  });

  it("falls back to the most recent mood-bearing entry when the latest has none", () => {
    const entries = [
      entry({ mood: "calm", createdAt: "2026-04-17T09:00:00Z" }),
      entry({ mood: "happy", createdAt: "2026-04-17T14:00:00Z" }),
      entry({ mood: null, createdAt: "2026-04-17T20:00:00Z" }),
    ];
    expect(getRepresentativeMood(entries)).toBe("happy");
  });

  it("does not mutate the input array", () => {
    const entries = [
      entry({ mood: "sad", createdAt: "2026-04-17T09:00:00Z" }),
      entry({ mood: "happy", createdAt: "2026-04-17T20:00:00Z" }),
    ];
    const snapshot = [...entries];
    getRepresentativeMood(entries);
    expect(entries).toEqual(snapshot);
  });
});
