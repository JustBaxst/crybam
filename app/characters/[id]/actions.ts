"use server";

import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { revalidatePath } from "next/cache";

/**
 * Переключает статус персонажа в избранном.
 * @dontDuplicate Не использовать для актеров (там UserFavoriteActor).
 */
export async function toggleFavoriteCharacter(characterId: number) {
    const existing = await prisma.userFavoriteCharacter.findUnique({
        where: { userId_characterId: { userId: CURRENT_USER_ID, characterId } }
    });

    if (existing) {
        await prisma.userFavoriteCharacter.delete({
            where: { userId_characterId: { userId: CURRENT_USER_ID, characterId } }
        });
    } else {
        await prisma.userFavoriteCharacter.create({
            data: { userId: CURRENT_USER_ID, characterId }
        });
    }

    revalidatePath(`/characters/${characterId}`);
    return { success: true, isFavorite: !existing };
}