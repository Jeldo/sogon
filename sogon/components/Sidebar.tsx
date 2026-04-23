"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/record", label: "기록", icon: PenLine },
  { href: "/collection", label: "모아보기", icon: BookOpen },
] as const;

type SidebarProps = {
  onSettingsClick: () => void;
};

export function Sidebar({ onSettingsClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar (>=1024px) */}
      <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-[var(--ink-0)] sticky top-0 h-dvh px-[18px] py-5 gap-6">
        {/* Logo */}
        <div className="px-2.5">
          <div
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "var(--text)",
            }}
          >
            소곤
          </div>
          <div className="t-small mt-0.5">you, quietly</div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--r-sm)] text-[14px] transition-colors duration-150 ${
                  active
                    ? "bg-[var(--surface)] text-[var(--text)] font-bold"
                    : "text-[var(--text-dim)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings (bottom) */}
        <div className="mt-auto">
          <button
            type="button"
            onClick={onSettingsClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--r-sm)] text-[14px] text-[var(--text-dim)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors duration-150 w-full"
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>설정</span>
          </button>
        </div>
      </aside>

      {/* Tablet sidebar (768~1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 flex-shrink-0 bg-[var(--ink-0)] sticky top-0 h-dvh items-center py-5">
        <div className="pb-4">
          <span
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "var(--text)",
            }}
          >
            소
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 mt-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`flex items-center justify-center w-10 h-10 rounded-[var(--r-sm)] transition-colors duration-150 ${
                  active
                    ? "bg-[var(--surface)] text-[var(--text)]"
                    : "text-[var(--text-dim)] hover:bg-[var(--surface)]"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            type="button"
            onClick={onSettingsClick}
            aria-label="설정"
            className="flex items-center justify-center w-10 h-10 rounded-[var(--r-sm)] text-[var(--text-dim)] hover:bg-[var(--surface)] transition-colors duration-150"
          >
            <Settings size={18} strokeWidth={1.8} />
          </button>
        </div>
      </aside>
    </>
  );
}
