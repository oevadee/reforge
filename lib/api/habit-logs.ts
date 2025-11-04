import { HabitLog } from "@prisma/client";
import { CreateHabitLogDto } from "@/types/habit-logs";
import { ApiResponse } from "@/types/forms";

export const habitLogsApi = {
  /**
   * Create or update a habit log
   */
  async upsert(logData: CreateHabitLogDto): Promise<HabitLog> {
    const response = await fetch("/api/habits/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });

    const data: ApiResponse<HabitLog> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to log habit");
    }

    return data.data!;
  },
};
