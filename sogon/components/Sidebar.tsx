"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/record", label: "기록하기", icon: PenLine },
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
      <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 border-r border-border bg-surface sticky top-0 h-dvh">
        {/* Logo */}
        <div className="px-6 py-5">
          <h1 className="text-xl font-heading text-text-primary">소곤</h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors duration-150 ${
                  active
                    ? "bg-primary-muted text-primary-700 border-l-[3px] border-primary-600"
                    : "text-text-secondary hover:bg-elevated"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings (bottom) */}
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={onSettingsClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-text-secondary hover:bg-elevated transition-colors duration-150 w-full"
          >
            <Settings size={20} strokeWidth={1.5} />
            <span>설정</span>
          </button>
        </div>
      </aside>

      {/* Tablet sidebar (768~1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 flex-shrink-0 border-r border-border bg-surface sticky top-0 h-dvh items-center">
        {/* Logo */}
        <div className="py-5">
          <span className="text-lg font-heading text-text-primary">소</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2 mt-2">
          {NAV_ITEMS.map(({ href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors duration-150 ${
                  active
                    ? "bg-primary-muted text-primary-700"
                    : "text-text-secondary hover:bg-elevated"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="pb-4">
          <button
            type="button"
            onClick={onSettingsClick}
            className="flex items-center justify-center w-10 h-10 rounded-[10px] text-text-secondary hover:bg-elevated transition-colors duration-150"
          >
            <Settings size={20} strokeWidth={1.5} />
          </button>
        </div>
      </aside>
    </>
  );
}
