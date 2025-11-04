import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitRepository } from "@/lib/repositories/habit.repository";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const params = await context.params;
    const habit = await HabitRepository.findById(params.id, user.id);

    if (!habit) {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: habit });
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch habit" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const params = await context.params;
    const body = await request.json();

    // Validate input
    const { updateHabitSchema } = await import("@/lib/validations/habit");
    const validationResult = updateHabitSchema.safeParse(body);

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

    const habit = await HabitRepository.update(
      params.id,
      user.id,
      validationResult.data,
    );

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    if (error.message === "Habit not found") {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    console.error("Error updating habit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update habit" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const params = await context.params;

    // Check if permanent delete is requested
    const searchParams = request.nextUrl.searchParams;
    const permanent = searchParams.get("permanent") === "true";

    if (permanent) {
      await HabitRepository.hardDelete(params.id, user.id);
    } else {
      await HabitRepository.softDelete(params.id, user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Habit not found") {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete habit" },
      { status: 500 },
    );
  }
}
