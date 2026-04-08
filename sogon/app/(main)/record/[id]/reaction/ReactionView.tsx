"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { EntryWithReaction, FriendTone } from "@/lib/types";
import { TONE_OPTIONS } from "@/lib/constants";
import { TypingIndicator } from "@/components/TypingIndicator";
import { createClient } from "@/lib/supabase/client";
import { getImageSignedUrl } from "@/lib/supabase/queries";

type ReactionViewProps = {
  entry: EntryWithReaction;
  tone: FriendTone;
};

export function ReactionView({ entry, tone }: ReactionViewProps) {
  const [showReaction, setShowReaction] = useState(false);
  const [showTyping, setShowTyping] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const toneOption = TONE_OPTIONS.find((t) => t.tone === tone);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setShowTyping(false);
      setShowReaction(true);
    }, 1500);

    return () => clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    if (!entry.imagePath) return;
    const supabase = createClient();
    getImageSignedUrl(supabase, entry.imagePath).then((url) => {
      if (url) setImageUrl(url);
    });
  }, [entry.imagePath]);

  return (
    <div className="space-y-6">
      {/* My entry card */}
      <div>
        <p className="text-xs text-neutral-400 mb-2">방금 나의 기록</p>
        <div className="bg-white border border-neutral-200 rounded-[20px] p-5">
          {imageUrl && (
            <div className="mb-3 rounded-[16px] overflow-hidden">
              <Image
                src={imageUrl}
                alt="첨부 이미지"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
                unoptimized
              />
            </div>
          )}
          <p className="text-lg font-body text-foreground leading-relaxed">
            {entry.content}
          </p>
        </div>
      </div>

      {/* Typing indicator / Reaction */}
      <div>
        {showTyping && (
          <div className="bg-neutral-100 rounded-[20px] p-5 inline-block">
            <TypingIndicator />
          </div>
        )}

        {showReaction && entry.reaction && (
          <div
            className="bg-neutral-100 rounded-[20px] p-5"
            style={{
              animation:
                "reaction-appear 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-base">
                {toneOption?.emoji}
              </span>
              <span className="text-xs text-primary-600 font-body">
                비밀친구
              </span>
            </div>
            <p className="text-xl font-handwriting text-neutral-600 leading-relaxed">
              {entry.reaction.content}
            </p>
          </div>
        )}

        {showReaction && !entry.reaction && (
          <div className="bg-neutral-100 rounded-[20px] p-5">
            <p className="text-xl font-handwriting text-neutral-600">
              {toneOption?.exampleReaction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
