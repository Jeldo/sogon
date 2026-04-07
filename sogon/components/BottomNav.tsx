"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/record", label: "기록하기", icon: PenLine },
  { href: "/collection", label: "모아보기", icon: BookOpen },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex items-center justify-around h-14 z-50">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors duration-150 ${
              active ? "text-primary-700" : "text-neutral-400"
            }`}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span>{label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-400 opacity-50 cursor-default"
        disabled
      >
        <Settings size={20} strokeWidth={1.5} />
        <span>설정</span>
      </button>
    </nav>
  );
}
