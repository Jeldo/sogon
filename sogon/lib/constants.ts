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
    bgColor: "#fde8e8",
    name: "\uB530\uB73B\uD55C \uCE5C\uAD6C",
    exampleReaction: "\uADF8\uB7AC\uAD6C\uB098, \uACE0\uC0DD\uD588\uB2E4 \uC624\uB298\uB3C4",
  },
  {
    tone: "cool",
    emoji: "\u{1F60E}",
    bgColor: "#e0f0ff",
    name: "\uCFE8\uD55C \uCE5C\uAD6C",
    exampleReaction: "\uC624 \uAD1C\uCC2E\uC740\uB370? \uC798\uD588\uB124",
  },
  {
    tone: "energetic",
    emoji: "\u{1F389}",
    bgColor: "#fff8e0",
    name: "\uD150\uC158 \uB192\uC740 \uCE5C\uAD6C",
    exampleReaction: "\uD5D0 \uB300\uBC15!! \uC644\uC804 \uC88B\uB2E4!!",
  },
] as const satisfies readonly ToneOption[];

export const STORAGE_KEYS = {
  PROFILE: "sogon_profile",
  ENTRIES: "sogon_entries",
  REACTIONS: "sogon_reactions",
} as const;
