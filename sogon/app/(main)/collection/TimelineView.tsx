"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { formatKoreanDate } from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";
import { getAllEntriesWithReactions } from "@/lib/supabase/queries";
import type { EntryWithReaction } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

type DateGroup = {
  dateLabel: string;
  entries: EntryWithReaction[];
};

export function TimelineView() {
  const [entries, setEntries] = useState<EntryWithReaction[]>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const data = await getAllEntriesWithReactions(supabase);
    setEntries(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups: DateGroup[] = [];
  const seen = new Map<string, EntryWithReaction[]>();
  entries.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const existing = seen.get(key) ?? [];
    existing.push(entry);
    seen.set(key, existing);
  });
  seen.forEach((groupEntries) => {
    groups.push({
      dateLabel: formatKoreanDate(new Date(groupEntries[0].createdAt)),
      entries: groupEntries,
    });
  });

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400 text-sm">
        <p>아직 기록이 없어. 첫 기록을 남겨봐!</p>
        <Link
          href="/record"
          className="inline-block mt-3 py-2 px-4 rounded-[10px] bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors"
        >
          기록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.dateLabel}>
          <h4 className="text-sm text-neutral-400 mb-3">{group.dateLabel}</h4>
          <div className="space-y-4">
            {group.entries.map((entry, i) => (
              <AnimatedCard key={entry.id} delay={i * 50}>
                <EntryCard entry={entry} onUpdate={load} />
              </AnimatedCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnimatedCard({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-[350ms]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
