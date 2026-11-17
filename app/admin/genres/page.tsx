import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { TagsClientPage } from "./TagsClientPage";

export default async function AdminGenresPage() {
  // Запрашиваем все три сущности, скрывая удаленные
  const genres = await prisma.genre.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { dramas: true } } },
  });

  const moods = await prisma.mood.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { dramas: true } } },
  });

  const themes = await prisma.dramaTheme.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { dramas: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <AdminBreadcrumbs items={[{ label: "Жанры и теги" }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Справочники</h1>
        <p className="text-sm text-muted mt-1">
          Управление трехслойной системой тегов: жанры, настроения и темы.
        </p>
      </div>

      <TagsClientPage genres={genres} moods={moods} themes={themes} />
    </div>
  );
}
