import { AIService } from "./ai.service";
import { PromptBuilder } from "@/lib/utils/prompts";
import { HabitStatsService } from "./habit-stats.service";
import { prisma } from "@/lib/prisma";
import { AIResponse, AIPromptContext } from "@/types/ai";
import { AiCoachCacheRepository } from "@/lib/repositories/ai-coach-cache.repository";

export class CoachSummaryService {
  /**
   * Generate daily summary (with caching)
   */
  static async generateDailySummary(
    userId: string,
    useCache: boolean = true,
  ): Promise<AIResponse> {
    // Check cache first
    if (useCache) {
      const cached = await AiCoachCacheRepository.get(userId, "DAILY_SUMMARY");
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

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Get habits with stats
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
      timeframe: "daily",
    };

    const messages = PromptBuilder.buildDailySummary(context);
    const response = await AIService.generateCompletion(messages);

    // Cache the response for 24 hours
    await AiCoachCacheRepository.set(
      userId,
      "DAILY_SUMMARY",
      response.content,
      {
        model: response.model,
        tokenUsage: response.totalTokens,
      },
      24,
    );

    return response;
  }

  /**
   * Generate weekly summary (with caching)
   */
  static async generateWeeklySummary(
    userId: string,
    useCache: boolean = true,
  ): Promise<AIResponse> {
    // Check cache first
    if (useCache) {
      const cached = await AiCoachCacheRepository.get(userId, "WEEKLY_SUMMARY");
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
      timeframe: "weekly",
    };

    const messages = PromptBuilder.buildWeeklySummary(context);
    const response = await AIService.generateCompletion(messages);

    // Cache the response for 7 days
    await AiCoachCacheRepository.set(
      userId,
      "WEEKLY_SUMMARY",
      response.content,
      {
        model: response.model,
        tokenUsage: response.totalTokens,
      },
      168, // 7 days * 24 hours
    );

    return response;
  }
}
