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

export const coachApi = {
  /**
   * Get daily or weekly summary
   */
  async getSummary(
    timeframe: "daily" | "weekly" = "daily",
  ): Promise<CoachSummaryResponse> {
    const response = await fetch(`/api/coach/summary?timeframe=${timeframe}`);
    const data: ApiResponse<CoachSummaryResponse> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to get summary");
    }

    return data.data!;
  },
};
