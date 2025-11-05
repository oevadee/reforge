import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { AiCoachCacheRepository } from "@/lib/repositories/ai-coach-cache.repository";
import { z } from "zod";
import { CoachMessageType } from "@prisma/client";

const ingestSchema = z.object({
  messageType: z.enum([
    "DAILY_SUMMARY",
    "WEEKLY_SUMMARY",
    "MOTIVATION",
    "INSIGHT",
  ]),
  content: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  validHours: z.number().min(1).max(168).default(24),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.info("[ingest] POST: start");
    const user = await getCurrentUser();
    console.info("[ingest] user", { userId: (user as any)?.id });

    const body = await request.json();
    const validation = ingestSchema.safeParse(body);

    if (!validation.success) {
      console.warn("[ingest] validation failed", {
        issues: validation.error.issues,
      });
      return NextResponse.json(
        { success: false, error: "Invalid request", details: validation.error },
        { status: 400 },
      );
    }

    const { messageType, content, metadata, validHours } = validation.data;

    await AiCoachCacheRepository.set(
      user.id,
      messageType as CoachMessageType,
      content,
      metadata || {},
      validHours,
    );

    console.info("[ingest] saved", { type: messageType, len: content.length });
    return NextResponse.json({
      success: true,
      data: { messageType, cached: true },
    });
  } catch (error) {
    console.error("[ingest] error", error);
    return NextResponse.json(
      { success: false, error: "Failed to save coach message" },
      { status: 500 },
    );
  }
}
