import { AIService } from "./ai.service";
import { PromptBuilder } from "@/lib/utils/prompts";
import { HabitStatsService } from "./habit-stats.service";
import { prisma } from "@/lib/prisma";
import { AIResponse, AIPromptContext } from "@/types/ai";

export class CoachMotivationService {
  /**
   * Generate personalized motivation
   */
  static async generateMotivation(userId: string): Promise<AIResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const habits = await HabitStatsService.getAllHabitsWithStats(userId);

    const context: AIPromptContext = {
      habitData: habits.map((h) => ({
        name: h.name,
        type: h.type,
        completions: h.totalCompletions,
        streak: h.currentStreak,
      })),
      userData: {
        name: user?.name || "User",
        totalHabits: habits.length,
      },
    };

    const messages = PromptBuilder.buildMotivation(context);
    return await AIService.generateCompletion(messages);
  }

  /**
   * Generate habit-specific insight
   */
  static async generateHabitInsight(
    habitId: string,
    userId: string,
  ): Promise<AIResponse> {
    const habitWithStats = await HabitStatsService.getHabitWithStats(
      habitId,
      userId,
    );

    if (!habitWithStats) {
      throw new Error("Habit not found");
    }

    const messages = PromptBuilder.buildHabitInsight(
      habitWithStats.name,
      habitWithStats.totalCompletions,
      habitWithStats.currentStreak,
      habitWithStats.completionRate,
    );

    return await AIService.generateCompletion(messages);
  }
}
