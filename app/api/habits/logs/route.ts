import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { HabitLogRepository } from "@/lib/repositories/habit-log.repository";
import { createHabitLogSchema } from "@/lib/validations/habit-log";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const validationResult = createHabitLogSchema.safeParse(body);
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

    const log = await HabitLogRepository.upsert(user.id, validationResult.data);

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Habit not found") {
      return NextResponse.json(
        { success: false, error: "Habit not found" },
        { status: 404 },
      );
    }

    console.error("Error creating habit log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create log" },
      { status: 500 },
    );
  }
}
