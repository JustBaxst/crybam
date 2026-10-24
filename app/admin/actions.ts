"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeTitle } from "@/lib/drama-utils";
import { requireModerator } from "@/lib/auth";

export async function createDrama(
  formData: FormData
): Promise<{ error?: string; existingId?: number } | undefined> {
  await requireModerator();

  const str = (name: string) =>
    String(formData.get(name) ?? "").trim() || null;
  const num = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    if (raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };
  const float = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    if (raw === "") return null;
    const n = Number(raw.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };
  const date = (name: string) => {
    const raw = String(formData.get(name) ?? "").trim();
    return raw ? new Date(raw) : null;
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
      error: `Точный дубль: «${exactDuplicate.title}» (${[exactDuplicate.year, exactDuplicate.country].filter(Boolean).join(", ") || "год/страна не указаны"
        }) уже есть в базе.`,
      existingId: Number(exactDuplicate.id),
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

      // Новые поля:
      synopsis: str("synopsis"),
      posterUrl: str("posterUrl"),
      airedFrom: date("airedFrom"),
      airedTo: date("airedTo"),
      ratingKinopoisk: float("ratingKinopoisk"),
      ratingMDL: float("ratingMDL"),
      ratingIMDB: float("ratingIMDB"),
      ratingDouban: float("ratingDouban"),
      dubbingStudios: str("dubbingStudios"),
      airStatus: str("airStatus") || "released",
      curatorCryTag: str("curatorCryTag"),
    },
  });

  // Платформы                                                      
  const platformsRaw = String(formData.get("platforms") ?? "").trim();
  if (platformsRaw) {
    const names = platformsRaw.split(",").map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const platform = await prisma.platform.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      await prisma.dramaPlatform.create({
        data: { dramaId: drama.id, platformId: platform.id },
      });
    }
  }

  // Студии                                                         
  const studiosRaw = String(formData.get("studios") ?? "").trim();
  if (studiosRaw) {
    const names = studiosRaw.split(",").map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const studio = await prisma.studio.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      await prisma.dramaStudio.create({
        data: { dramaId: drama.id, studioId: studio.id },
      });
    }
  }

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