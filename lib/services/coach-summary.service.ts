import { AIService } from "./ai.service";
import { PromptBuilder } from "@/lib/utils/prompts";
import { HabitStatsService } from "./habit-stats.service";
import { prisma } from "@/lib/prisma";
import { AIResponse, AIPromptContext } from "@/types/ai";

export class CoachSummaryService {
  /**
   * Generate daily summary
   */
  static async generateDailySummary(userId: string): Promise<AIResponse> {
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
    return await AIService.generateCompletion(messages);
  }

  /**
   * Generate weekly summary
   */
  static async generateWeeklySummary(userId: string): Promise<AIResponse> {
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
    return await AIService.generateCompletion(messages);
  }
}
