"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, ImagePlus, X } from "lucide-react";
import { formatKoreanDate, formatTime } from "@/lib/date-utils";
import {
  addEntry,
  getDeviceProfile,
  getEntriesByDate,
  getReactions,
} from "@/lib/storage";
import { compressImage } from "@/lib/image";
import type { EntryWithReaction, Mood } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";
import { MoodPicker } from "@/components/MoodPicker";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export default function RecordPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [todayEntries, setTodayEntries] = useState<EntryWithReaction[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    loadTodayEntries();
  }, []);

  function loadTodayEntries() {
    const entries = getEntriesByDate(new Date());
    const reactions = getReactions();
    const withReactions: EntryWithReaction[] = entries.map((entry) => ({
      ...entry,
      reaction: reactions.find((r) => r.entryId === entry.id) ?? null,
    }));
    setTodayEntries(withReactions);
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressImage(file);
    setImageDataUrl(dataUrl);
    e.target.value = "";
  }

  async function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    const entry = addEntry(trimmed, imageDataUrl, mood);

    const profile = getDeviceProfile();
    try {
      const res = await fetch("/api/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, tone: profile?.friendTone }),
      });
      if (res.ok) {
        const { reaction } = await res.json();
        const { addReaction } = await import("@/lib/storage");
        addReaction(entry.id, reaction, profile!.friendTone);
      }
    } catch {
      // Silently fail — reaction screen will handle missing reaction
    }

    router.push(`/record/${entry.id}/reaction`);
  }

  return (
    <div className="max-w-[720px] mx-auto px-6 py-10 flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="t-label">today</div>
        <h1 className="t-display mt-1.5">오늘 뭐 했어?</h1>
        <p className="t-caption mt-1">
          {now
            ? `${formatKoreanDate(now)} · ${formatTime(now)}`
            : " "}
        </p>
      </div>

      {/* Composer */}
      <div className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="떠오르는 대로 써도 괜찮아."
          className="w-full min-h-[140px] rounded-[var(--r-md)] bg-[var(--surface-2)] p-5 text-[17px] leading-[1.6] text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none outline-none border-0 transition-shadow"
          style={{
            boxShadow: focused
              ? "var(--shadow-inset), 0 0 0 2px var(--accent), var(--glow-amber)"
              : "var(--shadow-inset)",
            fontFamily: "var(--font-ui)",
          }}
        />

        {/* Image preview */}
        {imageDataUrl && (
          <div className="relative inline-block">
            <div className="rounded-[var(--r-md)] overflow-hidden">
              <Image
                src={imageDataUrl}
                alt="첨부 미리보기"
                width={0}
                height={0}
                sizes="200px"
                className="w-auto h-auto max-h-[200px]"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              aria-label="첨부 제거"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--surface-3)] text-[var(--text)] flex items-center justify-center hover:bg-[var(--ink-5)] transition-colors"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Mood picker */}
        <MoodPicker value={mood} onChange={setMood} />

        {/* Action bar */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <IconButton
            circle
            aria-label="사진 첨부"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={18} strokeWidth={1.8} />
          </IconButton>
          <div className="flex-1" />
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            trailing={<Send size={14} strokeWidth={2} />}
          >
            기록하기
          </Button>
        </div>
      </div>

      {/* Today's entries */}
      {todayEntries.length > 0 && (
        <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <h2 className="t-label mb-4">today&rsquo;s entries</h2>
          <div className="flex flex-col gap-3.5">
            {todayEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onUpdate={loadTodayEntries}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
