"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCareerApplications() {
  const userId = "default-user-id";
  return await prisma.careerApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCareerApplication(data: {
  company: string;
  position: string;
  country: string;
  location?: string;
  workType?: "REMOTE" | "HYBRID" | "ONSITE";
  status?: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ACCEPTED";
  salary?: string;
  visaSponsorship?: boolean;
  jobUrl?: string;
  notes?: string;
}) {
  const userId = "default-user-id";

  const application = await prisma.careerApplication.create({
    data: {
      userId,
      company: data.company,
      position: data.position,
      country: data.country,
      location: data.location || undefined,
      workType: data.workType || "HYBRID",
      status: data.status || "SAVED",
      salary: data.salary || undefined,
      visaSponsorship: data.visaSponsorship ?? false,
      jobUrl: data.jobUrl || undefined,
      notes: data.notes || undefined,
      appliedDate: data.status === "APPLIED" ? new Date() : undefined,
    },
  });

  const careerTerritory = await prisma.territory.findUnique({ where: { slug: "career" } });
  if (careerTerritory) {
    await prisma.activityLog.create({
      data: {
        userId,
        type: "CAREER_APPLICATION",
        description: `Logged application: ${data.position} at ${data.company} (${data.country})`,
        territoryId: careerTerritory.id,
        xpEarned: 30,
      },
    });
  }

  revalidatePath("/career");
  revalidatePath("/");
  return { success: true, application };
}

export async function updateApplicationStatus(id: string, newStatus: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ACCEPTED") {
  await prisma.careerApplication.update({
    where: { id },
    data: {
      status: newStatus,
      appliedDate: newStatus === "APPLIED" ? new Date() : undefined,
    },
  });

  revalidatePath("/career");
  revalidatePath("/");
  return { success: true };
}
