"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHabitsData() {
  const userId = "default-user-id";
  const todayStr = new Date().toISOString().split("T")[0];
  const todayDate = new Date(todayStr);

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

  const territories = await prisma.territory.findMany({ orderBy: { name: "asc" } });

  return { habits, territories };
}

export async function logHabitProgress(data: {
  habitId: string;
  value: number;
  completed?: boolean;
  notes?: string;
  targetDateStr?: string;
}) {
  const userId = "default-user-id";
  const dateStr = data.targetDateStr || new Date().toISOString().split("T")[0];
  const date = new Date(dateStr);

  const habit = await prisma.habit.findUnique({ where: { id: data.habitId } });
  if (!habit) return { success: false, error: "Habit not found" };

  const isFullyCompleted = data.completed ?? data.value >= habit.targetValue;
  const xpEarned = isFullyCompleted ? 25 : Math.round((data.value / habit.targetValue) * 20);

  // Upsert Habit Log
  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: data.habitId, date } },
    update: {
      completed: isFullyCompleted,
      value: data.value,
      notes: data.notes || undefined,
      xpEarned,
    },
    create: {
      userId,
      habitId: data.habitId,
      date,
      completed: isFullyCompleted,
      value: data.value,
      notes: data.notes || undefined,
      xpEarned,
    },
  });

  // Calculate Streak & Momentum (Grace Protection Math)
  const newStreak = isFullyCompleted ? habit.currentStreak + 1 : habit.currentStreak;
  const newLongest = Math.max(habit.longestStreak, newStreak);
  const newMomentum = isFullyCompleted
    ? Math.min(100, habit.momentum + 5)
    : Math.max(40, habit.momentum - 5);

  await prisma.habit.update({
    where: { id: data.habitId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      momentum: newMomentum,
      totalCompletions: isFullyCompleted ? { increment: 1 } : undefined,
    },
  });

  if (isFullyCompleted && habit.territoryId) {
    await prisma.territory.update({
      where: { id: habit.territoryId },
      data: { xp: { increment: xpEarned } },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        type: "HABIT_COMPLETED",
        description: `Completed habit: ${habit.title} (${data.value} ${habit.unit || ""})`,
        territoryId: habit.territoryId,
        xpEarned,
      },
    });

    await prisma.xPLog.create({
      data: {
        userId,
        amount: xpEarned,
        reason: `Completed habit: ${habit.title}`,
        source: "habit",
        territoryId: habit.territoryId,
      },
    });
  }

  revalidatePath("/habits");
  revalidatePath("/");
  return { success: true, completed: isFullyCompleted };
}

export async function createHabit(data: {
  title: string;
  description?: string;
  territoryId: string;
  type: "BINARY" | "NUMERIC" | "TIME_BASED" | "PERCENTAGE";
  targetValue: number;
  unit?: string;
  frequency?: "DAILY" | "WEEKLY";
}) {
  const userId = "default-user-id";

  const newHabit = await prisma.habit.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      territoryId: data.territoryId,
      type: data.type,
      targetValue: data.targetValue,
      unit: data.unit || undefined,
      frequency: data.frequency || "DAILY",
      currentStreak: 0,
      longestStreak: 0,
      momentum: 100.0,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/");
  return { success: true, habit: newHabit };
}
