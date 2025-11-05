import { AIService } from "./ai.service";
import { PromptBuilder } from "@/lib/utils/prompts";
import { HabitStatsService } from "./habit-stats.service";
import { prisma } from "@/lib/prisma";
import { AIResponse, AIPromptContext } from "@/types/ai";
import { AiCoachCacheRepository } from "@/lib/repositories/ai-coach-cache.repository";

export class CoachMotivationService {
  /**
   * Generate personalized motivation (with caching)
   */
  static async generateMotivation(
    userId: string,
    useCache: boolean = true,
  ): Promise<AIResponse> {
    // Check cache first
    if (useCache) {
      const cached = await AiCoachCacheRepository.get(userId, "MOTIVATION");
      if (cached) {
        return {
          content: cached.content,
          model: (cached.metadata as any)?.model || "cached",
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        };
      }
    }

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

    throw new Error("AI content not available in cache");
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

    throw new Error("AI content not available in cache");
  }
}
