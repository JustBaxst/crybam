"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";

export async function updateEntry(formData: FormData) {
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID дорамы" };
  }

  const status = String(formData.get("status") ?? "planned");
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const cryTag = String(formData.get("cryTag") ?? "").trim() || null;
  const impression = String(formData.get("impression") ?? "").trim() || null;
  const review = String(formData.get("review") ?? "").trim() || null;
  const quote = String(formData.get("quote") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const progressRaw = String(formData.get("progress") ?? "").trim();
  const rewatchRaw = String(formData.get("rewatchCount") ?? "").trim();
  const startedAtRaw = String(formData.get("startedAt") ?? "").trim();
  const watchedAtRaw = String(formData.get("watchedAt") ?? "").trim();

  const rating = ratingRaw === "" ? null : Number(ratingRaw);
  const progress = progressRaw === "" ? null : Number(progressRaw);
  const rewatchCount = rewatchRaw === "" ? 0 : Number(rewatchRaw);

  const startedAt = startedAtRaw ? new Date(startedAtRaw) : null;
  const watchedAt = watchedAtRaw ? new Date(watchedAtRaw) : null;

  const existing = await prisma.userDramaEntry.findFirst({
    where: { userId: CURRENT_USER_ID, dramaId },
  });

  const data = {
    status,
    rating,
    cryTag,
    impression,
    review,
    quote,
    notes,
    progress,
    rewatchCount,
    startedAt,
    watchedAt,
  };

  if (existing) {
    await prisma.userDramaEntry.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.userDramaEntry.create({
      data: { userId: CURRENT_USER_ID, dramaId, ...data },
    });
  }

  revalidatePath(`/dramas/${dramaId}`);
  revalidatePath("/library");
  revalidatePath("/");

  return { success: true };

  
}

export async function updateDrama(formData: FormData) {
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID дорамы" };
  }

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

  try {
    await prisma.drama.update({
      where: { id: dramaId },
      data: {
        title,
        year: num("year"),
        country: str("country"),
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
      },
    });
  } catch (e) {
    return { error: "Не удалось сохранить: " + String(e) };
  }

  revalidatePath(`/dramas/${dramaId}`);
  revalidatePath("/library");
  revalidatePath("/");
  return { success: true };
}

export async function updateGenres(formData: FormData) {
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID дорамы" };
  }

  // Существующие жанры: массив ID, пришедших как "genre_123"
  const existingIds: number[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("genre_") && value === "on") {
      const id = Number(key.replace("genre_", ""));
      if (Number.isInteger(id)) existingIds.push(id);
    }
  }

  // Новые жанры: одна строка через запятую
  const newGenresRaw = String(formData.get("newGenres") ?? "").trim();
  const newGenreNames = newGenresRaw
    ? newGenresRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Находим или создаём новые жанры
  const newGenreIds: number[] = [];
  for (const name of newGenreNames) {
    const normalized = name[0].toUpperCase() + name.slice(1);
    const g = await prisma.genre.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });
    newGenreIds.push(g.id);
  }

  const allGenreIds = Array.from(new Set([...existingIds, ...newGenreIds]));

  // Пересоздаём связи: удаляем старые, создаём новые
  await prisma.dramaGenre.deleteMany({ where: { dramaId } });

  if (allGenreIds.length > 0) {
    await prisma.dramaGenre.createMany({
      data: allGenreIds.map((genreId) => ({ dramaId, genreId })),
    });
  }

  revalidatePath(`/dramas/${dramaId}`);
  revalidatePath("/library");
  return { success: true };
}

export async function addCredit(formData: FormData) {
  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Неверный ID дорамы" };
  }

  const personName = String(formData.get("personName") ?? "").trim();
  if (!personName) return { error: "Имя актёра обязательно" };

  const roleType = String(formData.get("roleType") ?? "actor");
  const importanceRaw = String(formData.get("importance") ?? "support");
