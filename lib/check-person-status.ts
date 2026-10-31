import { prisma } from "@/lib/prisma";
import { getPersonStatusLevel } from "@/lib/status-utils";

export async function getPersonStatus(personId: number): Promise<"green" | "yellow" | "red"> {
    const person = await prisma.person.findUnique({
        where: { id: personId },
        select: {
            photoUrl: true,
            bio: true,
            aliases: { select: { id: true } }
        }
    });
    if (!person) return "red";

    return getPersonStatusLevel({
        hasAliases: person.aliases.length > 0,
        hasPhoto: !!person.photoUrl,
        hasBio: !!person.bio,
    });
}