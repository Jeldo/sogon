"use client";

import { useState } from "react";
import { CalendarView } from "./CalendarView";
import { TimelineView } from "./TimelineView";

type ViewMode = "calendar" | "timeline";

export default function CollectionPage() {
  const [view, setView] = useState<ViewMode>("calendar");

  return (
    <div className="max-w-[840px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-body font-semibold text-foreground">
          모아보기
        </h2>

        {/* View switcher (pill tabs) */}
        <div className="flex bg-elevated rounded-[10px] p-[3px]">
          <button
            onClick={() => setView("calendar")}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-body transition-all duration-150 ${
              view === "calendar"
                ? "bg-background text-foreground shadow-sm"
                : "text-text-secondary"
            }`}
          >
            캘린더
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-body transition-all duration-150 ${
              view === "timeline"
                ? "bg-background text-foreground shadow-sm"
                : "text-text-secondary"
            }`}
          >
            타임라인
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "calendar" ? <CalendarView /> : <TimelineView />}
    </div>
  );
}
