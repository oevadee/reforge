import { z } from "zod";
import { LogStatus } from "@prisma/client";

export const createHabitLogSchema = z.object({
  habitId: z.string().cuid("Invalid habit ID"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  status: z.nativeEnum(LogStatus),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
});

export const updateHabitLogSchema = z.object({
  status: z.nativeEnum(LogStatus).optional(),
  note: z.string().max(500).optional(),
});

export type CreateHabitLogSchema = z.infer<typeof createHabitLogSchema>;
export type UpdateHabitLogSchema = z.infer<typeof updateHabitLogSchema>;
