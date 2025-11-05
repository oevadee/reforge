import { ApiResponse } from "@/types/forms";

export interface CoachSummaryResponse {
  content: string;
  timeframe: "daily" | "weekly";
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface CoachMotivationResponse {
  content: string;
  habitId: string | null;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export const coachApi = {
  /**
   * Get daily or weekly summary
   */
  async getSummary(
    timeframe: "daily" | "weekly" = "daily",
    refresh: boolean = false,
  ): Promise<CoachSummaryResponse> {
    const params = new URLSearchParams({
      timeframe,
      ...(refresh && { refresh: "true" }),
    });

    const response = await fetch(`/api/coach/summary?${params}`);
    const data: ApiResponse<CoachSummaryResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to get summary");
    }

    return data.data!;
  },

  /**
   * Get motivational message (general or habit-specific)
   */
  async getMotivation(
    habitId?: string,
    refresh: boolean = false,
  ): Promise<CoachMotivationResponse> {
    const params = new URLSearchParams({
      ...(habitId && { habitId }),
      ...(refresh && { refresh: "true" }),
    });

    const url = `/api/coach/motivation?${params}`;
    const response = await fetch(url);
    const data: ApiResponse<CoachMotivationResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to get motivation");
    }

    return data.data!;
  },
};
