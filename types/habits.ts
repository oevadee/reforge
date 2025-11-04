import { Prisma, HabitType, HabitFrequency, Habit } from "@prisma/client";

// Schedule Types
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface WeeklySchedule {
  type: "weekly";
  days: DayOfWeek[];
}

export interface CustomSchedule {
  type: "custom";
  dates?: string[]; // ISO date strings
  interval?: number; // Every N days
}

export type HabitSchedule = WeeklySchedule | CustomSchedule | null;

// Habit Creation/Update Types
export interface CreateHabitDto {
  name: string;
  description?: string;
  type: HabitType;
  frequency: HabitFrequency;
  schedule?: HabitSchedule;
  targetCount?: number;
  color?: string;
  icon?: string;
}

export interface UpdateHabitDto {
  name?: string;
  description?: string;
  type?: HabitType;
  frequency?: HabitFrequency;
  schedule?: HabitSchedule;
  targetCount?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

// Habit with computed stats
export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

// Query types
export type HabitWithLogs = Prisma.HabitGetPayload<{
  include: {
    logs: true;
  };
}>;

export type HabitWithUser = Prisma.HabitGetPayload<{
  include: {
    user: true;
  };
}>;

// Filter types
export interface HabitFilters {
  type?: HabitType;
  frequency?: HabitFrequency;
  isActive?: boolean;
  search?: string;
}

// Icon options (extensible)
export const HABIT_ICONS = [
  "meditation",
  "fitness",
  "book",
  "water",
  "sleep",
  "food",
  "work",
  "phone-off",
  "no-smoking",
  "heart",
  "brain",
  "music",
  "code",
  "art",
  "plant",
] as const;

export type HabitIcon = (typeof HABIT_ICONS)[number];

// Color presets
export const HABIT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#ef4444", // red
  "#f59e0b", // amber
  "#10b981", // emerald
  "#14b8a6", // teal
  "#3b82f6", // blue
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];
