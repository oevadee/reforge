import { prisma } from "@/lib/prisma";
import { HabitLog } from "@prisma/client";
import { CreateHabitLogDto } from "@/types/habit-logs";

export class HabitLogRepository {
  /**
   * Create or update a habit log for a specific date
   */
  static async upsert(
    userId: string,
    data: CreateHabitLogDto,
  ): Promise<HabitLog> {
    // Verify habit ownership
    const habit = await prisma.habit.findFirst({
      where: { id: data.habitId, userId },
    });

    if (!habit) {
      throw new Error("Habit not found");
    }

    return prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: data.habitId,
          date: new Date(data.date),
        },
      },
      create: {
        ...data,
        date: new Date(data.date),
        userId,
      },
      update: {
        status: data.status,
        note: data.note,
      },
    });
  }

  /**
   * Get log for a specific habit and date
   */
  static async findByHabitAndDate(
    habitId: string,
    date: string,
    userId: string,
  ): Promise<HabitLog | null> {
    return prisma.habitLog.findFirst({
      where: {
        habitId,
        date: new Date(date),
        userId,
      },
    });
  }

  /**
   * Get all logs for a user on a specific date
   */
  static async findByUserAndDate(
    userId: string,
    date: string,
  ): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      include: {
        habit: true,
      },
    });
  }

  /**
   * Get logs for a habit within a date range
   */
  static async findByHabitAndDateRange(
    habitId: string,
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: {
        habitId,
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  /**
   * Delete a habit log
   */
  static async delete(id: string, userId: string): Promise<void> {
    const log = await prisma.habitLog.findFirst({
      where: { id, userId },
    });

    if (!log) {
      throw new Error("Log not found");
    }

    await prisma.habitLog.delete({
      where: { id },
    });
  }
}
