import { AIResponse } from "@/types/ai";

// Server-side AI is disabled. This service intentionally throws to prevent usage.
export class AIService {
  static async generateCompletion(): Promise<AIResponse> {
    throw new Error("Server-side AI is disabled. Use WebLLM on the client.");
  }

  static async validateAPIKey(): Promise<boolean> {
    return false;
  }
}
