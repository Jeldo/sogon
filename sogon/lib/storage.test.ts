import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// Mock crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => `test-uuid-${++uuidCounter}`,
  },
});

import {
  getDeviceProfile,
  setDeviceProfile,
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getReactions,
  addReaction,
  getEntryWithReaction,
  getTheme,
  setTheme,
  updateFriendTone,
  clearAllData,
} from "./storage";

beforeEach(() => {
  localStorageMock.clear();
  uuidCounter = 0;
});

describe("DeviceProfile", () => {
  it("returns null when no profile exists", () => {
    expect(getDeviceProfile()).toBeNull();
  });

  it("saves and retrieves a profile", () => {
    setDeviceProfile("warm");
    const profile = getDeviceProfile();
    expect(profile?.friendTone).toBe("warm");
    expect(profile?.createdAt).toBeTruthy();
  });
});

describe("Entries", () => {
  it("returns empty array when no entries exist", () => {
    expect(getEntries()).toEqual([]);
  });

  it("adds an entry and retrieves it", () => {
    const entry = addEntry("Hello world", null);
    expect(entry.id).toBe("test-uuid-1");
    expect(entry.content).toBe("Hello world");
    expect(entry.imageDataUrl).toBeNull();

    const entries = getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].content).toBe("Hello world");
  });

  it("adds entries in reverse chronological order", () => {
    addEntry("First", null);
    addEntry("Second", null);
    const entries = getEntries();
    expect(entries[0].content).toBe("Second");
    expect(entries[1].content).toBe("First");
  });

  it("updates an entry", () => {
    addEntry("Original", null);
    const updated = updateEntry("test-uuid-1", { content: "Updated" });
    expect(updated?.content).toBe("Updated");

    const entries = getEntries();
    expect(entries[0].content).toBe("Updated");
  });

  it("returns null when updating non-existent entry", () => {
    expect(updateEntry("non-existent", { content: "x" })).toBeNull();
  });

  it("deletes an entry and its reaction", () => {
    const entry = addEntry("To delete", null);
    addReaction(entry.id, "Nice!", "warm");

    expect(getReactions()).toHaveLength(1);

    const deleted = deleteEntry(entry.id);
    expect(deleted).toBe(true);
    expect(getEntries()).toHaveLength(0);
    expect(getReactions()).toHaveLength(0);
  });

  it("returns false when deleting non-existent entry", () => {
    expect(deleteEntry("non-existent")).toBe(false);
  });
});

describe("Reactions", () => {
  it("adds a reaction linked to an entry", () => {
    const entry = addEntry("Test", null);
    const reaction = addReaction(entry.id, "Great!", "cool");

    expect(reaction.entryId).toBe(entry.id);
    expect(reaction.content).toBe("Great!");
    expect(reaction.tone).toBe("cool");
  });
});

describe("getEntryWithReaction", () => {
  it("returns entry with reaction joined", () => {
    const entry = addEntry("Test", null);
    addReaction(entry.id, "Nice!", "warm");

    const result = getEntryWithReaction(entry.id);
    expect(result?.content).toBe("Test");
    expect(result?.reaction?.content).toBe("Nice!");
  });

  it("returns entry with null reaction when none exists", () => {
    const entry = addEntry("Test", null);
    const result = getEntryWithReaction(entry.id);
    expect(result?.reaction).toBeNull();
  });

  it("returns null for non-existent entry", () => {
    expect(getEntryWithReaction("non-existent")).toBeNull();
  });
});

describe("Theme", () => {
  it("returns 'system' when no theme is set", () => {
    expect(getTheme()).toBe("system");
  });

  it("saves and retrieves theme", () => {
    setTheme("dark");
    expect(getTheme()).toBe("dark");
  });
});

describe("updateFriendTone", () => {
  it("updates tone on existing profile", () => {
    setDeviceProfile("warm");
    updateFriendTone("cool");
    const profile = getDeviceProfile();
    expect(profile?.friendTone).toBe("cool");
  });

  it("preserves createdAt when updating tone", () => {
    setDeviceProfile("warm");
    const original = getDeviceProfile();
    updateFriendTone("energetic");
    const updated = getDeviceProfile();
    expect(updated?.createdAt).toBe(original?.createdAt);
  });
});

describe("clearAllData", () => {
  it("clears entries and reactions but preserves profile", () => {
    setDeviceProfile("warm");
    addEntry("Test entry", null);
    addReaction("test-uuid-2", "Nice!", "warm");

    clearAllData();

    expect(getDeviceProfile()).not.toBeNull();
    expect(getEntries()).toEqual([]);
    expect(getReactions()).toEqual([]);
  });
});
