"use client";

import { useState } from "react";
import { CalendarView } from "./CalendarView";
import { TimelineView } from "./TimelineView";

type ViewMode = "calendar" | "timeline";

export default function CollectionPage() {
  const [view, setView] = useState<ViewMode>("calendar");

  return (
    <div className="max-w-[840px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6 gap-4">
        <div>
          <div className="t-label">collection</div>
          <h1 className="t-display mt-1.5">모아보기</h1>
        </div>

        {/* View switcher */}
        <div
          className="flex rounded-[var(--r-pill)] p-1 flex-shrink-0"
          style={{ background: "var(--surface-2)" }}
        >
          <button
            onClick={() => setView("calendar")}
            className="px-4 py-1.5 rounded-[var(--r-pill)] text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-150"
            style={{
              background: view === "calendar" ? "var(--surface-3)" : "transparent",
              color:
                view === "calendar" ? "var(--text)" : "var(--text-dim)",
            }}
          >
            calendar
          </button>
          <button
            onClick={() => setView("timeline")}
            className="px-4 py-1.5 rounded-[var(--r-pill)] text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-150"
            style={{
              background: view === "timeline" ? "var(--surface-3)" : "transparent",
              color:
                view === "timeline" ? "var(--text)" : "var(--text-dim)",
            }}
          >
            timeline
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "calendar" ? <CalendarView /> : <TimelineView />}
    </div>
  );
}
