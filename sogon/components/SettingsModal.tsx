"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { TONE_OPTIONS } from "@/lib/constants";
import {
  getDeviceProfile,
  getTheme,
  setTheme,
  updateFriendTone,
  clearAllData,
} from "@/lib/storage";
import type { FriendTone, ThemeMode } from "@/lib/types";
import { THEME_MODES } from "@/lib/types";
import { ConfirmModal } from "@/components/ConfirmModal";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const THEME_LABELS: Record<ThemeMode, { emoji: string; label: string }> = {
  light: { emoji: "☀️", label: "라이트" },
  dark: { emoji: "🌙", label: "다크" },
  system: { emoji: "💻", label: "시스템" },
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [currentTone, setCurrentTone] = useState<FriendTone>("warm");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("system");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const profile = getDeviceProfile();
    if (profile) setCurrentTone(profile.friendTone);
    setCurrentTheme(getTheme());
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

  function handleThemeChange(mode: ThemeMode) {
    setCurrentTheme(mode);
    setTheme(mode);
    applyTheme(mode);
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div className="w-full max-w-[480px] mx-4 bg-background rounded-[16px] p-7 shadow-lg animate-[reaction-appear_350ms_var(--ease-out)_forwards]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              설정
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 bg-elevated rounded-full flex items-center justify-center text-text-secondary hover:bg-border transition-colors duration-150"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Section: 비밀친구 */}
          <section className="mb-6">
            <h3 className="text-xs font-medium text-text-secondary tracking-wide mb-2.5">
              비밀친구
            </h3>
            <div className="flex gap-2">
              {TONE_OPTIONS.map((option) => {
                const selected = currentTone === option.tone;
                return (
                  <button
                    key={option.tone}
                    type="button"
                    onClick={() => handleToneChange(option.tone)}
                    className={`flex-1 rounded-[12px] py-3.5 px-2 text-center transition-all duration-150 ${
                      selected
                        ? "border-2 border-primary-600 bg-primary-muted"
                        : "border border-border hover:border-text-placeholder"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div
                      className={`text-[11px] font-medium ${
                        selected ? "text-primary-700" : "text-text-secondary"
                      }`}
                    >
                      {option.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-elevated mb-6" />

          {/* Section: 테마 */}
          <section className="mb-6">
            <h3 className="text-xs font-medium text-text-secondary tracking-wide mb-2.5">
              테마
            </h3>
            <div className="flex bg-elevated rounded-[10px] p-[3px]">
              {THEME_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleThemeChange(mode)}
                  className={`flex-1 text-center py-2 rounded-[8px] text-[13px] transition-all duration-150 ${
                    currentTheme === mode
                      ? "bg-background text-foreground font-medium shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {THEME_LABELS[mode].emoji} {THEME_LABELS[mode].label}
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-elevated mb-6" />

          {/* Section: 데이터 */}
          <section>
            <h3 className="text-xs font-medium text-text-secondary tracking-wide mb-2.5">
              데이터
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">데이터 초기화</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  모든 기록과 리액션을 삭제합니다
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="border border-[#e57373] text-[#e57373] rounded-[10px] px-4 py-1.5 text-xs font-medium transition-all duration-150 hover:bg-[#e57373] hover:text-white active:scale-[0.97]"
              >
                초기화
              </button>
            </div>
          </section>
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

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark", "system-theme");
  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "system") {
    root.classList.add("system-theme");
  }
}
