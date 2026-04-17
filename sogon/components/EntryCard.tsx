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

  return (
    <div className="relative bg-background border border-border rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* Mood badge */}
      {entry.mood && !editing && (
        <div
          aria-label={MOOD_META[entry.mood].label}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-primary-100 border border-primary-200 shadow-sm flex items-center justify-center text-lg leading-none select-none"
        >
          {MOOD_META[entry.mood].emoji}
        </div>
      )}

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

      {/* Entry text or edit mode */}
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[80px] rounded-[10px] border border-border p-3 text-base font-body text-foreground resize-none focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(110,189,90,0.15)]"
          />
          <MoodPicker value={editMood} onChange={setEditMood} />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditing(false);
                setEditContent(entry.content);
                setEditMood(entry.mood);
              }}
              className="p-1.5 rounded-[6px] text-text-tertiary hover:bg-elevated transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editContent.trim()}
              className="p-1.5 rounded-[6px] text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-40"
            >
              <Check size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ) : (
        <p
          className={`text-lg font-body text-foreground leading-relaxed ${entry.mood ? "pr-12" : ""}`}
        >
          {entry.content}
        </p>
      )}

      {/* Reaction */}
      {entry.reaction && !editing && (
        <p className="mt-3 text-xl font-handwriting text-text-secondary">
          {entry.reaction.content}
        </p>
      )}

      {/* Footer: timestamp + actions */}
      {!editing && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-text-tertiary">
            {formatTime(new Date(entry.createdAt))}
          </p>

          {/* Edit/Delete buttons - visible on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => {
                setEditContent(entry.content);
                setEditMood(entry.mood);
                setEditing(true);
              }}
              className="p-1.5 rounded-[6px] text-text-tertiary hover:text-text-primary hover:bg-elevated transition-colors"
            >
              <Pencil size={14} strokeWidth={1.5} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <span>삭제?</span>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-[6px] text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Check size={14} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1 rounded-[6px] text-text-tertiary hover:bg-elevated transition-colors"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-[6px] text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
