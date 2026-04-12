export const FRIEND_TONES = ["warm", "cool", "energetic"] as const;
export type FriendTone = (typeof FRIEND_TONES)[number];

export type DiaryEntry = {
  id: string;
  content: string;
  imageDataUrl: string | null;
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
