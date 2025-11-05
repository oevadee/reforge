import { Reflection } from "@prisma/client";
import { CreateReflectionDto } from "@/types/reflections";
import { ApiResponse } from "@/types/forms";

export const reflectionsApi = {
  /**
   * Get reflections (recent or by date range)
   */
  async getAll(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Reflection[]> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.limit) searchParams.append("limit", String(params.limit));

    const response = await fetch(`/api/reflections?${searchParams.toString()}`);
    const data: ApiResponse<Reflection[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch reflections");
    }

    return data.data!;
  },

  /**
   * Get reflection by date
   */
  async getByDate(date: string): Promise<Reflection | null> {
    const reflections = await this.getAll({ startDate: date, endDate: date });
    return reflections[0] || null;
  },

  /**
   * Create or update reflection
   */
  async upsert(data: CreateReflectionDto): Promise<Reflection> {
    const response = await fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Reflection> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to save reflection");
    }

    return result.data!;
  },
};
