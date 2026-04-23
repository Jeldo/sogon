"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TONE_OPTIONS } from "@/lib/constants";
import {
  getDeviceProfile,
  updateFriendTone,
  clearAllData,
} from "@/lib/storage";
import type { FriendTone } from "@/lib/types";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Button } from "@/components/ui/Button";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [currentTone, setCurrentTone] = useState<FriendTone>("warm");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const profile = getDeviceProfile();
    if (profile) setCurrentTone(profile.friendTone);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleToneChange(tone: FriendTone) {
    setCurrentTone(tone);
    updateFriendTone(tone);
  }

  function handleReset() {
    clearAllData();
    setConfirmOpen(false);
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "var(--scrim)" }}
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          className="w-full max-w-[440px] mx-4 bg-[var(--surface-2)] rounded-[var(--r-lg)] p-7"
          style={{
            boxShadow: "var(--shadow-modal)",
            animation:
              "hand-write-in var(--dur-enter) var(--ease-spring) forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="t-heading">설정</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--ink-5)] hover:text-[var(--text)] transition-colors duration-150"
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </div>

          {/* Section: 비밀친구 */}
          <section className="mb-6">
            <h3 className="t-label mb-2.5">비밀친구</h3>
            <div className="flex gap-2">
              {TONE_OPTIONS.map((option) => {
                const selected = currentTone === option.tone;
                return (
                  <button
                    key={option.tone}
                    type="button"
                    onClick={() => handleToneChange(option.tone)}
                    className="flex-1 rounded-[var(--r-sm)] bg-[var(--surface-3)] py-3.5 px-2 text-center transition-all duration-150"
                    style={{
                      boxShadow: selected
                        ? "inset 0 0 0 2px var(--accent)"
                        : "none",
                    }}
                  >
                    <div
                      className="text-[22px] leading-none"
                      style={{ opacity: selected ? 1 : 0.7 }}
                    >
                      {option.emoji}
                    </div>
                    <div
                      className="mt-1 text-[11px]"
                      style={{
                        color: selected
                          ? "var(--text)"
                          : "var(--text-dim)",
                        fontWeight: selected ? 700 : 400,
                      }}
                    >
                      {option.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: "var(--border-soft)" }}
          />

          {/* Section: 데이터 */}
          <section className="mb-6">
            <h3 className="t-label mb-2.5">데이터</h3>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="t-body">데이터 초기화</p>
                <p className="t-small mt-0.5">
                  모든 기록과 리액션을 삭제합니다
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmOpen(true)}
              >
                reset
              </Button>
            </div>
          </section>

          {/* Footer */}
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={onClose}
            >
              close
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleReset}
        title="정말 초기화할까요?"
        description="모든 기록과 비밀친구의 리액션이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없어요."
        confirmLabel="삭제하기"
      />
    </>
  );
}
