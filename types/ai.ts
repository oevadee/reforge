export interface AIPromptContext {
  habitData?: {
    name: string;
    type: string;
    completions: number;
    streak: number;
  }[];
  userData?: {
    name: string;
    totalHabits: number;
  };
  timeframe?: "daily" | "weekly";
  mood?: string;
  reflection?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIError {
  message: string;
  code?: string;
  statusCode?: number;
}
