"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/auth";

export async function createCharacter(formData: FormData) {
  await requireModerator();

  const dramaId = Number(formData.get("dramaId"));
  if (!Number.isInteger(dramaId) || dramaId <= 0) {
    return { error: "Выберите дораму" };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Имя персонажа обязательно" };

  const character = await prisma.character.create({
    data: {
      dramaId,
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    },
  });

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

  await prisma.character.update({
    where: { id: characterId },
    data: {
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      imageUrl: String(formData.get("imageUrl") ?? "").trim() || null,
    },
  });

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { dramaId: true },
  });

  revalidatePath("/admin/characters");
  revalidatePath(`/admin/characters/${characterId}`);
  if (character) revalidatePath(`/admin/dramas/${character.dramaId}`);
  return { success: true };
}

export async function deleteCharacter(formData: FormData) {
  await requireModerator();

  const characterId = Number(formData.get("characterId"));
  if (!Number.isInteger(characterId) || characterId <= 0) {
    return { error: "Неверный ID" };
  }

  const creditsCount = await prisma.credit.count({
    where: { characterId },
  });

  if (creditsCount > 0) {
    return {
      error: `Нельзя удалить: персонаж привязан к ${creditsCount} ролям. Сначала удалите его из дорам.`,
    };
  }

  await prisma.character.delete({ where: { id: characterId } });
  revalidatePath("/admin/characters");
  redirect("/admin/characters");
}