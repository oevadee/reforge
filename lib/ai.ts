import OpenAI from "openai";

// Determine AI provider based on environment
// Default: Ollama (local, free), Fallback: OpenAI (paid)
const AI_PROVIDER = process.env.AI_PROVIDER || "ollama";

// Configure client based on provider
export const aiClient = new OpenAI(
  AI_PROVIDER === "ollama"
    ? {
        baseURL: "http://127.0.0.1:11434/v1",
        apiKey: "ollama", // Ollama doesn't need a real API key
      }
    : {
        apiKey: process.env.OPENAI_API_KEY || "",
      },
);

// Type-safe model configuration
export const AI_CONFIG = {
  model: AI_PROVIDER === "ollama" ? "llama3.1:8b" : "gpt-4o",
  temperature: 0.7,
  maxTokens: 500,
  provider: AI_PROVIDER,
} as const;

export type AIModel = string;
