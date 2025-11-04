/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get day of week from date
 */
export function getDayOfWeek(
  date: Date | string,
): "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
  return days[d.getDay()];
}

/**
 * Check if a habit is scheduled for today
 */
export function isScheduledForToday(habit: {
  frequency: string;
  schedule: any;
}): boolean {
  if (habit.frequency === "DAILY") {
    return true;
  }

  if (habit.frequency === "WEEKLY" && habit.schedule?.type === "weekly") {
    const today = getDayOfWeek(new Date());
    return habit.schedule.days.includes(today);
  }

  return false;
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  format: "short" | "long" = "short",
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
