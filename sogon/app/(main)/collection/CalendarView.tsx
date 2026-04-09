"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  getCalendarGrid,
  isSameDay,
  isToday,
  formatKoreanDate,
} from "@/lib/date-utils";
import { createClient } from "@/lib/supabase/client";
import { getEntriesByMonth } from "@/lib/supabase/queries";
import type { EntryWithReaction } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export function CalendarView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [monthEntries, setMonthEntries] = useState<EntryWithReaction[]>([]);

  const grid = getCalendarGrid(year, month);

  const loadMonth = useCallback(async () => {
    console.log("[CalendarView] loadMonth 호출", { year, month });
    const supabase = createClient();

    // reactions 직접 쿼리 (nested join 우회 테스트)
    const { data: reactionsRaw, error: reactionsError } = await supabase
      .from("reactions")
      .select("*")
      .limit(5);
    console.log("[CalendarView] reactions 직접 조회", { reactionsRaw, reactionsError });

    const entries = await getEntriesByMonth(supabase, year, month);
    console.log("[CalendarView] entries 수신", entries.length, entries.map(e => ({ id: e.id, reaction: e.reaction })));
    setMonthEntries(entries);
  }, [year, month]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const datesWithEntries = new Set<string>(
    monthEntries.map((e) => {
      const d = new Date(e.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  const selectedEntries = monthEntries.filter((e) =>
    isSameDay(new Date(e.createdAt), selectedDate),
  );

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
      <div className="bg-white border border-neutral-200 rounded-[16px] p-5">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-[6px] text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <h3 className="text-xl font-heading text-foreground">
            {year}년 {month + 1}월
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-[6px] text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="text-center text-xs text-neutral-400 py-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {grid.map(({ date, isCurrentMonth }, i) => {
            const selected = isSameDay(date, selectedDate);
            const todayDate = isToday(date);
            const hasEntryDot = isCurrentMonth && hasEntry(date);

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`relative flex flex-col items-center justify-center w-10 h-10 mx-auto rounded-full text-sm transition-colors duration-150 ${
                  !isCurrentMonth
                    ? "text-neutral-300"
                    : selected
                      ? "bg-primary-600 text-white"
                      : todayDate
                        ? "ring-2 ring-primary-300 text-foreground"
                        : "text-foreground hover:bg-neutral-100"
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
        <h4 className="text-sm text-neutral-400 mb-3">
          {formatKoreanDate(selectedDate)}
        </h4>
        {selectedEntries.length > 0 ? (
          <div className="space-y-4">
            {selectedEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onUpdate={loadMonth}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-neutral-400 text-sm">
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
