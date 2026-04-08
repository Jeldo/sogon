"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { formatTime } from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";
import {
  updateEntry,
  deleteEntry,
  getImageSignedUrl,
} from "@/lib/supabase/queries";
import type { EntryWithReaction } from "@/lib/types";

type EntryCardProps = {
  entry: EntryWithReaction;
  onUpdate?: () => void;
};

export function EntryCard({ entry, onUpdate }: EntryCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!entry.imagePath) return;
    const supabase = createClient();
    getImageSignedUrl(supabase, entry.imagePath).then((url) => {
      if (url) setImageUrl(url);
    });
  }, [entry.imagePath]);

  async function handleSaveEdit() {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    const supabase = createClient();
    await updateEntry(supabase, entry.id, { content: trimmed });
    setEditing(false);
    onUpdate?.();
  }

  async function handleDelete() {
    const supabase = createClient();
    await deleteEntry(supabase, entry.id, entry.imagePath);
    setConfirmDelete(false);
    onUpdate?.();
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* Image (above text) */}
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

      {/* Entry text or edit mode */}
      {editing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[80px] rounded-[10px] border border-neutral-200 p-3 text-base font-body text-foreground resize-none focus:outline-none focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(110,189,90,0.15)]"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setEditing(false);
                setEditContent(entry.content);
              }}
              className="p-1.5 rounded-[6px] text-neutral-400 hover:bg-neutral-100 transition-colors"
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
        <p className="text-lg font-body text-foreground leading-relaxed">
          {entry.content}
        </p>
      )}

      {/* Reaction */}
      {entry.reaction && !editing && (
        <p className="mt-3 text-xl font-handwriting text-neutral-500">
          {entry.reaction.content}
        </p>
      )}

      {/* Footer: timestamp + actions */}
      {!editing && (
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            {formatTime(new Date(entry.createdAt))}
          </p>

          {/* Edit/Delete buttons - visible on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => {
                setEditContent(entry.content);
                setEditing(true);
              }}
              className="p-1.5 rounded-[6px] text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Pencil size={14} strokeWidth={1.5} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <span>삭제?</span>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-[6px] text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Check size={14} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1 rounded-[6px] text-neutral-400 hover:bg-neutral-100 transition-colors"
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
