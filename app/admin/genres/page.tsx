import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { GenresPageContent } from "./GenresPageContent";

type SearchParams = Promise<{ q?: string; filter?: string }>;

export default async function AdminGenresPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();

  const searchCondition = query ? { name: { contains: query } } : {};

  // Запрашиваем все три сущности сразу с учетом поиска
  const genres = await prisma.genre.findMany({
    where: { deletedAt: null, ...searchCondition },
    orderBy: { name: "asc" },
    include: {
      dramas: { select: { drama: { select: { id: true, title: true } } } },
    },
  });

  const moods = await prisma.mood.findMany({
    where: { deletedAt: null, ...searchCondition },
    orderBy: { name: "asc" },
    include: {
      dramas: { select: { drama: { select: { id: true, title: true } } } },
    },
  });

  const themes = await prisma.dramaTheme.findMany({
    where: { deletedAt: null, ...searchCondition },
    orderBy: { name: "asc" },
    include: {
      dramas: { select: { drama: { select: { id: true, title: true } } } },
    },
  });

  const totalCount = genres.length + moods.length + themes.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      <AdminBreadcrumbs items={[{ label: "Справочники" }]} />

      <GenresPageContent
        genres={genres}
        moods={moods}
        themes={themes}
        totalCount={totalCount}
        currentFilter={filter || ""}
      />
    </div>
  );
}
