"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { formatTime } from "@/lib/date-utils";
import { updateEntry, deleteEntry } from "@/lib/storage";
import { MOOD_META } from "@/lib/mood";
import type { EntryWithReaction, Mood } from "@/lib/types";
import { MoodPicker } from "@/components/MoodPicker";

type EntryCardProps = {
  entry: EntryWithReaction;
  onUpdate?: () => void;
};

export function EntryCard({ entry, onUpdate }: EntryCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [editMood, setEditMood] = useState<Mood | null>(entry.mood);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hover, setHover] = useState(false);

  function handleSaveEdit() {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    updateEntry(entry.id, { content: trimmed, mood: editMood });
    setEditing(false);
    onUpdate?.();
  }

  function handleDelete() {
    deleteEntry(entry.id);
    setConfirmDelete(false);
    onUpdate?.();
  }

  const mood = entry.mood ? MOOD_META[entry.mood] : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative bg-[var(--surface)] rounded-[var(--r-sm)] p-5 transition-all duration-200 ease-[var(--ease-out)]"
      style={{
        boxShadow: hover ? "var(--shadow-pop)" : "var(--shadow-card)",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      {/* Mood badge (top right) */}
      {mood && !editing && (
        <div
          aria-label={mood.label}
          className="absolute top-[18px] right-[18px] z-10 flex items-center gap-1.5 select-none"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: mood.color,
              boxShadow: `0 0 10px ${mood.color}`,
            }}
          />
          <span className="t-small">{mood.label}</span>
        </div>
      )}

      {/* Image (above text) */}
      {entry.imageDataUrl && (
        <div className="mb-3 rounded-[var(--r-sm)] overflow-hidden">
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

      {/* Entry text or edit mode */}
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[80px] rounded-[var(--r-sm)] bg-[var(--surface-2)] p-3 text-[15px] text-[var(--text)] resize-none outline-none shadow-[var(--shadow-inset)] focus:shadow-[var(--shadow-inset),0_0_0_2px_var(--accent),var(--glow-amber)] transition-shadow"
          />
          <MoodPicker value={editMood} onChange={setEditMood} />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditing(false);
                setEditContent(entry.content);
                setEditMood(entry.mood);
              }}
              aria-label="취소"
              className="w-8 h-8 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] transition-colors flex items-center justify-center"
            >
              <X size={14} strokeWidth={1.8} />
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              aria-label="저장"
              className="w-8 h-8 rounded-full text-[var(--accent)] hover:bg-[var(--surface-3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Check size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <p className={`t-body-lg ${entry.mood ? "pr-[90px]" : ""}`}>
          {entry.content}
        </p>
      )}

      {/* Friend reaction — handwriting amber glow */}
      {entry.reaction && !editing && (
        <p className="t-friend mt-3">{entry.reaction.content}</p>
      )}

      {/* Footer: timestamp + actions */}
      {!editing && (
        <div className="mt-3.5 flex items-center justify-between">
          <span className="t-small">{formatTime(new Date(entry.createdAt))}</span>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => {
                setEditContent(entry.content);
                setEditMood(entry.mood);
                setEditing(true);
              }}
              aria-label="편집"
              className="w-7 h-7 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center"
            >
              <Pencil size={14} strokeWidth={1.8} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-dim)]">
                <span>삭제?</span>
                <button
                  onClick={handleDelete}
                  aria-label="삭제 확인"
                  className="w-6 h-6 rounded-full text-[var(--negative)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center"
                >
                  <Check size={14} strokeWidth={2} />
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  aria-label="삭제 취소"
                  className="w-6 h-6 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                aria-label="삭제"
                className="w-7 h-7 rounded-full text-[var(--text-muted)] hover:text-[var(--negative)] hover:bg-[var(--surface-3)] transition-colors flex items-center justify-center"
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
