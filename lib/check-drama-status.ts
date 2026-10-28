import { prisma } from "@/lib/prisma";

export type DramaStatus = "green" | "yellow" | "red";

export async function getDramaStatus(dramaId: number): Promise<"green" | "yellow" | "red"> {
    const drama = await prisma.drama.findUnique({
        where: { id: dramaId },
        select: {
            posterUrl: true,
            synopsis: true,
            titles: { select: { id: true } },
            _count: { select: { genres: true, credits: true } }
        }
    });
    if (!drama) return "red";

    const hasAltTitles = drama.titles.length > 1; // 1 - это основное название
    const hasPoster = !!drama.posterUrl;
    const hasGenres = drama._count.genres > 0;
    const hasCredits = drama._count.credits > 0;
    const hasSynopsis = !!drama.synopsis;

    // 🔴 Красный: нет альтернативных названий
    if (!hasAltTitles) return "red";

    // 🟢 Зеленый: есть альт. названия + всё остальное
    if (hasPoster && hasGenres && hasCredits && hasSynopsis) return "green";

    // 🟡 Желтый: есть альт. названия, но чего-то не хватает
    return "yellow";
}