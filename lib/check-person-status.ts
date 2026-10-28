import { prisma } from "@/lib/prisma";

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

    const hasAliases = person.aliases.length > 0;
    const hasPhoto = !!person.photoUrl;
    const hasBio = !!person.bio;

    if (!hasAliases) return "red";
    if (hasPhoto && hasBio) return "green";
    return "yellow";
}