"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMissions() {
  const userId = "default-user-id";
  const missions = await prisma.mission.findMany({
    where: { userId },
    include: { territory: true, tasks: true },
    orderBy: { priority: "desc" },
  });
  const territories = await prisma.territory.findMany({ orderBy: { name: "asc" } });
  return { missions, territories };
}

export async function createMission(data: {
  title: string;
  description?: string;
  territoryId?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  targetDate?: string;
  isCurrentMission?: boolean;
}) {
  const userId = "default-user-id";

  if (data.isCurrentMission) {
    await prisma.mission.updateMany({
      where: { userId, isCurrentMission: true },
      data: { isCurrentMission: false },
    });
  }

  const mission = await prisma.mission.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
      territoryId: data.territoryId || null,
      priority: data.priority || "HIGH",
      status: "ACTIVE",
      progressPercent: 0,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      isCurrentMission: data.isCurrentMission ?? false,
    },
  });

  revalidatePath("/missions");
  revalidatePath("/");
  return { success: true, mission };
}

export async function updateMission(id: string, data: {
  title?: string;
  description?: string;
  progressPercent?: number;
  status?: "PLANNING" | "ACTIVE" | "COMPLETED" | "PAUSED";
  isCurrentMission?: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}) {
  const userId = "default-user-id";

  if (data.isCurrentMission) {
    await prisma.mission.updateMany({
      where: { userId, isCurrentMission: true },
      data: { isCurrentMission: false },
    });
  }

  await prisma.mission.update({ where: { id }, data });
  revalidatePath("/missions");
  revalidatePath("/");
  return { success: true };
}

export async function deleteMission(id: string) {
  await prisma.mission.delete({ where: { id } });
  revalidatePath("/missions");
  revalidatePath("/");
  return { success: true };
}
