"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDashboardData() {
  const userId = "default-user-id";

  // 1. Fetch User & Settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  // 2. Fetch Territories with stats
  const territories = await prisma.territory.findMany({
    orderBy: { weight: "desc" },
  });

  // 3. Fetch Current High-Impact Mission
  const currentMission = await prisma.mission.findFirst({
    where: { userId, isCurrentMission: true },
    include: { territory: true, tasks: true },
  });

  // 4. Fetch Today's Daily Summary
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDate = new Date(todayStr);

  let dailySummary = await prisma.dailySummary.findUnique({
    where: { date: todayDate },
  });

  if (!dailySummary) {
    dailySummary = await prisma.dailySummary.create({
      data: {
        userId,
        date: todayDate,
        betterThanYesterdayScore: 5.2, // +5.2% vs yesterday initial
        focusedTimeMinutes: 185,
        deepWorkMinutes: 120,
        wastedTimeMinutes: 35,
        productivePercent: 84.0,
        plannedTimeMinutes: 240,
        completedTimeMinutes: 185,
        habitsCompleted: 7,
        totalHabits: 10,
        tasksCompleted: 4,
        totalXpEarned: 240,
        momentumScore: 92.5,
      },
    });
  }

  // 5. Fetch Habits & Today's logs
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    include: {
      territory: true,
      logs: {
        where: { date: todayDate },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // 6. Fetch Active Challenges
  const activeChallenges = await prisma.activeChallenge.findMany({
    where: { userId, status: "ACTIVE" },
    include: { challenge: { include: { territory: true } } },
  });

  // 7. Recent Activity Logs
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: 6,
    include: { territory: true },
  });

  return {
    user,
    territories,
    currentMission,
    dailySummary,
    habits,
    activeChallenges,
    activityLogs,
  };
}

export async function triggerBreakTheCycle() {
  const userId = "default-user-id";
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDate = new Date(todayStr);

  // Log recovery action to Activity Log
  await prisma.activityLog.create({
    data: {
      userId,
      type: "RECOVERY_ACTION",
      description: "Triggered Break the Cycle recovery protocol.",
      xpEarned: 25,
    },
  });

  // Boost momentum slightly as recovery effort
  await prisma.dailySummary.upsert({
    where: { date: todayDate },
    update: { momentumScore: { increment: 5.0 } },
    create: {
      userId,
      date: todayDate,
      momentumScore: 85.0,
    },
  });

  revalidatePath("/");
  return {
    success: true,
    recommendation: {
      actionTitle: "5-Minute Grounding & Reset",
      steps: [
        "Drink 0.5L of cold water.",
        "Take a 5-minute outdoor walk without your phone.",
        "Recite 33x Istighfar to clear mental fatigue.",
        "Resume high-impact task for 25 focused minutes.",
      ],
    },
  };
}
