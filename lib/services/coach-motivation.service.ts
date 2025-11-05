import { HabitStatsService } from "./habit-stats.service";
import { AIResponse } from "@/types/ai";
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

    // Context building removed - server-side AI generation disabled
    // All coach content is now generated client-side via WebAI

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
