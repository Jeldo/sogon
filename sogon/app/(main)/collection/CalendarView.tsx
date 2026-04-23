"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  getCalendarGrid,
  isSameDay,
  isToday,
  formatKoreanDate,
} from "@/lib/date-utils";
import { getEntriesByMonth, getReactions } from "@/lib/storage";
import { getRepresentativeMood, MOOD_META } from "@/lib/mood";
import type { EntryWithReaction, Mood } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";
import { Button } from "@/components/ui/Button";

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export function CalendarView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [refreshKey, setRefreshKey] = useState(0);

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month]);

  const monthEntries = useMemo(
    () => getEntriesByMonth(year, month),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, month, refreshKey],
  );

  const dateMoods = useMemo(() => {
    const grouped = new Map<string, typeof monthEntries>();
    monthEntries.forEach((e) => {
      const d = new Date(e.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const bucket = grouped.get(key);
      if (bucket) bucket.push(e);
      else grouped.set(key, [e]);
    });
    const result = new Map<string, Mood | null>();
    grouped.forEach((entries, key) => {
      result.set(key, getRepresentativeMood(entries));
    });
    return result;
  }, [monthEntries]);

  const selectedEntries: EntryWithReaction[] = useMemo(() => {
    const reactions = getReactions();
    return monthEntries
      .filter((e) => isSameDay(new Date(e.createdAt), selectedDate))
      .map((entry) => ({
        ...entry,
        reaction: reactions.find((r) => r.entryId === entry.id) ?? null,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthEntries, selectedDate, refreshKey]);

  function prevMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  function dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  function hasEntry(date: Date): boolean {
    return dateMoods.has(dateKey(date));
  }

  function moodFor(date: Date): Mood | null {
    return dateMoods.get(dateKey(date)) ?? null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar */}
      <div
        className="rounded-[var(--r-md)] p-5"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            aria-label="이전 달"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] transition-colors"
          >
            <ChevronLeft size={18} strokeWidth={1.8} />
          </button>
          <h2
            className="font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "var(--text)",
            }}
          >
            {year}년 {month + 1}월
          </h2>
          <button
            onClick={nextMonth}
            aria-label="다음 달"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] transition-colors"
          >
            <ChevronRight size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="t-small text-center py-1">
              {label}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {grid.map(({ date, isCurrentMonth }, i) => {
            const selected = isSameDay(date, selectedDate);
            const today = isToday(date);
            const mood = isCurrentMonth ? moodFor(date) : null;
            const hasEntryDot =
              isCurrentMonth && !mood && hasEntry(date);
            const showEmoji = Boolean(mood) && !selected;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                aria-label={
                  mood
                    ? `${date.getDate()}일 — ${MOOD_META[mood].label}`
                    : `${date.getDate()}일`
                }
                className="relative flex flex-col items-center justify-center w-10 h-10 mx-auto rounded-full text-[14px] transition-all duration-150"
                style={{
                  color: !isCurrentMonth
                    ? "var(--text-muted)"
                    : selected
                      ? "var(--accent-ink)"
                      : "var(--text)",
                  background: selected
                    ? "var(--accent)"
                    : "transparent",
                  boxShadow:
                    !selected && today
                      ? "inset 0 0 0 1px var(--ink-5)"
                      : undefined,
                  opacity: !isCurrentMonth ? 0.4 : 1,
                  fontWeight: selected ? 700 : 400,
                }}
              >
                {showEmoji ? (
                  <span className="text-[22px] leading-none">
                    {MOOD_META[mood!].emoji}
                  </span>
                ) : (
                  date.getDate()
                )}
                {hasEntryDot && !selected && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date entries */}
      <div>
        <h3 className="t-label mb-3">{formatKoreanDate(selectedDate)}</h3>
        {selectedEntries.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {selectedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onUpdate={() => setRefreshKey((k) => k + 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-3">
            <p className="t-caption">이 날은 기록이 없어. 오늘 하나 남겨볼까?</p>
            <Link href="/record" className="inline-flex">
              <Button variant="outline" size="sm">
                기록하기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
