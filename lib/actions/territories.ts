"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTerritoryWeight(territoryId: string, newWeight: number) {
  await prisma.territory.update({
    where: { id: territoryId },
    data: { weight: newWeight },
  });

  revalidatePath("/territories");
  revalidatePath("/");
  return { success: true };
}
