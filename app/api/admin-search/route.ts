import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ dramas: [], people: [], characters: [] });
  }

  // Ищем параллельно во всех трех таблицах, чтобы было быстро
  const [dramas, people, characters] = await Promise.all([
    prisma.drama.findMany({
      where: {
        OR: [
          { titleLower: { contains: query } },
          { titles: { some: { titleLower: { contains: query } } } },
        ],
      },
      select: { id: true, title: true, year: true },
      take: 5,
    }),
    prisma.person.findMany({
      where: {
        OR: [
          { nameLower: { contains: query } },
          { aliases: { some: { nameLower: { contains: query } } } },
        ],
      },
      select: { id: true, name: true },
      take: 5,
    }),
    prisma.character.findMany({
      where: { nameLower: { contains: query } },
      select: { id: true, name: true, drama: { select: { title: true } } },
      take: 5,
    }),
  ]);

  return NextResponse.json({ dramas, people, characters });
}