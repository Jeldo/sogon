"use client";

import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-[340px] mx-4 bg-background rounded-[20px] p-7 shadow-lg text-center animate-[reaction-appear_350ms_var(--ease-out)_forwards]">
        <div className="w-12 h-12 bg-[#fce4e4] rounded-full flex items-center justify-center mx-auto mb-4 text-[22px]">
          ⚠️
        </div>
        <h3 className="text-base font-body font-medium text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-tertiary mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-[10px] bg-elevated text-sm font-medium text-text-primary transition-all duration-150 hover:bg-border active:scale-[0.97]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-[10px] bg-[#e57373] text-sm font-medium text-white transition-all duration-150 hover:bg-[#d32f2f] active:scale-[0.97]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
