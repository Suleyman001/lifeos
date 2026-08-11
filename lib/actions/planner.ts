"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPlannerTasks(dateStr?: string) {
  const userId = "default-user-id";
  const targetDateStr = dateStr || new Date().toISOString().split("T")[0];
  const targetDate = new Date(targetDateStr);

  // 1. Fetch Task Occurrences scheduled for targetDate
  let occurrences = await prisma.taskOccurrence.findMany({
    where: {
      userId,
      scheduledDate: targetDate,
    },
    include: {
      task: {
        include: {
          territory: true,
          mission: true,
        },
      },
    },
    orderBy: { task: { startTime: "asc" } },
  });

  // If no occurrences exist for today, create default occurrences from master tasks
  if (occurrences.length === 0) {
    const masterTasks = await prisma.task.findMany({
      where: { userId, isArchived: false },
      include: { territory: true, mission: true },
    });

    if (masterTasks.length === 0) {
      // Seed default planner master tasks
      const deenTerritory = await prisma.territory.findUnique({ where: { slug: "deen" } });
      const knowledgeTerritory = await prisma.territory.findUnique({ where: { slug: "knowledge" } });
      const careerTerritory = await prisma.territory.findUnique({ where: { slug: "career" } });
      const healthTerritory = await prisma.territory.findUnique({ where: { slug: "health" } });

      const defaultTasksData = [
        {
          title: "Fajr & Morning Adhkar Block",
          description: "Prayer in congregation and morning remembrance.",
          territoryId: deenTerritory?.id,
          startTime: "05:00",
          endTime: "05:45",
          estimatedDurationMinutes: 45,
          priority: "HIGH" as const,
          energyRequired: "HIGH" as const,
        },
        {
          title: "AWS Certification Deep Work",
          description: "Module 4: EC2 Architecture & CloudFormation.",
          territoryId: careerTerritory?.id,
          startTime: "09:00",
          endTime: "10:30",
          estimatedDurationMinutes: 90,
          priority: "URGENT" as const,
          energyRequired: "HIGH" as const,
        },
        {
          title: "German Vocabulary & Grammar Practice",
          description: "Learn 20 new words on Anki and read German article.",
          territoryId: knowledgeTerritory?.id,
          startTime: "11:00",
          endTime: "11:45",
          estimatedDurationMinutes: 45,
          priority: "MEDIUM" as const,
          energyRequired: "MEDIUM" as const,
        },
        {
          title: "Dhuhr Prayer & Short Break",
          description: "Midday prayer and light hydration reset.",
          territoryId: deenTerritory?.id,
          startTime: "13:00",
          endTime: "13:30",
          estimatedDurationMinutes: 30,
          priority: "HIGH" as const,
          energyRequired: "LOW" as const,
        },
        {
          title: "Evening Workout & 7,500 Steps",
          description: "Brisk walk and resistance training.",
          territoryId: healthTerritory?.id,
          startTime: "17:30",
          endTime: "18:30",
          estimatedDurationMinutes: 60,
          priority: "HIGH" as const,
          energyRequired: "HIGH" as const,
        },
      ];

      for (const tData of defaultTasksData) {
        const createdTask = await prisma.task.create({
          data: {
            ...tData,
            userId,
          },
        });

        await prisma.taskOccurrence.create({
          data: {
            taskId: createdTask.id,
            userId,
            scheduledDate: targetDate,
            status: "PENDING",
          },
        });
      }
    } else {
      for (const masterTask of masterTasks) {
        await prisma.taskOccurrence.create({
          data: {
            taskId: masterTask.id,
            userId,
            scheduledDate: targetDate,
            status: "PENDING",
          },
        });
      }
    }

    occurrences = await prisma.taskOccurrence.findMany({
      where: {
        userId,
        scheduledDate: targetDate,
      },
      include: {
        task: {
          include: {
            territory: true,
            mission: true,
          },
        },
      },
      orderBy: { task: { startTime: "asc" } },
    });
  }

  // Fetch territories for select options
  const territories = await prisma.territory.findMany({ orderBy: { name: "asc" } });

  return { occurrences, territories, dateStr: targetDateStr };
}

export async function toggleTaskOccurrence(occurrenceId: string, currentStatus: string) {
  const userId = "default-user-id";
  const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
  const isCompleted = newStatus === "COMPLETED";

  const occurrence = await prisma.taskOccurrence.update({
    where: { id: occurrenceId },
    data: {
      status: newStatus,
      completedAt: isCompleted ? new Date() : null,
      xpEarned: isCompleted ? 50 : 0,
    },
    include: { task: { include: { territory: true } } },
  });

  if (isCompleted) {
    // Award XP to Territory if linked
    if (occurrence.task.territoryId) {
      await prisma.territory.update({
        where: { id: occurrence.task.territoryId },
        data: { xp: { increment: 50 } },
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId,
        type: "TASK_COMPLETED",
        description: `Completed task: ${occurrence.task.title}`,
        territoryId: occurrence.task.territoryId,
        xpEarned: 50,
      },
    });

    // Record XP Log
    await prisma.xPLog.create({
      data: {
        userId,
        amount: 50,
        reason: `Completed task: ${occurrence.task.title}`,
        source: "task",
        territoryId: occurrence.task.territoryId,
      },
    });
  }

  revalidatePath("/planner/daily");
  revalidatePath("/");
  return { success: true };
}

export async function createPlannerTask(data: {
  title: string;
  description?: string;
  territoryId?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  energyRequired?: "LOW" | "MEDIUM" | "HIGH";
  recurrenceType?: "NONE" | "DAILY" | "WEEKDAYS" | "WEEKENDS";
  scheduledDateStr?: string;
}) {
  const userId = "default-user-id";
  const dateStr = data.scheduledDateStr || new Date().toISOString().split("T")[0];
  const targetDate = new Date(dateStr);

  const newTask = await prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      territoryId: data.territoryId || null,
      startTime: data.startTime || "09:00",
      endTime: data.endTime || "10:00",
      estimatedDurationMinutes: data.durationMinutes || 60,
      priority: data.priority || "MEDIUM",
      energyRequired: data.energyRequired || "MEDIUM",
      recurrenceType: data.recurrenceType || "NONE",
    },
  });

  await prisma.taskOccurrence.create({
    data: {
      taskId: newTask.id,
      userId,
      scheduledDate: targetDate,
      status: "PENDING",
    },
  });

  revalidatePath("/planner/daily");
  revalidatePath("/");
  return { success: true };
}
