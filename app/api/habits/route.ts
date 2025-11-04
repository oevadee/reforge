import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitRepository } from "@/lib/repositories/habit.repository";
import { HabitFilters } from "@/types/habits";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: HabitFilters = {
      type: (searchParams.get("type") as any) || undefined,
      frequency: (searchParams.get("frequency") as any) || undefined,
      isActive:
        searchParams.get("isActive") === "true"
          ? true
          : searchParams.get("isActive") === "false"
            ? false
            : undefined,
      search: searchParams.get("search") || undefined,
    };

    const habits = await HabitRepository.findByUser(user.id, filters);

    return NextResponse.json({ success: true, data: habits });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habits" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    // Validate input
    const { createHabitSchema } = await import("@/lib/validations/habit");
    const validationResult = createHabitSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const habit = await HabitRepository.create(user.id, validationResult.data);

    return NextResponse.json({ success: true, data: habit }, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create habit" },
      { status: 500 },
    );
  }
}
