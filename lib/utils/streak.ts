import { HabitLog } from "@prisma/client";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date | null;
}

/**
 * Calculate streak data from habit logs
 * Logs must be sorted by date descending (newest first)
 */
export function calculateStreaks(logs: HabitLog[]): StreakData {
  if (logs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
    };
  }

  // Filter only completed logs
  const completedLogs = logs.filter((log) => log.status === "COMPLETED");

  if (completedLogs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (let i = 0; i < completedLogs.length; i++) {
    const log = completedLogs[i];
    const logDate = new Date(log.date);

    if (i === 0) {
      // First log
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      logDate.setHours(0, 0, 0, 0);

      // Current streak only counts if last completion was today or yesterday
      if (
        logDate.getTime() === today.getTime() ||
        logDate.getTime() === yesterday.getTime()
      ) {
        currentStreak = 1;
        tempStreak = 1;
      }
    } else {
      const prevLogDate = new Date(completedLogs[i - 1].date);
      prevLogDate.setHours(0, 0, 0, 0);
      logDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (prevLogDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++;
        if (i === 1 || currentStreak > 0) {
          currentStreak++;
        }
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        currentStreak = 0; // Current streak is broken
      }
    }

    lastDate = logDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate: lastDate,
  };
}

/**
 * Calculate completion rate for a set of logs
 */
export function calculateCompletionRate(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  const completedCount = logs.filter(
    (log) => log.status === "COMPLETED",
  ).length;
  return Math.round((completedCount / logs.length) * 100);
}
