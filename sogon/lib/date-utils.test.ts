import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatKoreanDate,
  formatTime,
  isSameDay,
  isToday,
  getCalendarGrid,
} from "./date-utils";

describe("formatKoreanDate", () => {
  it("formats a date as Korean month/day/dayname", () => {
    // 2026-04-05 is a Sunday
    const date = new Date(2026, 3, 5);
    expect(formatKoreanDate(date)).toBe("4월 5일 일요일");
  });

  it("formats January 1st correctly", () => {
    const date = new Date(2026, 0, 1);
    expect(formatKoreanDate(date)).toBe("1월 1일 목요일");
  });
});

describe("formatTime", () => {
  it("formats afternoon time", () => {
    const date = new Date(2026, 3, 5, 15, 24);
    expect(formatTime(date)).toBe("오후 3:24");
  });

  it("formats morning time", () => {
    const date = new Date(2026, 3, 5, 9, 5);
    expect(formatTime(date)).toBe("오전 9:05");
  });

  it("formats midnight as 오전 12:00", () => {
    const date = new Date(2026, 3, 5, 0, 0);
    expect(formatTime(date)).toBe("오전 12:00");
  });

  it("formats noon as 오후 12:00", () => {
    const date = new Date(2026, 3, 5, 12, 0);
    expect(formatTime(date)).toBe("오후 12:00");
  });
});

describe("isSameDay", () => {
  it("returns true for the same date", () => {
    const a = new Date(2026, 3, 5, 10, 0);
    const b = new Date(2026, 3, 5, 23, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for different dates", () => {
    const a = new Date(2026, 3, 5);
    const b = new Date(2026, 3, 6);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe("isToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 7, 14, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for today", () => {
    expect(isToday(new Date(2026, 3, 7, 0, 0))).toBe(true);
  });

  it("returns false for yesterday", () => {
    expect(isToday(new Date(2026, 3, 6))).toBe(false);
  });
});

describe("getCalendarGrid", () => {
  it("returns a grid with rows of 7 columns", () => {
    const grid = getCalendarGrid(2026, 3); // April 2026
    expect(grid.length % 7).toBe(0);
  });

  it("starts with Monday", () => {
    // April 2026 starts on Wednesday
    // So the first cell should be Monday March 30
    const grid = getCalendarGrid(2026, 3);
    expect(grid[0].date.getDay()).toBe(1); // Monday
    expect(grid[0].isCurrentMonth).toBe(false);
  });

  it("marks current month days correctly", () => {
    const grid = getCalendarGrid(2026, 3);
    const aprilDays = grid.filter((d) => d.isCurrentMonth);
    expect(aprilDays.length).toBe(30); // April has 30 days
  });

  it("includes trailing days from next month", () => {
    const grid = getCalendarGrid(2026, 3);
    const lastCell = grid[grid.length - 1];
    expect(lastCell.isCurrentMonth).toBe(false);
  });
});
