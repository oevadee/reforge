import { z } from "zod";
import { HabitType, HabitFrequency } from "@prisma/client";

const dayOfWeekSchema = z.enum([
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]);

const weeklyScheduleSchema = z.object({
  type: z.literal("weekly"),
  days: z.array(dayOfWeekSchema).min(1, "Select at least one day"),
});

const customScheduleSchema = z.object({
  type: z.literal("custom"),
  dates: z.array(z.string()).optional(),
  interval: z.number().int().positive().optional(),
});

const scheduleSchema = z.union([
  weeklyScheduleSchema,
  customScheduleSchema,
  z.null(),
]);

export const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  type: z.nativeEnum(HabitType),
  frequency: z.nativeEnum(HabitFrequency),
  schedule: scheduleSchema.optional(),
  targetCount: z
    .number()
    .int()
    .positive("Target must be a positive number")
    .max(100, "Target must be less than 100")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
  icon: z.string().optional(),
});

export const updateHabitSchema = createHabitSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateHabitSchema = z.infer<typeof createHabitSchema>;
export type UpdateHabitSchema = z.infer<typeof updateHabitSchema>;
