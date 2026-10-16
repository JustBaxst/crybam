import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const dramas = await prisma.drama.findMany({
    where: {
  OR: [
    { titleLower: { contains: query.toLowerCase() } },
    {
      titles: {
        some: { titleLower: { contains: query.toLowerCase() } },
      },
    },
  ],
},
    select: {
      id: true,
      title: true,
      year: true,
      country: true,
      posterUrl: true,
      ratingKinopoisk: true,
      ratingIMDB: true,
    },
    orderBy: [{ year: "desc" }, { title: "asc" }],
    take: 8,
  });

  return NextResponse.json({
    results: dramas.map((d) => ({
      id: d.id,
      title: d.title,
      year: d.year,
      country: d.country,
      posterUrl: d.posterUrl,
      rating: d.ratingKinopoisk ?? d.ratingIMDB ?? null,
    })),
  });
}