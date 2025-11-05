import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { ReflectionRepository } from "@/lib/repositories/reflection.repository";
import { createReflectionSchema } from "@/lib/validations/reflection";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const searchParams = request.nextUrl.searchParams;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    let reflections;
    if (startDate && endDate) {
      reflections = await ReflectionRepository.findByDateRange(
        user.id,
        startDate,
        endDate,
      );
    } else {
      reflections = await ReflectionRepository.findRecent(
        user.id,
        limit ? parseInt(limit) : 7,
      );
    }

    return NextResponse.json({ success: true, data: reflections });
  } catch (error) {
    console.error("Error fetching reflections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reflections" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const validationResult = createReflectionSchema.safeParse(body);
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

    const reflection = await ReflectionRepository.upsert(
      user.id,
      validationResult.data,
    );

    return NextResponse.json(
      { success: true, data: reflection },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating reflection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reflection" },
      { status: 500 },
    );
  }
}
