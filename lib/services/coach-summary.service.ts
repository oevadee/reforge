import { AIService } from "./ai.service";
import { PromptBuilder } from "@/lib/utils/prompts";
import { HabitStatsService } from "./habit-stats.service";
import { prisma } from "@/lib/prisma";
import { AIResponse, AIPromptContext } from "@/types/ai";
import { AiCoachCacheRepository } from "@/lib/repositories/ai-coach-cache.repository";
import { ReflectionRepository } from "@/lib/repositories/reflection.repository";
import { MOOD_DATA } from "@/types/reflections";

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

    // Server-side generation disabled: return not found to trigger client generation path
    throw new Error("AI content not available in cache");

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

    throw new Error("AI content not available in cache");

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

  /**
   * Generate daily summary with mood context (with caching)
   */
  static async generateDailySummaryWithMood(
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const habits = await HabitStatsService.getAllHabitsWithStats(userId);

    // Get today's reflection
    const today = new Date().toISOString().split("T")[0];
    const todayReflection = await ReflectionRepository.findByDate(
      userId,
      today,
    );

    const context = {
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
      mood: todayReflection?.mood
        ? MOOD_DATA[todayReflection.mood].label
        : undefined,
      reflection: todayReflection?.content || undefined,
      timeframe: "daily" as const,
    };

    const messages = todayReflection
      ? PromptBuilder.buildDailySummaryWithMood(context)
      : PromptBuilder.buildDailySummary(context);

    throw new Error("AI content not available in cache");
  }

  /**
   * Generate weekly reflection analysis
   */
  static async generateWeeklyReflectionAnalysis(
    userId: string,
  ): Promise<AIResponse> {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const startDateStr = startDate.toISOString().split("T")[0];

    const [reflections, habits] = await Promise.all([
      ReflectionRepository.findByDateRange(userId, startDateStr, endDate),
      HabitStatsService.getAllHabitsWithStats(userId),
    ]);

    const reflectionData = reflections.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      mood: r.mood ? MOOD_DATA[r.mood].label : "Not recorded",
      content: r.content || undefined,
    }));

    const habitData = habits.map((h) => ({
      name: h.name,
      type: h.type,
      completions: h.totalCompletions,
      streak: h.currentStreak,
    }));

    throw new Error("AI content not available in cache");
  }
}
