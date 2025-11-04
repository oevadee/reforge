import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitRepository } from "@/lib/repositories/habit.repository";
import { HabitLogRepository } from "@/lib/repositories/habit-log.repository";
import { getTodayISO, isScheduledForToday } from "@/lib/utils/date";
import { DailyCheckInHabit } from "@/types/habit-logs";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const today = getTodayISO();

    // Get all active habits
    const habits = await HabitRepository.findByUser(user.id, {
      isActive: true,
    });

    // Filter habits scheduled for today
    const todaysHabits = habits.filter(isScheduledForToday);

    // Get today's logs
    const todaysLogs = await HabitLogRepository.findByUserAndDate(
      user.id,
      today,
    );
    const logsMap = new Map(todaysLogs.map((log) => [log.habitId, log]));

    // Combine habits with their logs
    const checkInData: DailyCheckInHabit[] = todaysHabits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      type: habit.type,
      color: habit.color,
      icon: habit.icon,
      todayLog: logsMap.get(habit.id) || null,
    }));

    return NextResponse.json({ success: true, data: checkInData });
  } catch (error) {
    console.error("Error fetching check-in data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch check-in data" },
      { status: 500 },
    );
  }
}
