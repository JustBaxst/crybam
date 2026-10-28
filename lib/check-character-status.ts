import { prisma } from "@/lib/prisma";

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

    const hasAliases = character.aliases.length > 0;
    const hasImage = !!character.imageUrl;
    const hasDescription = !!character.description;

    if (!hasAliases) return "red";
    if (hasImage && hasDescription) return "green";
    return "yellow";
}