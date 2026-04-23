"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/record", label: "기록", icon: PenLine },
  { href: "/collection", label: "모아보기", icon: BookOpen },
] as const;

type BottomNavProps = {
  onSettingsClick: () => void;
};

export function BottomNav({ onSettingsClick }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--ink-0)] flex items-center justify-around h-14 z-50 px-2.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors duration-150 ${
              active
                ? "text-[var(--text)] font-bold"
                : "text-[var(--text-muted)]"
            }`}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onSettingsClick}
        className="flex flex-col items-center gap-0.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-dim)] transition-colors duration-150"
      >
        <Settings size={22} strokeWidth={1.8} />
        <span>설정</span>
      </button>
    </nav>
  );
}
