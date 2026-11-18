"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";

type TaxonomyType = "genre" | "mood" | "theme";

/**
 * Создание нового элемента справочника.
 * @dontDuplicate Не писать отдельные экшены для жанров, настроений и тем.
 */
export async function createTaxonomyItems(
  type: TaxonomyType,
  namesRaw: string,
) {
  const names = namesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (names.length === 0) return { error: "Введите хотя бы одно название" };

  let createdCount = 0;
  let restoredCount = 0;

  try {
    for (const name of names) {
      // Нормализация и валидация
      const cleanName = name[0].toUpperCase() + name.slice(1);
      if (cleanName.length < 2)
        return {
          error: `Название «${cleanName}» слишком короткое (минимум 2 символа)`,
        };
      if (cleanName.length > 50)
        return {
          error: `Название «${cleanName}» слишком длинное (максимум 50 символов)`,
        };

      let existing = null;
      if (type === "genre")
        existing = await prisma.genre.findUnique({
          where: { name: cleanName },
        });
      else if (type === "mood")
        existing = await prisma.mood.findUnique({ where: { name: cleanName } });
      else if (type === "theme")
        existing = await prisma.dramaTheme.findUnique({
          where: { name: cleanName },
        });

      if (existing) {
        if (existing.deletedAt) {
          if (type === "genre")
            await prisma.genre.update({
              where: { id: existing.id },
              data: { deletedAt: null },
            });
          else if (type === "mood")
            await prisma.mood.update({
              where: { id: existing.id },
              data: { deletedAt: null },
            });
          else if (type === "theme")
            await prisma.dramaTheme.update({
              where: { id: existing.id },
              data: { deletedAt: null },
            });
          restoredCount++;
        }
      } else {
        if (type === "genre")
          await prisma.genre.create({ data: { name: cleanName } });
        else if (type === "mood")
          await prisma.mood.create({ data: { name: cleanName } });
        else if (type === "theme")
          await prisma.dramaTheme.create({ data: { name: cleanName } });
        createdCount++;
      }
    }

    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: `${type.toUpperCase()}_CREATED_BATCH`,
        entityType: type,
        entityId: 0,
        entityName: `Создано: ${createdCount}, Восстановлено: ${restoredCount}`,
        isPublic: false,
      },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/dramas");
    return { success: true, created: createdCount, restored: restoredCount };
  } catch (e) {
    return { error: "Ошибка при создании: " + String(e) };
  }
}

/**
 * Мягкое удаление элемента.
 */
export async function deleteTaxonomyItem(type: TaxonomyType, id: number) {
  try {
    const now = new Date();
    let entityName = "";

    if (type === "genre") {
      const item = await prisma.genre.findUnique({ where: { id } });
      entityName = item?.name || "Жанр";
      await prisma.genre.update({ where: { id }, data: { deletedAt: now } });
    } else if (type === "mood") {
      const item = await prisma.mood.findUnique({ where: { id } });
      entityName = item?.name || "Настроение";
      await prisma.mood.update({ where: { id }, data: { deletedAt: now } });
    } else if (type === "theme") {
      const item = await prisma.dramaTheme.findUnique({ where: { id } });
      entityName = item?.name || "Тема";
      await prisma.dramaTheme.update({
        where: { id },
        data: { deletedAt: now },
      });
    }

    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: `${type.toUpperCase()}_DELETED`,
        entityType: type,
        entityId: id,
        entityName: entityName,
        isPublic: false,
      },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/dramas");
    return { success: true };
  } catch (e) {
    return { error: "Ошибка при удалении: " + String(e) };
  }
}

/**
 * Обновление названия элемента справочника.
 */
export async function updateTaxonomyItem(
  type: TaxonomyType,
  id: number,
  newName: string,
) {
  const cleanName = newName.trim();
  if (!cleanName) return { error: "Название не может быть пустым" };
  if (cleanName.length < 2)
    return { error: "Название должно быть не короче 2 символов" };
  if (cleanName.length > 50)
    return { error: "Название должно быть не длиннее 50 символов" };

  try {
    let existing = null;
    if (type === "genre")
      existing = await prisma.genre.findUnique({ where: { name: cleanName } });
    else if (type === "mood")
      existing = await prisma.mood.findUnique({ where: { name: cleanName } });
    else if (type === "theme")
      existing = await prisma.dramaTheme.findUnique({
        where: { name: cleanName },
      });

    if (existing && existing.id !== id) {
      return { error: "Элемент с таким названием уже существует" };
    }

    if (type === "genre") {
      await prisma.genre.update({ where: { id }, data: { name: cleanName } });
    } else if (type === "mood") {
      await prisma.mood.update({ where: { id }, data: { name: cleanName } });
    } else if (type === "theme") {
      await prisma.dramaTheme.update({
        where: { id },
        data: { name: cleanName },
      });
    }

    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: `${type.toUpperCase()}_UPDATED`,
        entityType: type,
        entityId: id,
        entityName: cleanName,
        isPublic: false,
      },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/dramas");
    return { success: true };
  } catch (e) {
    return { error: "Ошибка при обновлении: " + String(e) };
  }
}
