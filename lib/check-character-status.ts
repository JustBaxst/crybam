import { prisma } from "@/lib/prisma";
import { getCharacterStatusLevel } from "@/lib/status-utils";

export async function getCharacterStatus(characterId: number): Promise<"green" | "yellow" | "red"> {
    const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: {
            imageUrl: true,
            description: true,
            aliases: { select: { id: true } }
        }
    });
    if (!character) return "red";

    return getCharacterStatusLevel({
        hasAliases: character.aliases.length > 0,
        hasImage: !!character.imageUrl,
        hasDescription: !!character.description,
    });
}