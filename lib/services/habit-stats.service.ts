import { HabitLogRepository } from "@/lib/repositories/habit-log.repository";
import { calculateStreaks, calculateCompletionRate } from "@/lib/utils/streak";
import { HabitWithStats } from "@/types/habits";
import { Habit } from "@prisma/client";

export class HabitStatsService {
  /**
   * Get habit with calculated statistics
   */
  static async getHabitWithStats(
    habitId: string,
    userId: string,
  ): Promise<HabitWithStats | null> {
    const { HabitRepository } = await import(
      "@/lib/repositories/habit.repository"
    );
    const habit = await HabitRepository.findById(habitId, userId);

    if (!habit) {
      return null;
    }

    return this.enrichHabitWithStats(habit, userId);
  }

  /**
   * Get all habits with statistics for a user
   */
  static async getAllHabitsWithStats(
    userId: string,
  ): Promise<HabitWithStats[]> {
    const { HabitRepository } = await import(
      "@/lib/repositories/habit.repository"
    );
    const habits = await HabitRepository.findByUser(userId, {
      isActive: true,
    });

    const habitsWithStats = await Promise.all(
      habits.map((habit) => this.enrichHabitWithStats(habit, userId)),
    );

    return habitsWithStats;
  }

  /**
   * Enrich a habit with calculated statistics
   */
  private static async enrichHabitWithStats(
    habit: Habit,
    userId: string,
  ): Promise<HabitWithStats> {
    // Get logs from the last 90 days
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const startDateStr = startDate.toISOString().split("T")[0];

    const logs = await HabitLogRepository.findByHabitAndDateRange(
      habit.id,
      userId,
      startDateStr,
      endDate,
    );

    const streaks = calculateStreaks(logs);
    const completionRate = calculateCompletionRate(logs);
    const totalCompletions = logs.filter(
      (log) => log.status === "COMPLETED",
    ).length;

    return {
      ...habit,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      completionRate,
      totalCompletions,
    };
  }
}
