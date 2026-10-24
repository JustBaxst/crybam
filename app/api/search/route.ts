import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDramaSearchWhere,
  getPersonSearchWhere,
  getCharacterSearchWhere
} from "@/lib/search-queries";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ dramas: [], people: [], characters: [] });
  }

  // Ищем параллельно во всех трех таблицах, используя наше новое ядро
  const [dramas, people, characters] = await Promise.all([
    prisma.drama.findMany({
      where: getDramaSearchWhere(query),
      select: {
        id: true,
        title: true,
        year: true,
        country: true,
        posterUrl: true,
        ratingKinopoisk: true,
        ratingIMDB: true
      },
      orderBy: [{ year: "desc" }, { title: "asc" }],
      take: 8,
    }),
    prisma.person.findMany({
      where: getPersonSearchWhere(query),
      select: { id: true, name: true, photoUrl: true },
      take: 5,
    }),
    prisma.character.findMany({
      where: getCharacterSearchWhere(query),
      select: {
        id: true,
        name: true,
        imageUrl: true,
        drama: { select: { id: true, title: true } }
      },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    dramas: dramas.map((d) => ({
      ...d,
      rating: d.ratingKinopoisk ?? d.ratingIMDB ?? null,
    })),
    people,
    characters
  });
}