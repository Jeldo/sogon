"use client";

import Image from "next/image";
import { formatTime } from "@/lib/date-utils";
import type { EntryWithReaction } from "@/lib/types";

type EntryCardProps = {
  entry: EntryWithReaction;
};

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image (above text) */}
      {entry.imageDataUrl && (
        <div className="mb-3 rounded-[16px] overflow-hidden">
          <Image
            src={entry.imageDataUrl}
            alt="첨부 이미지"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            unoptimized
          />
        </div>
      )}

      {/* Entry text */}
      <p className="text-lg font-body text-foreground leading-relaxed">
        {entry.content}
      </p>

      {/* Reaction */}
      {entry.reaction && (
        <p className="mt-3 text-xl font-handwriting text-neutral-500">
          {entry.reaction.content}
        </p>
      )}

      {/* Timestamp */}
      <p className="mt-2 text-xs text-neutral-400">
        {formatTime(new Date(entry.createdAt))}
      </p>
    </div>
  );
}
