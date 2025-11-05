import { z } from "zod";
import { MoodLevel } from "@prisma/client";

export const createReflectionSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    mood: z.nativeEnum(MoodLevel).optional(),
    content: z
      .string()
      .max(2000, "Reflection must be less than 2000 characters")
      .optional(),
  })
  .refine((data) => data.mood || data.content, {
    message: "Either mood or content must be provided",
  });

export const updateReflectionSchema = z.object({
  mood: z.nativeEnum(MoodLevel).optional(),
  content: z.string().max(2000).optional(),
});

export type CreateReflectionSchema = z.infer<typeof createReflectionSchema>;
export type UpdateReflectionSchema = z.infer<typeof updateReflectionSchema>;
