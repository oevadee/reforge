import { aiClient, AI_CONFIG } from "@/lib/ai";
import { AIResponse, AIError } from "@/types/ai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export class AIService {
  /**
   * Generate AI completion with error handling
   */
  static async generateCompletion(
    messages: ChatCompletionMessageParam[],
  ): Promise<AIResponse> {
    try {
      const completion = await aiClient.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      });

      const choice = completion.choices[0];
      if (!choice?.message?.content) {
        throw new Error("No content in AI response");
      }

      return {
        content: choice.message.content,
        model: completion.model,
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        completionTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      };
    } catch (error: any) {
      console.error("AI API error:", error);

      const aiError: AIError = {
        message: error.message || "AI generation failed",
        code: error.code,
        statusCode: error.status,
      };

      throw aiError;
    }
  }

  /**
   * Validate API key on startup
   */
  static async validateAPIKey(): Promise<boolean> {
    try {
      await aiClient.models.list();
      return true;
    } catch (error) {
      console.error("Invalid AI API key");
      return false;
    }
  }
}
