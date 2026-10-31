"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";
import { CURRENT_USER_ID } from "@/lib/current-user"; // ← Добавили для логов
import { Gender } from "@prisma/client";
import { getCharacterStatus } from "@/lib/check-character-status";
import { detectLanguage } from "@/lib/language-utils";

export async function createCharacter(formData: FormData) {
  await requireModerator();

  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Выберите дораму" };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя персонажа обязательно" };

  const str = (n: string) => String(formData.get(n) ?? "").trim() || null;
  const genderRaw = str("gender") as Gender | null;

  const character = await prisma.character.create({
    data: {
      dramaId,
      name,
      nameLower: name.toLowerCase(),
      description: str("description"),
      imageUrl: str("imageUrl"),
      gender: genderRaw,
      height: str("height"),
      age: str("age"),
      birthDate: str("birthDate"),
      occupation: str("occupation"),
    },
  });

  // Логирование создания
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "CHARACTER_CREATED",
      entityType: "character",
      entityId: character.id,
      entityName: character.name,
      isPublic: true,
    }
  });

  // Проверка: если сразу создали зелёного
  const status = await getCharacterStatus(character.id);
  if (status === "green") {
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "CHARACTER_COMPLETED",
        entityType: "character",
        entityId: character.id,
        entityName: character.name,
        isPublic: true,
      }
    });
  }

  revalidatePath("/admin/characters");
  revalidatePath(`/admin/dramas/${dramaId}`);
  redirect(`/admin/characters/${character.id}`);
}

export async function updateCharacter(formData: FormData) {
  await requireModerator();

  const characterId = Number(formData.get("characterId"));
  if (!Number.isInteger(characterId) || characterId <= 0) {
    return { error: "Неверный ID" };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя персонажа обязательно" };

  const str = (n: string) => String(formData.get(n) ?? "").trim() || null;
  const genderRaw = str("gender") as Gender | null;

  // Запоминаем статус ДО обновления
  const oldStatus = await getCharacterStatus(characterId);

  await prisma.character.update({
    where: { id: characterId },
    data: {
      name,
      nameLower: name.toLowerCase(),
      description: str("description"),
      imageUrl: str("imageUrl"),
      gender: genderRaw,
      height: str("height"),
      age: str("age"),
      birthDate: str("birthDate"),
      occupation: str("occupation"),
    },
  });

  // Логирование обновления
  await prisma.adminLog.create({
    data: {
      userId: CURRENT_USER_ID,
      action: "CHARACTER_UPDATED",
      entityType: "character",
      entityId: characterId,
      entityName: name,
      isPublic: true,
    }
  });

  // Проверка на "позеленение"
  const newStatus = await getCharacterStatus(characterId);
  if (oldStatus !== "green" && newStatus === "green") {
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "CHARACTER_COMPLETED",
        entityType: "character",
        entityId: characterId,
        entityName: name,
        isPublic: true,
      }
    });
  }

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { dramaId: true },
  });

  revalidatePath("/admin/characters");
  revalidatePath(`/admin/characters/${characterId}`);
  if (character) revalidatePath(`/admin/dramas/${character.dramaId}`);

  const fromDrama = formData.get("fromDrama");

  if (fromDrama) {
    redirect(`/admin/dramas/${fromDrama}`);
  }
  return { success: true };
}

export async function addCharacterRelation(formData: FormData) {
  await requireModerator();

  const fromId = Number(formData.get("fromId"));
  const toId = Number(formData.get("toId"));
  const relationType = String(formData.get("relationType") ?? "") as any;
  const relation = String(formData.get("relation") ?? "").trim();

  if (!fromId || !toId || fromId === toId) {
    return { error: "Выберите разных персонажей" };
  }
  if (!relation) return { error: "Укажите название связи (например, 'отец')" };

  const [fromChar, toChar] = await Promise.all([
    prisma.character.findUnique({ where: { id: fromId }, select: { dramaId: true } }),
    prisma.character.findUnique({ where: { id: toId }, select: { dramaId: true } }),
  ]);

  if (!fromChar || !toChar) return { error: "Персонаж не найден" };
  if (fromChar.dramaId !== toChar.dramaId) {
    return { error: "Нельзя связать персонажей из разных дорам" };
  }

  try {
    await prisma.characterRelation.create({
      data: { fromId, toId, relationType, relation },
    });
  } catch (e: any) {
    if (e.code === 'P2002') return { error: "Такая связь уже существует" };
    return { error: "Ошибка при сохранении" };
  }

  revalidatePath(`/admin/characters/${fromId}`);
  revalidatePath(`/admin/characters/${toId}`);
  return { success: true };
}

export async function deleteCharacterRelation(formData: FormData) {
  await requireModerator();

  const relationId = Number(formData.get("relationId"));
  const characterId = Number(formData.get("characterId"));

  if (!relationId) return { error: "Неверный ID" };

  await prisma.characterRelation.delete({ where: { id: relationId } });

  revalidatePath(`/admin/characters/${characterId}`);
  return { success: true };
}

export async function updateCharacterAliases(formData: FormData) {
  await requireModerator();

  const characterId = Number(formData.get("characterId"));
  if (!Number.isInteger(characterId) || characterId <= 0) {
    return { error: "Неверный ID" };
  }

  const aliasesRaw = String(formData.get("aliases") ?? "").trim();
  const aliasNames = aliasesRaw ? aliasesRaw.split(/\n/).map((s) => s.trim()).filter(Boolean) : [];

  // Запоминаем статус ДО (так как алиасы — критический фактор)
  const oldStatus = await getCharacterStatus(characterId);

  await prisma.$transaction(async (tx) => {
    await tx.characterAlias.deleteMany({ where: { characterId } });
    if (aliasNames.length > 0) {
      await tx.characterAlias.createMany({
        data: aliasNames.map((alias) => ({
          characterId,
          name: alias,
          nameLower: alias.toLowerCase(),
          language: detectLanguage(alias),
        })),
      });
    }
  });

  // Проверка на "позеленение"
  const newStatus = await getCharacterStatus(characterId);
  if (oldStatus !== "green" && newStatus === "green") {
    const character = await prisma.character.findUnique({ where: { id: characterId }, select: { name: true } });
    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: "CHARACTER_COMPLETED",
        entityType: "character",
        entityId: characterId,
        entityName: character?.name || "Без имени",
        isPublic: true,
      }
    });
  }

  revalidatePath(`/admin/characters/${characterId}`);
  return { success: true };
}