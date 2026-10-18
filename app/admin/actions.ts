"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeTitle } from "@/lib/drama-utils";
import { requireModerator } from "@/lib/auth";

export async function createDrama(formData: FormData) {
  await requireModerator();
  const str = (name: string) =>
    String(formData.get(name) ?? "").trim() || null;
  const num = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const title = str("title");
  if (!title) {
    return { error: "Название обязательно" };
  }

  const year = num("year");
  const country = str("country");
  const normalizedTitle = normalizeTitle(title);

  // Жёсткая проверка: название + год + страна
  const exactDuplicate = await prisma.drama.findFirst({
    where: {
      titleLower: normalizedTitle,
      ...(year ? { year } : {}),
      ...(country ? { country } : {}),
    },
  });

  if (exactDuplicate) {
    return {
      error: `Точный дубль: «${exactDuplicate.title}» (${
        [exactDuplicate.year, exactDuplicate.country].filter(Boolean).join(", ") || "год/страна не указаны"
      }) уже есть в базе.`,
      existingId: exactDuplicate.id,
    };
  }

  const drama = await prisma.drama.create({
    data: {
      title,
      titleLower: normalizedTitle,
      year,
      country,
      episodes: num("episodes"),
      seasons: num("seasons"),
      episodeDuration: num("episodeDuration"),
    },
  });

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");

  redirect(`/admin/dramas/${drama.id}`);
}

export async function deleteDrama(formData: FormData) {
  await requireModerator();
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID" };
  }

  await prisma.drama.delete({ where: { id: dramaId } });

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");
  revalidatePath("/library");
}