"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addInboxItem(content: string) {
  const userId = "default-user-id";
  if (!content || !content.trim()) return { success: false, error: "Content empty" };

  const item = await prisma.inboxItem.create({
    data: {
      userId,
      content: content.trim(),
    },
  });

  revalidatePath("/");
  return { success: true, item };
}

export async function getInboxItems() {
  const userId = "default-user-id";
  return await prisma.inboxItem.findMany({
    where: { userId, processed: false },
    orderBy: { createdAt: "desc" },
  });
}
