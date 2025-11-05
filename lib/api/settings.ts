import { ApiResponse } from "@/types/forms";
import { UserSettings, UpdateUserSettingsDto } from "@/types/settings";

export const settingsApi = {
  /**
   * Get user settings
   */
  async get(): Promise<UserSettings> {
    const response = await fetch("/api/settings");
    const data: ApiResponse<UserSettings> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch settings");
    }

    return data.data!;
  },

  /**
   * Update user settings
   */
  async update(settings: UpdateUserSettingsDto): Promise<UserSettings> {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data: ApiResponse<UserSettings> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to update settings");
    }

    return data.data!;
  },
};
