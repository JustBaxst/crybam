"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";

type TaxonomyType = "genre" | "mood" | "theme";

/**
 * Создание нового элемента справочника.
 * @dontDuplicate Не писать отдельные экшены для жанров, настроений и тем.
 */
export async function createTaxonomyItem(type: TaxonomyType, name: string) {
  const cleanName = name.trim();
  if (!cleanName) return { error: "Название не может быть пустым" };

  try {
    if (type === "genre") {
      const existing = await prisma.genre.findUnique({
        where: { name: cleanName },
      });
      if (existing) {
        if (existing.deletedAt) {
          await prisma.genre.update({
            where: { id: existing.id },
            data: { deletedAt: null },
          });
        } else {
          return { error: "Такой жанр уже существует" };
        }
      } else {
        await prisma.genre.create({ data: { name: cleanName } });
      }
    } else if (type === "mood") {
      const existing = await prisma.mood.findUnique({
        where: { name: cleanName },
      });
      if (existing) {
        if (existing.deletedAt) {
          await prisma.mood.update({
            where: { id: existing.id },
            data: { deletedAt: null },
          });
        } else {
          return { error: "Такое настроение уже существует" };
        }
      } else {
        await prisma.mood.create({ data: { name: cleanName } });
      }
    } else if (type === "theme") {
      const existing = await prisma.dramaTheme.findUnique({
        where: { name: cleanName },
      });
      if (existing) {
        if (existing.deletedAt) {
          await prisma.dramaTheme.update({
            where: { id: existing.id },
            data: { deletedAt: null },
          });
        } else {
          return { error: "Такая тема уже существует" };
        }
      } else {
        await prisma.dramaTheme.create({ data: { name: cleanName } });
      }
    }

    await prisma.adminLog.create({
      data: {
        userId: CURRENT_USER_ID,
        action: `${type.toUpperCase()}_CREATED`,
        entityType: type,
        entityId: 0,
        entityName: cleanName,
        isPublic: false,
      },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/dramas");
    return { success: true };
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
