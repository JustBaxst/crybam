"use server";

import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteActor(personId: number) {
    // Проверяем, есть ли уже в избранном
    const existing = await prisma.userFavoriteActor.findUnique({
        where: {
            userId_personId: { userId: CURRENT_USER_ID, personId }
        }
    });

    if (existing) {
        // Если есть — удаляем
        await prisma.userFavoriteActor.delete({
            where: { userId_personId: { userId: CURRENT_USER_ID, personId } }
        });
    } else {
        // Если нет — добавляем
        await prisma.userFavoriteActor.create({
            data: { userId: CURRENT_USER_ID, personId }
        });
    }

    // Обновляем кэш страницы
    revalidatePath(`/people/${personId}`);
    revalidatePath("/me"); // или путь к странице любимых актеров

    return { success: true, isFavorite: !existing };
}