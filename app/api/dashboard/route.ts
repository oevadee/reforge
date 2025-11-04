import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitRepository } from "@/lib/repositories/habit.repository";
import { HabitLogRepository } from "@/lib/repositories/habit-log.repository";
import { HabitStatsService } from "@/lib/services/habit-stats.service";
import { getTodayISO, isScheduledForToday } from "@/lib/utils/date";
import { DashboardData, RecentActivityItem } from "@/types/dashboard";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const today = getTodayISO();

    // Get all active habits with stats
    const habitsWithStats = await HabitStatsService.getAllHabitsWithStats(
      user.id,
    );

    // Calculate overall statistics
    const totalHabits = habitsWithStats.length;
    const activeHabits = habitsWithStats.filter((h) => h.isActive).length;

    // Calculate average completion rate
    const totalCompletionRate =
      habitsWithStats.reduce((sum, h) => sum + h.completionRate, 0) /
      (totalHabits || 1);

    // Count total active streaks (streaks > 0)
    const totalActiveStreaks = habitsWithStats.filter(
      (h) => h.currentStreak > 0,
    ).length;

    // Get today's habits
    const allHabits = await HabitRepository.findByUser(user.id, {
      isActive: true,
    });
    const todaysHabits = allHabits.filter(isScheduledForToday);

    // Get today's logs
    const todaysLogs = await HabitLogRepository.findByUserAndDate(
      user.id,
      today,
    );
    const completedToday = todaysLogs.filter(
      (log) => log.status === "COMPLETED",
    ).length;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const recentLogs = await Promise.all(
      habitsWithStats.map(async (habit) => {
        const logs = await HabitLogRepository.findByHabitAndDateRange(
          habit.id,
          user.id,
          sevenDaysAgoStr,
          today,
        );
        return logs.map(
          (log): RecentActivityItem => ({
            id: log.id,
            habitName: habit.name,
            habitColor: habit.color,
            habitIcon: habit.icon,
            date: log.date,
            status: log.status,
          }),
        );
      }),
    );

    // Flatten and sort by date descending
    const recentActivity = recentLogs
      .flat()
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10); // Limit to 10 most recent

    const dashboardData: DashboardData = {
      stats: {
        totalHabits,
        activeHabits,
        completionRate: Math.round(totalCompletionRate),
        totalActiveStreaks,
        todayProgress: {
          completed: completedToday,
          total: todaysHabits.length,
          percentage:
            todaysHabits.length > 0
              ? Math.round((completedToday / todaysHabits.length) * 100)
              : 0,
        },
      },
      recentActivity,
    };

    return NextResponse.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
