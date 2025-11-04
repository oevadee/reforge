import { HabitLog, LogStatus, Prisma } from "@prisma/client";

export interface CreateHabitLogDto {
  habitId: string;
  date: string; // ISO date string
  status: LogStatus;
  note?: string;
}

export interface UpdateHabitLogDto {
  status?: LogStatus;
  note?: string;
}

export type HabitLogWithHabit = Prisma.HabitLogGetPayload<{
  include: {
    habit: true;
  };
}>;

export interface DailyCheckInHabit {
  id: string;
  name: string;
  description: string | null;
  type: string;
  color: string | null;
  icon: string | null;
  todayLog: HabitLog | null;
}
