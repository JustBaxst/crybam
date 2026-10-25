import { prisma } from "@/lib/prisma";

export type DramaStatus = "green" | "yellow" | "red";

export async function getDramaStatus(dramaId: number): Promise<DramaStatus> {
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

    const hasPoster = !!drama.posterUrl;
    const hasAltTitles = drama.titles.length > 1;
    const hasGenres = drama._count.genres > 0;
    const hasCredits = drama._count.credits > 0;
    const hasSynopsis = !!drama.synopsis;

    if (!hasPoster && !hasAltTitles) return "red";
    if (hasPoster && hasGenres && hasCredits && hasSynopsis) return "green";

    return "yellow";
}