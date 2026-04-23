"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { EntryWithReaction, FriendTone } from "@/lib/types";
import { TONE_OPTIONS } from "@/lib/constants";
import { TypingDots } from "@/components/ui/TypingDots";
import { Avatar } from "@/components/ui/Avatar";
import { MOOD_META } from "@/lib/mood";

type ReactionViewProps = {
  entry: EntryWithReaction;
  tone: FriendTone;
};

export function ReactionView({ entry, tone }: ReactionViewProps) {
  const [showReaction, setShowReaction] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  const toneOption = TONE_OPTIONS.find((t) => t.tone === tone);
  const mood = entry.mood ? MOOD_META[entry.mood] : null;

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setShowTyping(false);
      setShowReaction(true);
    }, 1500);
    return () => clearTimeout(typingTimer);
  }, []);

  const reactionText =
    entry.reaction?.content ?? toneOption?.exampleReaction ?? "";

  return (
    <div className="flex flex-col gap-3">
      {/* Date label */}
      <div className="t-label text-center mb-2">· 오늘 ·</div>

      {/* User message bubble (right-aligned) */}
      <div className="flex justify-end">
        <div
          className="max-w-[80%] bg-[var(--surface-3)] text-[var(--text)] px-[18px] py-3 rounded-[22px_22px_6px_22px]"
          style={{ fontSize: 15, lineHeight: 1.55 }}
        >
          {entry.imageDataUrl && (
            <div className="mb-3 -mx-3 -mt-1 rounded-[var(--r-sm)] overflow-hidden">
              <Image
                src={entry.imageDataUrl}
                alt="첨부 이미지"
                width={0}
                height={0}
                sizes="400px"
                className="w-full h-auto"
                unoptimized
              />
            </div>
          )}
          <p>{entry.content}</p>
          {mood && (
            <div
              aria-label={mood.label}
              className="mt-2 inline-flex items-center gap-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: mood.color,
                  boxShadow: `0 0 8px ${mood.color}`,
                }}
              />
              <span className="t-small">{mood.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Friend typing / reaction bubble */}
      {showTyping && (
        <div className="flex items-end gap-2.5">
          <Avatar tone={tone} size={32} />
          <TypingDots />
        </div>
      )}

      {showReaction && reactionText && (
        <div className="flex items-end gap-2.5">
          <Avatar tone={tone} size={32} />
          <div
            className="max-w-[80%] t-friend px-1.5 py-2 rounded-[22px_22px_22px_6px]"
            style={{
              animation:
                "hand-write-in var(--dur-enter) var(--ease-spring) both",
            }}
          >
            {reactionText}
          </div>
        </div>
      )}
    </div>
  );
}
