import { MoodLevel, Prisma } from "@prisma/client";

export interface CreateReflectionDto {
  date: string; // ISO date
  mood?: MoodLevel;
  content?: string;
}

export interface UpdateReflectionDto {
  mood?: MoodLevel;
  content?: string;
}

export type ReflectionWithUser = Prisma.ReflectionGetPayload<{
  include: {
    user: true;
  };
}>;

// Mood display data
export const MOOD_DATA: Record<
  MoodLevel,
  { emoji: string; label: string; color: string }
> = {
  VERY_BAD: { emoji: "😢", label: "Very Bad", color: "#ef4444" },
  BAD: { emoji: "😟", label: "Bad", color: "#f59e0b" },
  NEUTRAL: { emoji: "😐", label: "Neutral", color: "#6b7280" },
  GOOD: { emoji: "😊", label: "Good", color: "#10b981" },
  VERY_GOOD: { emoji: "😄", label: "Very Good", color: "#22c55e" },
};
