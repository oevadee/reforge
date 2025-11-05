import { prisma } from "@/lib/prisma";
import { Reflection } from "@prisma/client";
import { CreateReflectionDto } from "@/types/reflections";

export class ReflectionRepository {
  /**
   * Create or update reflection for a date
   */
  static async upsert(
    userId: string,
    data: CreateReflectionDto,
  ): Promise<Reflection> {
    return prisma.reflection.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(data.date),
        },
      },
      create: {
        userId,
        date: new Date(data.date),
        mood: data.mood,
        content: data.content,
      },
      update: {
        mood: data.mood,
        content: data.content,
      },
    });
  }

  /**
   * Find reflection by date
   */
  static async findByDate(
    userId: string,
    date: string,
  ): Promise<Reflection | null> {
    return prisma.reflection.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date),
        },
      },
    });
  }

  /**
   * Find reflections in date range
   */
  static async findByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Reflection[]> {
    return prisma.reflection.findMany({
      where: {
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
   * Get recent reflections
   */
  static async findRecent(
    userId: string,
    limit: number = 7,
  ): Promise<Reflection[]> {
    return prisma.reflection.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
  }

  /**
   * Delete reflection
   */
  static async delete(id: string, userId: string): Promise<void> {
    const reflection = await prisma.reflection.findFirst({
      where: { id, userId },
    });

    if (!reflection) {
      throw new Error("Reflection not found");
    }

    await prisma.reflection.delete({
      where: { id },
    });
  }
}
