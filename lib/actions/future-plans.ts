"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFuturePlans() {
  const userId = "default-user-id";
  return await prisma.futurePlan.findMany({
    where: { userId },
    orderBy: { targetDate: "asc" },
  });
}

export async function createFuturePlan(data: {
  title: string;
  category: "MARRIAGE" | "RELOCATION" | "CAREER" | "EDUCATION" | "BUSINESS" | "FINANCIAL_INDEPENDENCE" | "OTHER";
  targetDate?: string;
  notes?: string;
}) {
  const userId = "default-user-id";

  const plan = await prisma.futurePlan.create({
    data: {
      userId,
      title: data.title,
      category: data.category,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      notes: data.notes || null,
      status: "PLANNED",
    },
  });

  revalidatePath("/future-plans");
  return { success: true, plan };
}

export async function updateFuturePlan(id: string, data: {
  title?: string;
  status?: "PLANNED" | "IN_PROGRESS" | "ACHIEVED" | "POSTPONED";
  targetDate?: string;
  notes?: string;
}) {
  await prisma.futurePlan.update({
    where: { id },
    data: {
      ...data,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
    },
  });
  revalidatePath("/future-plans");
  return { success: true };
}

export async function deleteFuturePlan(id: string) {
  await prisma.futurePlan.delete({ where: { id } });
  revalidatePath("/future-plans");
  return { success: true };
}
