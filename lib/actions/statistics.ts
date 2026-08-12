"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStatisticsData() {
  const userId = "default-user-id";

  // Last 30 daily summaries for trend charts
  const dailySummaries = await prisma.dailySummary.findMany({
    where: { userId },
    orderBy: { date: "asc" },
    take: 30,
  });

  // Last 365 days of habit logs for heatmap
  const since365 = new Date();
  since365.setDate(since365.getDate() - 365);

  const habitLogs = await prisma.habitLog.findMany({
    where: { userId, date: { gte: since365 } },
    orderBy: { date: "asc" },
    include: { habit: { select: { title: true } } },
  });

  // Territory XP
  const territories = await prisma.territory.findMany({
    orderBy: { xp: "desc" },
  });

  // Recent XP Logs
  const xpLogs = await prisma.xPLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Habits for consistency table
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    include: {
      logs: {
        where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      },
    },
    orderBy: { currentStreak: "desc" },
  });

  // Activity logs recent
  const activityLogs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: 20,
    include: { territory: true },
  });

  return { dailySummaries, habitLogs, territories, xpLogs, habits, activityLogs };
}
