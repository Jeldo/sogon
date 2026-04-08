"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, ImagePlus, X } from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";
import {
  addEntry,
  updateEntry,
  getEntriesByDate,
  getProfile,
} from "@/lib/supabase/queries";
import { compressImage } from "@/lib/image";
import type { EntryWithReaction } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

export default function RecordPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [todayEntries, setTodayEntries] = useState<EntryWithReaction[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Manage object URL lifecycle
  useEffect(() => {
    if (!imageBlob) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageBlob);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageBlob]);

  useEffect(() => {
    loadTodayEntries();
  }, []);

  async function loadTodayEntries() {
    const supabase = createClient();
    const entries = await getEntriesByDate(supabase, new Date());
    setTodayEntries(entries);
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const blob = await compressImage(file);
    setImageBlob(blob);
    e.target.value = "";
  }

  function handleRemoveImage() {
    setImageBlob(null);
  }

  async function handleSubmit() {
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    const supabase = createClient();

    // 1. Create entry
    const entry = await addEntry(supabase, trimmed, null);

    // 2. Upload image if present
    if (imageBlob) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const path = `${user.id}/${entry.id}.jpg`;
        const { data: uploadData } = await supabase.storage
          .from("diary-images")
          .upload(path, imageBlob, { contentType: "image/jpeg" });
        if (uploadData) {
          await updateEntry(supabase, entry.id, { imagePath: uploadData.path });
        }
      }
    }

    // 3. Request AI reaction (saves to DB server-side)
    const profile = await getProfile(supabase);
    try {
      await fetch("/api/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: entry.id,
          content: trimmed,
          tone: profile?.friendTone,
        }),
      });
    } catch {
      // Silently fail — reaction page handles missing reaction
    }

    router.push(`/record/${entry.id}/reaction`);
  }

  const today = formatKoreanDate(new Date());

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-body font-semibold text-foreground">
          기록하기
        </h2>
        <p className="text-sm text-neutral-500 mt-1">{today}</p>
      </div>

      {/* Textarea */}
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘 뭐 했어?"
          className="w-full min-h-[120px] rounded-[16px] border border-neutral-200 p-5 text-lg font-body text-foreground placeholder:text-neutral-300 resize-none focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(110,189,90,0.15)] transition-all duration-150"
        />

        {/* Image preview */}
        {imagePreviewUrl && (
          <div className="relative inline-block">
            <div className="rounded-[16px] overflow-hidden border border-neutral-200">
              <Image
                src={imagePreviewUrl}
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
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neutral-600 text-white flex items-center justify-center hover:bg-neutral-700 transition-colors"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-[10px] bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-[0.97] transition-all duration-150"
            >
              <ImagePlus size={18} strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="flex items-center gap-2 py-2.5 px-5 rounded-[10px] text-sm font-body bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.97] shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary-600 disabled:active:scale-100"
          >
            <Send size={16} strokeWidth={1.5} />
            <span>기록하기</span>
          </button>
        </div>
      </div>

      {/* Today's entries */}
      {todayEntries.length > 0 && (
        <div className="mt-10">
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="text-sm text-neutral-400 mb-4">오늘의 기록</h3>
            <div className="space-y-4">
              {todayEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={loadTodayEntries}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
