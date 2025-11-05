import { prisma } from "@/lib/prisma";
import { AiCoachCache, CoachMessageType } from "@prisma/client";

export class AiCoachCacheRepository {
  /**
   * Get cached message if still valid
   */
  static async get(
    userId: string,
    messageType: CoachMessageType,
  ): Promise<AiCoachCache | null> {
    return prisma.aiCoachCache.findFirst({
      where: {
        userId,
        messageType,
        validUntil: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Store new cached message
   */
  static async set(
    userId: string,
    messageType: CoachMessageType,
    content: string,
    metadata: Record<string, any>,
    validityHours: number = 24,
  ): Promise<AiCoachCache> {
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + validityHours);

    return prisma.aiCoachCache.create({
      data: {
        userId,
        messageType,
        content,
        metadata,
        validUntil,
      },
    });
  }

  /**
   * Invalidate cache for user and message type
   */
  static async invalidate(
    userId: string,
    messageType: CoachMessageType,
  ): Promise<void> {
    await prisma.aiCoachCache.deleteMany({
      where: {
        userId,
        messageType,
      },
    });
  }

  /**
   * Clean up expired cache entries
   */
  static async cleanExpired(): Promise<number> {
    const result = await prisma.aiCoachCache.deleteMany({
      where: {
        validUntil: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