const importance = ["lead", "support", "guest"].includes(importanceRaw)
  ? importanceRaw
  : "support";
  const characterName = String(formData.get("characterName") ?? "").trim() || null;
  const characterDescription =
    String(formData.get("characterDescription") ?? "").trim() || null;
  const orderRaw = String(formData.get("order") ?? "").trim();
  const order = orderRaw === "" ? null : Number(orderRaw);
  const note = String(formData.get("note") ?? "").trim() || null;

  // Ищем или создаём Person
  let person = await prisma.person.findFirst({ where: { name: personName } });
  if (!person) {
    person = await prisma.person.create({ data: { name: personName } });
  }

  // Если actor с персонажем — ищем или создаём Character
  let characterId: number | null = null;

if (roleType === "actor") {
  // Определяем имя персонажа: явное или сгенерированное из описания
  let finalName = characterName;
  if (!finalName && characterDescription) {
    // Берём первые 4 слова из описания как имя
    finalName = characterDescription
      .split(/\s+/)
      .slice(0, 4)
      .join(" ")
      .slice(0, 40)
      .trim();
  }

  if (finalName) {
    const existing = await prisma.character.findFirst({
      where: { dramaId, name: finalName },
    });

    if (existing) {
      characterId = existing.id;
      if (characterDescription && !existing.description) {
        await prisma.character.update({
          where: { id: existing.id },
          data: { description: characterDescription },
        });
      }
    } else {
      const newChar = await prisma.character.create({
        data: {
          dramaId,
          name: finalName,
          description: characterDescription,
        },
      });
      characterId = newChar.id;
    }
  }
}

  // Проверяем, нет ли уже такого Credit
  const existingCredit = await prisma.credit.findFirst({
    where: { personId: person.id, dramaId, roleType },
  });

  if (existingCredit) {
    return { error: "Этот человек уже добавлен в этой роли" };
  }

  await prisma.credit.create({
  data: {
    personId: person.id,
    dramaId,
    roleType,
    importance,
    characterId,
    order,
    note,
  },
});

  revalidatePath(`/dramas/${dramaId}`);
  return { success: true };
}

export async function removeCredit(formData: FormData) {
  const creditId = Number(formData.get("creditId"));
  const dramaId = Number(formData.get("dramaId"));

  if (!Number.isInteger(creditId) || creditId <= 0) {
    return { error: "Неверный ID" };
  }

  // 1. Находим кредит, чтобы узнать personId и characterId
  const credit = await prisma.credit.findUnique({
    where: { id: creditId },
    select: { personId: true, characterId: true },
  });

  if (!credit) return { error: "Кредит не найден" };

  // 2. Удаляем кредит
  await prisma.credit.delete({ where: { id: creditId } });

  // 3. Если у персонажа больше нет кредитов — удаляем и его
  if (credit.characterId) {
    const remainingCharCredits = await prisma.credit.count({
      where: { characterId: credit.characterId },
    });
    if (remainingCharCredits === 0) {
      await prisma.character.delete({ where: { id: credit.characterId } });
    }
  }

  // 4. Если у человека больше нет кредитов — удаляем его
  const remainingPersonCredits = await prisma.credit.count({
    where: { personId: credit.personId },
  });
  if (remainingPersonCredits === 0) {
    await prisma.person.delete({ where: { id: credit.personId } });
  }

  revalidatePath(`/dramas/${dramaId}`);
  return { success: true };
}

export async function updateCredit(formData: FormData) {
  const creditId = Number(formData.get("creditId"));
  const dramaId = Number(formData.get("dramaId"));

  if (!Number.isInteger(creditId) || creditId <= 0) {
    return { error: "Неверный ID" };
  }

  const importanceRaw = String(formData.get("importance") ?? "support");
  const importance = ["lead", "support", "guest"].includes(importanceRaw)
    ? importanceRaw
    : "support";

  const characterDescription =
    String(formData.get("characterDescription") ?? "").trim() || null;

  // Обновляем важность в Credit
  const credit = await prisma.credit.update({
    where: { id: creditId },
    data: { importance },
    include: { character: true },
  });

  // Если есть персонаж и передано описание — обновляем его
  if (credit.characterId && characterDescription !== null) {
    await prisma.character.update({
      where: { id: credit.characterId },
      data: { description: characterDescription },
    });
  }

  revalidatePath(`/dramas/${dramaId}`);
  return { success: true };
}