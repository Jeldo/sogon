"use client";

import { STORAGE_KEYS } from "@/lib/constants";
import type {
  DeviceProfile,
  DiaryEntry,
  EntryWithReaction,
  FriendTone,
  Mood,
  Reaction,
  ThemeMode,
} from "@/lib/types";
import { isSameDay } from "@/lib/date-utils";

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

function setItem(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Profile

export function getDeviceProfile(): DeviceProfile | null {
  return getItem<DeviceProfile>(STORAGE_KEYS.PROFILE);
}

export function setDeviceProfile(tone: FriendTone): void {
  const profile: DeviceProfile = {
    friendTone: tone,
    createdAt: new Date().toISOString(),
  };
  setItem(STORAGE_KEYS.PROFILE, profile);
}

// Entries

export function getEntries(): DiaryEntry[] {
  const raw = getItem<DiaryEntry[]>(STORAGE_KEYS.ENTRIES) ?? [];
  return raw.map((e) => ({ ...e, mood: e.mood ?? null }));
}

export function addEntry(
  content: string,
  imageDataUrl: string | null,
  mood: Mood | null = null,
): DiaryEntry {
  const entries = getEntries();
  const entry: DiaryEntry = {
    id: crypto.randomUUID(),
    content,
    imageDataUrl,
    mood,
    createdAt: new Date().toISOString(),
  };
  entries.unshift(entry);
  setItem(STORAGE_KEYS.ENTRIES, entries);
  return entry;
}

export function updateEntry(
  id: string,
  updates: Partial<Pick<DiaryEntry, "content" | "imageDataUrl" | "mood">>,
): DiaryEntry | null {
  const entries = getEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  entries[index] = { ...entries[index], ...updates };
  setItem(STORAGE_KEYS.ENTRIES, entries);
  return entries[index];
}

export function deleteEntry(id: string): boolean {
  const entries = getEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  setItem(STORAGE_KEYS.ENTRIES, filtered);
  // Also delete associated reaction
  const reactions = getReactions().filter((r) => r.entryId !== id);
  setItem(STORAGE_KEYS.REACTIONS, reactions);
  return true;
}

// Reactions

export function getReactions(): Reaction[] {
  return getItem<Reaction[]>(STORAGE_KEYS.REACTIONS) ?? [];
}

export function addReaction(
  entryId: string,
  content: string,
  tone: FriendTone,
): Reaction {
  const reactions = getReactions();
  const reaction: Reaction = {
    id: crypto.randomUUID(),
    entryId,
    content,
    tone,
    createdAt: new Date().toISOString(),
  };
  reactions.unshift(reaction);
  setItem(STORAGE_KEYS.REACTIONS, reactions);
  return reaction;
}

// Queries

export function getEntriesByDate(date: Date): DiaryEntry[] {
  return getEntries().filter((e) => isSameDay(new Date(e.createdAt), date));
}

export function getEntriesByMonth(year: number, month: number): DiaryEntry[] {
  return getEntries().filter((e) => {
    const d = new Date(e.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getEntryWithReaction(entryId: string): EntryWithReaction | null {
  const entries = getEntries();
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) return null;
  const reaction = getReactions().find((r) => r.entryId === entryId) ?? null;
  return { ...entry, reaction };
}

export function getAllEntriesWithReactions(): EntryWithReaction[] {
  const entries = getEntries();
  const reactions = getReactions();
  return entries.map((entry) => ({
    ...entry,
    reaction: reactions.find((r) => r.entryId === entry.id) ?? null,
  }));
}

// Theme

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  const raw = localStorage.getItem(STORAGE_KEYS.THEME);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

export function setTheme(mode: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THEME, mode);
}

// Profile updates

export function updateFriendTone(tone: FriendTone): void {
  const profile = getDeviceProfile();
  if (!profile) return;
  setItem(STORAGE_KEYS.PROFILE, { ...profile, friendTone: tone });
}

// Data management

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.ENTRIES);
  localStorage.removeItem(STORAGE_KEYS.REACTIONS);
}
