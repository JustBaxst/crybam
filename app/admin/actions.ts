"use server";

import { getCurrentUser, requireModerator } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeTitle } from "@/lib/drama-utils";
import { CURRENT_USER_ID } from "@/lib/current-user"; // ← Добавили для логов

export async function createDrama(
  formData: FormData
): Promise<{ error?: string; existingId?: number } | undefined> {
  await requireModerator();

  const str = (name: string) => String(formData.get(name) ?? "").trim() || null;
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
  if (!title) return { error: "Название обязательно" };

  const year = num("year");
  const country = str("country");
  const normalizedTitle = normalizeTitle(title);

  const exactDuplicate = await prisma.drama.findFirst({
    where: {
      titleLower: normalizedTitle,
      deletedAt: null, // ← Проверяем только среди неудаленных
      ...(year ? { year } : {}),
      ...(country ? { country } : {}),
    },
  });

  if (exactDuplicate) {
    return {
      error: `Точный дубль: «${exactDuplicate.title}» (${[exactDuplicate.year, exactDuplicate.country].filter(Boolean).join(", ") || "год/страна не указаны"}) уже есть в базе.`,
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

  // Логирование создания
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "DRAMA_CREATED",
      entityType: "drama",
      entityId: drama.id,
      entityName: drama.title,
      isPublic: true,
    }
  });

  // Платформы и студии...
  const platformsRaw = String(formData.get("platforms") ?? "").trim();
  if (platformsRaw) {
    const names = platformsRaw.split(",").map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const platform = await prisma.platform.upsert({ where: { name }, update: {}, create: { name } });
      await prisma.dramaPlatform.create({ data: { dramaId: drama.id, platformId: platform.id } });
    }
  }

  const studiosRaw = String(formData.get("studios") ?? "").trim();
  if (studiosRaw) {
    const names = studiosRaw.split(",").map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const studio = await prisma.studio.upsert({ where: { name }, update: {}, create: { name } });
      await prisma.dramaStudio.create({ data: { dramaId: drama.id, studioId: studio.id } });
    }
  }

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");
  redirect(`/admin/dramas/${drama.id}`);
}

export async function deleteDrama(formData: FormData) {
  await requireModerator();
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) return { error: "Неверный ID" };

  const drama = await prisma.drama.findUnique({ where: { id: dramaId }, select: { title: true } });
  if (!drama) return { error: "Дорама не найдена" };

  // Мягкое удаление
  await prisma.drama.update({
    where: { id: dramaId },
    data: { deletedAt: new Date() }
  });

  // Логирование
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "DRAMA_DELETED",
      entityType: "drama",
      entityId: dramaId,
      entityName: drama.title,
      isPublic: true,
    }
  });

  revalidatePath("/admin/dramas");
  revalidatePath("/dramas");
  revalidatePath("/library");
}

export async function fixRandomDrama(): Promise<{ dramaId?: number; error?: string }> {
  await requireModerator();

  const dramas = await prisma.drama.findMany({
    where: { deletedAt: null }, // ← Только активные
    select: {
      id: true, title: true, posterUrl: true, synopsis: true,
      titles: { select: { id: true } },
      _count: { select: { genres: true, credits: true } },
    },
  });

  if (dramas.length === 0) return { error: "В базе нет дорам" };

  const dramasWithStatus = dramas.map((d) => {
    const hasPoster = !!d.posterUrl;
    const hasAltTitles = d.titles.length > 1;
    const hasGenres = d._count.genres > 0;
    const hasCredits = d._count.credits > 0;
    const hasSynopsis = !!d.synopsis;

    let status: "green" | "yellow" | "red";
    // Новая строгая логика: нет альт. названий = красный
    if (!hasAltTitles) status = "red";
    else if (hasPoster && hasGenres && hasCredits && hasSynopsis) status = "green";
    else status = "yellow";

    return { id: d.id, title: d.title, status };
  });

  const incomplete = dramasWithStatus.filter((d) => d.status !== "green");
  if (incomplete.length === 0) return { error: "Все драмы уже 🟢 Готово!" };

  const random = incomplete[Math.floor(Math.random() * incomplete.length)];
  return { dramaId: random.id };
}

