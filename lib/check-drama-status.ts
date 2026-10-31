import { prisma } from "@/lib/prisma";
import { getDramaStatusLevel } from "@/lib/status-utils";

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

    return getDramaStatusLevel({
        hasAltTitles: drama.titles.length > 1,
        hasPoster: !!drama.posterUrl,
        hasGenres: drama._count.genres > 0,
        hasCredits: drama._count.credits > 0,
        hasSynopsis: !!drama.synopsis,
    });
}