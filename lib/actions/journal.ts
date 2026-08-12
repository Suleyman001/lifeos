"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getJournalEntries() {
  const userId = "default-user-id";
  return await prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function saveJournalEntry(data: {
  date: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY";
  whatWentWell?: string;
  whatToImprove?: string;
  gratitude?: string;
  distractions?: string;
  whatILearned?: string;
  closerToAllah?: string;
  energyDrainers?: string;
  energyGivers?: string;
  smallWin?: string;
  tomorrowAction?: string;
  moodScore?: number;
}) {
  const userId = "default-user-id";
  const date = new Date(data.date);

  const entry = await prisma.journalEntry.upsert({
    where: { userId_date_type: { userId, date, type: data.type } },
    update: {
      whatWentWell: data.whatWentWell || null,
      whatToImprove: data.whatToImprove || null,
      gratitude: data.gratitude || null,
      distractions: data.distractions || null,
      whatILearned: data.whatILearned || null,
      closerToAllah: data.closerToAllah || null,
      energyDrainers: data.energyDrainers || null,
      energyGivers: data.energyGivers || null,
      smallWin: data.smallWin || null,
      tomorrowAction: data.tomorrowAction || null,
      moodScore: data.moodScore ?? 5,
    },
    create: {
      userId,
      date,
      type: data.type,
      whatWentWell: data.whatWentWell || null,
      whatToImprove: data.whatToImprove || null,
      gratitude: data.gratitude || null,
      distractions: data.distractions || null,
      whatILearned: data.whatILearned || null,
      closerToAllah: data.closerToAllah || null,
      energyDrainers: data.energyDrainers || null,
      energyGivers: data.energyGivers || null,
      smallWin: data.smallWin || null,
      tomorrowAction: data.tomorrowAction || null,
      moodScore: data.moodScore ?? 5,
    },
  });

  revalidatePath("/journal");
  return { success: true, entry };
}

export async function deleteJournalEntry(id: string) {
  await prisma.journalEntry.delete({ where: { id } });
  revalidatePath("/journal");
  return { success: true };
}
