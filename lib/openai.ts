import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type-safe model configuration
export const AI_CONFIG = {
  model: "gpt-4o" as const,
  temperature: 0.7,
  maxTokens: 500,
} as const;

export type AIModel = typeof AI_CONFIG.model;
