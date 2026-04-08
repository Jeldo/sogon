"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PenLine, BookOpen, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/record", label: "기록하기", icon: PenLine },
  { href: "/collection", label: "모아보기", icon: BookOpen },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <>
      {/* Desktop sidebar (>=1024px) */}
      <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 border-r border-neutral-200 bg-neutral-50 h-full">
        {/* Logo */}
        <div className="px-6 py-5">
          <h1 className="text-xl font-heading text-neutral-600">소곤</h1>
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
                    ? "bg-primary-100 text-primary-700 border-l-[3px] border-primary-600"
                    : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout (bottom) */}
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-neutral-500 hover:bg-neutral-100 transition-colors duration-150 w-full"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Tablet sidebar (768~1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 flex-shrink-0 border-r border-neutral-200 bg-neutral-50 h-full items-center">
        {/* Logo */}
        <div className="py-5">
          <span className="text-lg font-heading text-neutral-600">소</span>
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
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-[10px] text-neutral-500 hover:bg-neutral-100 transition-colors duration-150"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </div>
      </aside>
    </>
  );
}
