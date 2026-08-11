"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLearningData() {
  const userId = "default-user-id";
  const items = await prisma.learningItem.findMany({
    where: { userId },
    include: { territory: true, sessions: { orderBy: { date: "desc" }, take: 5 } },
    orderBy: { updatedAt: "desc" },
  });
  const territories = await prisma.territory.findMany({ orderBy: { name: "asc" } });

  return { items, territories };
}

export async function logStudySession(data: {
  learningItemId: string;
  durationMinutes: number;
  itemsLearned: number; // e.g., words or lessons
  notes?: string;
}) {
  const userId = "default-user-id";
  const xpEarned = Math.round((data.durationMinutes / 10) * 15);

  const session = await prisma.learningSession.create({
    data: {
      userId,
      learningItemId: data.learningItemId,
      durationMinutes: data.durationMinutes,
      itemsLearned: data.itemsLearned,
      notes: data.notes || undefined,
      xpEarned,
    },
  });

  // Update master Learning Item progress
  const item = await prisma.learningItem.findUnique({ where: { id: data.learningItemId } });
  if (item) {
    const newTime = item.timeSpentMinutes + data.durationMinutes;
    const newVocab = item.vocabLearned + data.itemsLearned;
    const targetVocab = item.targetVocab || 500;
    const progressPercent = Math.min(100, Math.round((newVocab / targetVocab) * 100));

    await prisma.learningItem.update({
      where: { id: data.learningItemId },
      data: {
        timeSpentMinutes: newTime,
        vocabLearned: newVocab,
        progressPercent,
      },
    });

    if (item.territoryId) {
      await prisma.territory.update({
        where: { id: item.territoryId },
        data: { xp: { increment: xpEarned } },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId,
        type: "LEARNING_SESSION",
        description: `Logged ${data.durationMinutes}m study session for ${item.title} (+${data.itemsLearned} items)`,
        territoryId: item.territoryId,
        xpEarned,
      },
    });
  }

  revalidatePath("/learning");
  revalidatePath("/");
  return { success: true, session };
}

export async function createLearningItem(data: {
  title: string;
  category: "GERMAN" | "ARABIC" | "IT_CERTIFICATIONS" | "AWS" | "AZURE" | "PROGRAMMING" | "ISLAMIC_KNOWLEDGE" | "BOOKS" | "COURSES" | "OTHER";
  territoryId: string;
  targetVocab?: number;
  totalLessons?: number;
}) {
  const userId = "default-user-id";

  const newItem = await prisma.learningItem.create({
    data: {
      userId,
      title: data.title,
      category: data.category,
      territoryId: data.territoryId,
      targetVocab: data.targetVocab || 500,
      totalLessons: data.totalLessons || undefined,
      progressPercent: 0,
    },
  });

  revalidatePath("/learning");
  return { success: true, newItem };
}
