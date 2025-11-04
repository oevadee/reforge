import { Habit } from "@prisma/client";
import {
  CreateHabitDto,
  UpdateHabitDto,
  HabitFilters,
  HabitWithStats,
} from "@/types/habits";
import { ApiResponse } from "@/types/forms";

const BASE_URL = "/api/habits";

export const habitsApi = {
  /**
   * Fetch all habits with optional filters
   */
  async getAll(filters?: HabitFilters): Promise<Habit[]> {
    const params = new URLSearchParams();

    if (filters?.type) params.append("type", filters.type);
    if (filters?.frequency) params.append("frequency", filters.frequency);
    if (filters?.isActive !== undefined)
      params.append("isActive", String(filters.isActive));
    if (filters?.search) params.append("search", filters.search);

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    const data: ApiResponse<Habit[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch habits");
    }

    return data.data!;
  },

  /**
   * Fetch a single habit by ID
   */
  async getById(id: string): Promise<Habit> {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data: ApiResponse<Habit> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch habit");
    }

    return data.data!;
  },

  /**
   * Create a new habit
   */
  async create(habitData: CreateHabitDto): Promise<Habit> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitData),
    });

    const data: ApiResponse<Habit> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to create habit");
    }

    return data.data!;
  },

  /**
   * Update an existing habit
   */
  async update(id: string, habitData: UpdateHabitDto): Promise<Habit> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habitData),
    });

    const data: ApiResponse<Habit> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to update habit");
    }

    return data.data!;
  },

  /**
   * Delete a habit (soft delete by default)
   */
  async delete(id: string, permanent = false): Promise<void> {
    const params = permanent ? "?permanent=true" : "";
    const response = await fetch(`${BASE_URL}/${id}${params}`, {
      method: "DELETE",
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to delete habit");
    }
  },

  /**
   * Get habit with statistics
   */
  async getWithStats(id: string): Promise<HabitWithStats> {
    const response = await fetch(`${BASE_URL}/${id}/stats`);
    const data: ApiResponse<HabitWithStats> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch habit stats");
    }

    return data.data!;
  },

  /**
   * Get all habits with statistics
   */
  async getAllWithStats(): Promise<HabitWithStats[]> {
    const response = await fetch(`${BASE_URL}/stats`);
    const data: ApiResponse<HabitWithStats[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch habits stats");
    }

    return data.data!;
  },
};
