"use client";

import { WebAI } from "./client";
import { WebAIPromptBuilder } from "./prompts";
import { AIPromptContext } from "@/types/ai";

export type CoachMessageType =
  | "DAILY_SUMMARY"
  | "WEEKLY_SUMMARY"
  | "MOTIVATION"
  | "INSIGHT";

/**
 * Client-side coach generation using WebAI
 */
export class WebAICoach {
  /**
   * Generate daily summary on-device and save to server
   */
  static async generateDailySummary(context: AIPromptContext): Promise<string> {
    const status = WebAI.getStatus();
    if (!status.initialized) {
      throw new Error("WebAI not initialized. Please enable AI in settings.");
    }

    const messages = WebAIPromptBuilder.buildDailySummary(context);
    const content = await WebAI.generate(messages, {
      temperature: 0.7,
      maxTokens: 80,
    });

    // Save to server cache
    await this.saveToCache("DAILY_SUMMARY", content, 24);

    return content;
  }

  /**
   * Generate weekly summary on-device and save to server
   */
  static async generateWeeklySummary(
    context: AIPromptContext,
  ): Promise<string> {
    const status = WebAI.getStatus();
    if (!status.initialized) {
      throw new Error("WebAI not initialized. Please enable AI in settings.");
    }

    const messages = WebAIPromptBuilder.buildWeeklySummary(context);
    const content = await WebAI.generate(messages, {
      temperature: 0.7,
      maxTokens: 64,
    });

    // Save to server cache
    await this.saveToCache("WEEKLY_SUMMARY", content, 168);

    return content;
  }

  /**
   * Generate motivation message on-device and save to server
   */
  static async generateMotivation(context: AIPromptContext): Promise<string> {
    const status = WebAI.getStatus();
    if (!status.initialized) {
      throw new Error("WebAI not initialized. Please enable AI in settings.");
    }

    const messages = WebAIPromptBuilder.buildMotivation(context);
    const content = await WebAI.generate(messages, {
      temperature: 0.7,
      maxTokens: 80,
    });

    // Save to server cache
    await this.saveToCache("MOTIVATION", content, 24);

    return content;
  }

  /**
   * Generate daily summary with mood context
   */
  static async generateDailySummaryWithMood(
    context: AIPromptContext & { mood?: string; reflection?: string },
  ): Promise<string> {
    const status = WebAI.getStatus();
    if (!status.initialized) {
      throw new Error("WebAI not initialized. Please enable AI in settings.");
    }

    const messages = WebAIPromptBuilder.buildDailySummaryWithMood(context);
    const content = await WebAI.generate(messages, {
      temperature: 0.7,
      maxTokens: 64,
    });

    // Save to server cache
    await this.saveToCache("INSIGHT", content, 24);

    return content;
  }

  /**
   * Save generated content to server cache
   */
  private static async saveToCache(
    messageType: CoachMessageType,
    content: string,
    validHours: number,
  ): Promise<void> {
    try {
      const response = await fetch("/api/coach/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageType,
          content,
          validHours,
          metadata: {
            model: WebAI.getStatus().modelId,
            generatedAt: new Date().toISOString(),
            source: "webai",
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to cache coach message:", await response.text());
      }
    } catch (error) {
      console.error("Error caching coach message:", error);
      // Non-fatal: generation succeeded, caching failed
    }
  }
}
