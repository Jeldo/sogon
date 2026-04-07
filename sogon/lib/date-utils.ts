const KOREAN_DAYS = [
  "\uC77C\uC694\uC77C",
  "\uC6D4\uC694\uC77C",
  "\uD654\uC694\uC77C",
  "\uC218\uC694\uC77C",
  "\uBAA9\uC694\uC77C",
  "\uAE08\uC694\uC77C",
  "\uD1A0\uC694\uC77C",
] as const;

export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = KOREAN_DAYS[date.getDay()];
  return `${month}\uC6D4 ${day}\uC77C ${dayName}`;
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "\uC624\uC804" : "\uC624\uD6C4";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${period} ${displayHours}:${String(minutes).padStart(2, "0")}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
};

/**
 * Returns a 6-row * 7-column grid for a given month.
 * Week starts on Monday (0=Mon, 6=Sun).
 */
export function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  // Convert JS day (0=Sun) to Monday-start (0=Mon)
  const startDow = (firstDay.getDay() + 6) % 7;

  const grid: CalendarDay[] = [];

  // Fill leading days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    grid.push({ date, isCurrentMonth: false });
  }

  // Fill current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }

  // Fill trailing days to complete last row
  while (grid.length % 7 !== 0) {
    const nextDate = new Date(year, month + 1, grid.length - startDow - daysInMonth + 1);
    grid.push({ date: nextDate, isCurrentMonth: false });
  }

  return grid;
}
