import { DailyCheckInHabit } from "@/types/habit-logs";
import { ApiResponse } from "@/types/forms";

export const checkinApi = {
  /**
   * Get today's habits for check-in
   */
  async getToday(): Promise<DailyCheckInHabit[]> {
    const response = await fetch("/api/checkin");
    const data: ApiResponse<DailyCheckInHabit[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch check-in data");
    }

    return data.data!;
  },
};
