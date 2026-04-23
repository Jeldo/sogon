import type { FriendTone } from "@/lib/types";

type ToneOption = {
  tone: FriendTone;
  emoji: string;
  bgColor: string;
  name: string;
  exampleReaction: string;
};

export const TONE_OPTIONS = [
  {
    tone: "warm",
    emoji: "\u{1F917}",
    bgColor: "var(--tone-warm)",
    name: "따뜻한 친구",
    exampleReaction: "그러구나, 오늘도 고생 많았다",
  },
  {
    tone: "cool",
    emoji: "\u{1F60E}",
    bgColor: "var(--tone-cool)",
    name: "쿨한 친구",
    exampleReaction: "오 괜찮은데? 잘했네",
  },
  {
    tone: "energetic",
    emoji: "\u{1F389}",
    bgColor: "var(--tone-energetic)",
    name: "텐션 높은 친구",
    exampleReaction: "헐 대박!! 완전 좋다!!",
  },
] as const satisfies readonly ToneOption[];

export const STORAGE_KEYS = {
  PROFILE: "sogon_profile",
  ENTRIES: "sogon_entries",
  REACTIONS: "sogon_reactions",
} as const;
