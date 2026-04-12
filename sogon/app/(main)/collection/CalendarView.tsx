"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCalendarGrid, isSameDay, isToday, formatKoreanDate } from "@/lib/date-utils";
import { getEntriesByMonth, getReactions } from "@/lib/storage";
import type { EntryWithReaction } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

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

  const datesWithEntries = useMemo(() => {
    const set = new Set<string>();
    monthEntries.forEach((e) => {
      const d = new Date(e.createdAt);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
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

  function hasEntry(date: Date): boolean {
    return datesWithEntries.has(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-background border border-border rounded-[16px] p-5">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-[6px] text-text-secondary hover:bg-elevated transition-colors"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <h3 className="text-xl font-heading text-foreground">
            {year}년 {month + 1}월
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-[6px] text-text-secondary hover:bg-elevated transition-colors"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs text-text-tertiary py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {grid.map(({ date, isCurrentMonth }, i) => {
            const selected = isSameDay(date, selectedDate);
            const today = isToday(date);
            const hasEntryDot = isCurrentMonth && hasEntry(date);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`relative flex flex-col items-center justify-center w-10 h-10 mx-auto rounded-full text-sm transition-colors duration-150 ${
                  !isCurrentMonth
                    ? "text-text-placeholder"
                    : selected
                      ? "bg-primary-600 text-white"
                      : today
                        ? "ring-2 ring-primary-300 text-foreground"
                        : "text-foreground hover:bg-elevated"
                }`}
              >
                {date.getDate()}
                {hasEntryDot && !selected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date entries */}
      <div>
        <h4 className="text-sm text-text-tertiary mb-3">
          {formatKoreanDate(selectedDate)}
        </h4>
        {selectedEntries.length > 0 ? (
          <div className="space-y-4">
            {selectedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onUpdate={() => setRefreshKey((k) => k + 1)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-text-tertiary text-sm">
            <p>이 날은 기록이 없어. 오늘 하나 남겨볼까?</p>
            <Link
              href="/record"
              className="inline-block mt-3 text-primary-600 hover:text-primary-700 transition-colors"
            >
              기록하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
