import { prisma } from "@/lib/prisma";
import { Habit, Prisma } from "@prisma/client";
import { CreateHabitDto, UpdateHabitDto, HabitFilters } from "@/types/habits";

export class HabitRepository {
  /**
   * Create a new habit
   */
  static async create(userId: string, data: CreateHabitDto): Promise<Habit> {
    return prisma.habit.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        schedule: data.schedule
          ? (data.schedule as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        targetCount: data.targetCount,
        color: data.color,
        icon: data.icon,
        userId,
      },
    });
  }

  /**
   * Find habit by ID
   */
  static async findById(id: string, userId: string): Promise<Habit | null> {
    return prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Find all habits for a user with optional filters
   */
  static async findByUser(
    userId: string,
    filters?: HabitFilters,
  ): Promise<Habit[]> {
    const where: Prisma.HabitWhereInput = {
      userId,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.frequency && { frequency: filters.frequency }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    };

    return prisma.habit.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Update a habit
   */
  static async update(
    id: string,
    userId: string,
    data: UpdateHabitDto,
  ): Promise<Habit> {
    // Verify ownership
    const habit = await this.findById(id, userId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    return prisma.habit.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        frequency: data.frequency,
        schedule:
          data.schedule !== undefined
            ? data.schedule === null
              ? Prisma.JsonNull
              : (data.schedule as unknown as Prisma.InputJsonValue)
            : undefined,
        targetCount: data.targetCount,
        color: data.color,
        icon: data.icon,
        isActive: data.isActive,
      },
    });
  }

  /**
   * Delete a habit (soft delete by setting isActive to false)
   */
  static async softDelete(id: string, userId: string): Promise<Habit> {
    return this.update(id, userId, { isActive: false });
  }

  /**
   * Permanently delete a habit
   */
  static async hardDelete(id: string, userId: string): Promise<void> {
    // Verify ownership
    const habit = await this.findById(id, userId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    await prisma.habit.delete({
      where: { id },
    });
  }

  /**
   * Count active habits for a user
   */
  static async countActive(userId: string): Promise<number> {
    return prisma.habit.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }
}
