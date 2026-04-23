import type { FriendTone } from "@/lib/types";

const TONE_META: Record<FriendTone, { bg: string; emoji: string }> = {
  warm: { bg: "var(--tone-warm)", emoji: "🤗" },
  cool: { bg: "var(--tone-cool)", emoji: "😎" },
  energetic: { bg: "var(--tone-energetic)", emoji: "🎉" },
};

type AvatarProps = {
  tone: FriendTone;
  size?: number;
};

export function Avatar({ tone, size = 32 }: AvatarProps) {
  const meta = TONE_META[tone];
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 select-none"
      style={{
        width: size,
        height: size,
        background: meta.bg,
        color: "var(--accent-ink)",
        fontSize: size * 0.5,
      }}
    >
      {meta.emoji}
    </span>
  );
}