export async function getAdminOverviewData() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) return null;

  // 1. Статистика БД (только активные)
  const dramas = await prisma.drama.findMany({
    where: { deletedAt: null },
    select: {
      id: true, posterUrl: true, synopsis: true,
      titles: { select: { id: true } },
      _count: { select: { genres: true, credits: true } },
    },
  });

  let dGreen = 0, dYellow = 0, dRed = 0;
  for (const d of dramas) {
    const hasPoster = !!d.posterUrl;
    const hasAltTitles = d.titles.length > 1;
    const hasGenres = d._count.genres > 0;
    const hasCredits = d._count.credits > 0;
    const hasSynopsis = !!d.synopsis;

    if (!hasAltTitles) dRed++;
    else if (hasPoster && hasGenres && hasCredits && hasSynopsis) dGreen++;
    else dYellow++;
  }

  const persons = await prisma.person.findMany({
    where: { deletedAt: null },
    select: { id: true, photoUrl: true, bio: true, aliases: { select: { id: true } } },
  });
  let pGreen = 0, pYellow = 0, pRed = 0;
  for (const p of persons) {
    const hasPhoto = !!p.photoUrl;
    const hasAliases = p.aliases.length > 0;
    const hasBio = !!p.bio;

    if (!hasAliases) pRed++;
    else if (hasPhoto && hasBio) pGreen++;
    else pYellow++;
  }

  const characters = await prisma.character.findMany({
    where: { deletedAt: null },
    select: { id: true, imageUrl: true, description: true, aliases: { select: { id: true } } },
  });
  let cGreen = 0, cYellow = 0, cRed = 0;
  for (const c of characters) {
    const hasImage = !!c.imageUrl;
    const hasAliases = c.aliases.length > 0;
    const hasDescription = !!c.description;

    if (!hasAliases) cRed++;
    else if (hasImage && hasDescription) cGreen++;
    else cYellow++;
  }

  const total = dramas.length;
  const progress = total > 0 ? Math.round((dGreen / total) * 100) : 0;

  // 2. Логи
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const logs = await prisma.adminLog.findMany({
    where: { createdAt: { gte: yearAgo }, isPublic: true },
    select: { createdAt: true, userId: true, user: { select: { name: true } }, action: true, entityName: true },
    orderBy: { createdAt: "asc" },
  });

  const activityMap = new Map<string, {
    count: number;
    events: { userName: string; action: string; entityName: string; userId: number }[];
    userIds: number[];
  }>();

  for (const log of logs) {
    const dateKey = log.createdAt.toLocaleDateString("sv-SE");
    const existing = activityMap.get(dateKey);
    const event = {
      userName: log.user.name,
      action: log.action,
      entityName: log.entityName,
      userId: log.userId,
    };

    if (existing) {
      existing.count++;
      existing.events.push(event);
      existing.userIds.push(log.userId);
    } else {
      activityMap.set(dateKey, { count: 1, events: [event], userIds: [log.userId] });
    }
  }

  const heatmapActivities = Array.from(activityMap.entries()).map(([date, data]) => ({
    date,
    level: Math.min(Math.ceil(data.count / 2), 4),
    episodes: data.count,
    events: data.events, // ← Передаем массив событий вместо строки
    userIds: data.userIds,
  }));

  // Ищем победу среди всех типов
  const lastVictory = await prisma.adminLog.findFirst({
    where: { action: { in: ["DRAMA_COMPLETED", "PERSON_COMPLETED", "CHARACTER_COMPLETED"] } },
    orderBy: { createdAt: "desc" },
    select: { entityName: true, createdAt: true, user: { select: { name: true } } },
  });

  const recentLogs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  const [genresCount, nominationsCount] = await Promise.all([
    prisma.genre.count(),
    prisma.nomination.count(),
  ]);

  return {
    user,
    stats: {
      dramas: { total, green: dGreen, yellow: dYellow, red: dRed, progress },
      persons: { total: persons.length, green: pGreen, yellow: pYellow, red: pRed },
      characters: { total: characters.length, green: cGreen, yellow: cYellow, red: cRed },
      genres: genresCount, nominations: nominationsCount,
    },
    heatmapActivities, lastVictory, recentLogs,
  };
}

// ... (функция checkApiStatus остается без изменений)

export async function checkApiStatus(): Promise<ServiceStatus[]> {
  const checkUrl = async (url: string, method: string = "HEAD") => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Ждем максимум 3 сек

      // Запрос к сервису
      const res = await fetch(url, { method, signal: controller.signal });
      clearTimeout(timeoutId);

      return res.ok; // true, если статус 200-299
    } catch {
      return false; // false, если таймаут или ошибка сети
    }
  };

  // Запускаем проверки параллельно
  const [tvmaze, youtube, spotify, yandex] = await Promise.all([
    // TVmaze: ping-эндпоинта нет, поэтому делаем HEAD на главную
    checkUrl("https://api.tvmaze.com/shows/1"),
    checkUrl("https://www.youtube.com"),
    checkUrl("https://open.spotify.com"),
    checkUrl("https://music.yandex.ru"),
  ]);

  return [
    { name: "TVmaze", isOnline: tvmaze },
    { name: "YouTube", isOnline: youtube },
    { name: "Spotify", isOnline: spotify },
    { name: "Яндекс.Музыка", isOnline: yandex },
  ];
}
export type ServiceStatus = {
  name: string;
  isOnline: boolean;
};