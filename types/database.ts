import { Prisma } from '@prisma/client';

// Reusable select/include types
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    habits: true;
    reflections: true;
  };
}>;

export type HabitWithLogs = Prisma.HabitGetPayload<{
  include: {
    logs: true;
  };
}>;

export type HabitLogWithHabit = Prisma.HabitLogGetPayload<{
  include: {
    habit: true;
  };
}>;

// Query result types
export type HabitWithStats = Prisma.HabitGetPayload<{
  include: {
    logs: {
      where: {
        status: 'COMPLETED';
      };
    };
  };
}> & {
  currentStreak?: number;
  longestStreak?: number;
  completionRate?: number;
};

// Input types for API routes
export type CreateHabitInput = Prisma.HabitCreateInput;
export type UpdateHabitInput = Prisma.HabitUpdateInput;
export type CreateHabitLogInput = Prisma.HabitLogCreateInput;
export type CreateReflectionInput = Prisma.ReflectionCreateInput;

