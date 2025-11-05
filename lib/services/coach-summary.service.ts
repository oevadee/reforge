import { AIResponse } from "@/types/ai";
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

    // Server-side generation disabled: return not found to trigger client generation path
    // All coach content is now generated client-side via WebAI
    throw new Error("AI content not available in cache");
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

    // Server-side generation disabled: return not found to trigger client generation path
    // All coach content is now generated client-side via WebAI
    throw new Error("AI content not available in cache");
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

    // Server-side generation disabled: return not found to trigger client generation path
    // All coach content is now generated client-side via WebAI
    throw new Error("AI content not available in cache");
  }

  /**
   * Generate weekly reflection analysis
   */
  static async generateWeeklyReflectionAnalysis(
    _userId: string,
  ): Promise<AIResponse> {
    // Server-side generation disabled: return not found to trigger client generation path
    // All coach content is now generated client-side via WebAI
    throw new Error("AI content not available in cache");
  }
}
