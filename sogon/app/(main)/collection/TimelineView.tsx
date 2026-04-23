"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { formatKoreanDate } from "@/lib/date-utils";
import { getAllEntriesWithReactions } from "@/lib/storage";
import type { EntryWithReaction } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";
import { Button } from "@/components/ui/Button";

type DateGroup = {
  dateLabel: string;
  entries: EntryWithReaction[];
};

export function TimelineView() {
  const [refreshKey, setRefreshKey] = useState(0);

  const entries = useMemo(
    () => getAllEntriesWithReactions(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  );

  const groups: DateGroup[] = useMemo(() => {
    const map = new Map<string, EntryWithReaction[]>();
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const existing = map.get(key) ?? [];
      existing.push(entry);
      map.set(key, existing);
    });

    return Array.from(map.entries()).map(([, groupEntries]) => ({
      dateLabel: formatKoreanDate(new Date(groupEntries[0].createdAt)),
      entries: groupEntries,
    }));
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-3">
        <p className="t-caption">아직 기록이 없어. 첫 기록을 남겨봐!</p>
        <Link href="/record" className="inline-flex">
          <Button variant="primary" size="md">
            기록하기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.dateLabel}>
          <h3 className="t-label mb-3">{group.dateLabel}</h3>
          <div className="flex flex-col gap-3.5">
            {group.entries.map((entry, i) => (
              <AnimatedCard key={entry.id} delay={i * 50}>
                <EntryCard
                  entry={entry}
                  onUpdate={() => setRefreshKey((k) => k + 1)}
                />
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
      className="transition-all duration-[350ms] ease-[var(--ease-out)]"
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
