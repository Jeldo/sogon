export const FRIEND_TONES = ["warm", "cool", "energetic"] as const;
export type FriendTone = (typeof FRIEND_TONES)[number];

export const MOODS = ["happy", "calm", "sad", "frustrated", "tired"] as const;
export type Mood = (typeof MOODS)[number];

export type DiaryEntry = {
  id: string;
  content: string;
  imageDataUrl: string | null;
  mood: Mood | null;
  createdAt: string;
};

export type Reaction = {
  id: string;
  entryId: string;
  content: string;
  tone: FriendTone;
  createdAt: string;
};

export type EntryWithReaction = DiaryEntry & { reaction: Reaction | null };

export type DeviceProfile = {
  friendTone: FriendTone;
  createdAt: string;
};

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
