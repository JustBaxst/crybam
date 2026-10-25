"use server";

import { getCurrentUser } from "@/lib/auth";
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

export async function fixRandomDrama(): Promise<{ dramaId?: number; error?: string }> {
  await requireModerator();

  // Получаем все драмы с минимальными полями для проверки статуса
  const dramas = await prisma.drama.findMany({
    select: {
      id: true,
      title: true,
      posterUrl: true,
      synopsis: true,
      titles: { select: { id: true } },
      _count: { select: { genres: true, credits: true } },
    },
  });

  if (dramas.length === 0) {
    return { error: "В базе нет дорам" };
  }

  // Считаем статус в памяти (копия логики getDramaStatus)
  const dramasWithStatus = dramas.map((d) => {
    const hasPoster = !!d.posterUrl;
    const hasAltTitles = d.titles.length > 1;
    const hasGenres = d._count.genres > 0;
    const hasCredits = d._count.credits > 0;
    const hasSynopsis = !!d.synopsis;

    let status: "green" | "yellow" | "red";
    if (!hasPoster && !hasAltTitles) status = "red";
    else if (hasPoster && hasGenres && hasCredits && hasSynopsis) status = "green";
    else status = "yellow";

    return { id: d.id, title: d.title, status };
  });

  // Фильтруем только 🟡 и 🔴
  const incomplete = dramasWithStatus.filter((d) => d.status !== "green");

  if (incomplete.length === 0) {
    return { error: "Все драмы уже 🟢 Готово!" };
  }

  // Случайная неполная драма
  const random = incomplete[Math.floor(Math.random() * incomplete.length)];

  return { dramaId: random.id };
}

export async function getAdminOverviewData() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  const dramas = await prisma.drama.findMany({
    select: {
      id: true,
      posterUrl: true,
      synopsis: true,
      titles: { select: { id: true } },
      _count: { select: { genres: true, credits: true } },
    },
  });

  let green = 0, yellow = 0, red = 0;
  for (const d of dramas) {
    const hasPoster = !!d.posterUrl;
    const hasAltTitles = d.titles.length > 1;
    const hasGenres = d._count.genres > 0;
    const hasCredits = d._count.credits > 0;
    const hasSynopsis = !!d.synopsis;

    if (!hasPoster && !hasAltTitles) red++;
    else if (hasPoster && hasGenres && hasCredits && hasSynopsis) green++;
    else yellow++;
  }

  const total = dramas.length;
  const progress = total > 0 ? Math.round((green / total) * 100) : 0;

  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const logs = await prisma.adminLog.findMany({
    where: { createdAt: { gte: yearAgo }, isPublic: true },
    select: { createdAt: true, userId: true, user: { select: { name: true } }, action: true, entityName: true },
    orderBy: { createdAt: "asc" },
  });

  // Группируем по датам для Heatmap
  const activityMap = new Map<string, { count: number; actions: string[]; userIds: number[] }>();
  for (const log of logs) {
    const dateKey = log.createdAt.toISOString().slice(0, 10);
    const existing = activityMap.get(dateKey);
    if (existing) {
      existing.count++;
      existing.actions.push(log.action);
      existing.userIds.push(log.userId);
    } else {
      activityMap.set(dateKey, { count: 1, actions: [log.action], userIds: [log.userId] });
    }
  }


  const heatmapActivities = Array.from(activityMap.entries()).map(([date, data]) => ({
    date,
    level: Math.min(Math.ceil(data.count / 2), 4),
    episodes: data.count,
    dramaTitle: data.actions.join(", "),
    userIds: data.userIds, // ← Добавили ID юзеров
  }));

  const [persons, characters, genres, nominations] = await Promise.all([
    prisma.person.count(),
    prisma.character.count(),
    prisma.genre.count(),
    prisma.nomination.count(),
  ]);

  return {
    user,
    stats: { total, green, yellow, red, progress, persons, characters, genres, nominations },
    heatmapActivities,
  };
}