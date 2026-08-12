"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChallengesData() {
  const userId = "default-user-id";

  const masterChallenges = await prisma.challenge.findMany({
    include: { territory: true },
    orderBy: { createdAt: "desc" },
  });

  const activeInstances = await prisma.activeChallenge.findMany({
    where: { userId },
    include: {
      challenge: {
        include: { territory: true },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return { masterChallenges, activeInstances };
}

export async function acceptChallenge(challengeId: string) {
  const userId = "default-user-id";

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) return { success: false, error: "Challenge not found" };

  const existingActive = await prisma.activeChallenge.findFirst({
    where: { userId, challengeId, status: "ACTIVE" },
  });

  if (existingActive) return { success: false, error: "Challenge already active!" };

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + challenge.durationDays);

  const activeInstance = await prisma.activeChallenge.create({
    data: {
      userId,
      challengeId,
      startDate: new Date(),
      endDate,
      status: "ACTIVE",
      currentValue: 0,
      progressPercent: 0,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId,
      type: "CHALLENGE_ACCEPTED",
      description: `Accepted Side-Quest: ${challenge.title}`,
      territoryId: challenge.territoryId,
      xpEarned: 20,
    },
  });

  revalidatePath("/challenges");
  revalidatePath("/");
  return { success: true, activeInstance };
}

export async function updateChallengeProgress(activeId: string, incrementValue: number) {
  const userId = "default-user-id";

  const active = await prisma.activeChallenge.findUnique({
    where: { id: activeId },
    include: { challenge: true },
  });

  if (!active) return { success: false, error: "Active challenge not found" };

  const newValue = active.currentValue + incrementValue;
  const target = active.challenge.targetValue;
  const progressPercent = Math.min(100, Math.round((newValue / target) * 100));
  const isCompleted = progressPercent >= 100;

  await prisma.activeChallenge.update({
    where: { id: activeId },
    data: {
      currentValue: newValue,
      progressPercent,
      status: isCompleted ? "COMPLETED" : "ACTIVE",
      completedAt: isCompleted ? new Date() : null,
    },
  });

  if (isCompleted) {
    // Reward XP
    await prisma.territory.update({
      where: { id: active.challenge.territoryId },
      data: { xp: { increment: active.challenge.rewardXp } },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        type: "CHALLENGE_COMPLETED",
        description: `Completed Quest: ${active.challenge.title}!`,
        territoryId: active.challenge.territoryId,
        xpEarned: active.challenge.rewardXp,
      },
    });

    await prisma.xPLog.create({
      data: {
        userId,
        amount: active.challenge.rewardXp,
        reason: `Completed Quest: ${active.challenge.title}`,
        source: "challenge",
        territoryId: active.challenge.territoryId,
      },
    });
  }

  revalidatePath("/challenges");
  revalidatePath("/");
  return { success: true, completed: isCompleted };
}

export async function abandonChallenge(activeId: string) {
  await prisma.activeChallenge.update({
    where: { id: activeId },
    data: { status: "ABANDONED" },
  });
  revalidatePath("/challenges");
  revalidatePath("/");
  return { success: true };
}

export async function deleteActiveChallenge(activeId: string) {
  await prisma.activeChallenge.delete({ where: { id: activeId } });
  revalidatePath("/challenges");
  revalidatePath("/");
  return { success: true };
}
