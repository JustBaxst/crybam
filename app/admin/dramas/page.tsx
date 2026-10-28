import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getDramaSearchWhere } from "@/lib/search-queries";
import { MetricsIcons } from "@/components/admin/MetricsIcons";
import { StatusDot } from "@/components/admin/StatusDot";
import { AliasBadge } from "@/components/admin/AliasBadge";
import { DramaActions } from "./DramaActions";

type SearchParams = Promise<{ q?: string; filter?: string }>;

export default async function AdminDramasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();
  const currentFilter = filter || "";

  const searchCondition = getDramaSearchWhere(query);

  const filterCondition =
    currentFilter === "no_genres" ? { genres: { none: {} } } :
      currentFilter === "no_credits" ? { credits: { none: {} } } :
        currentFilter === "no_poster" ? { posterUrl: null } :
          currentFilter === "green" ? {
            AND: [
              { titles: { some: { isPrimary: false } } }, // Есть альт. названия
              { posterUrl: { not: null } },
              { synopsis: { not: null } },
              { genres: { some: {} } },
              { credits: { some: {} } }
            ]
          } :
            currentFilter === "red" ? {
              // 🔴 Красный: нет альтернативных названий
              titles: { none: { isPrimary: false } }
            } :
              currentFilter === "yellow" ? {
                // 🟡 Желтый: есть альт. названия, но не хватает чего-то ещё
                AND: [
                  { titles: { some: { isPrimary: false } } },
                  {
                    OR: [
                      { posterUrl: null },
                      { synopsis: null },
                      { genres: { none: {} } },
                      { credits: { none: {} } }
                    ]
                  }
                ]
              } :
                undefined;

  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  // ОПТИМИЗИРОВАННЫЙ ЗАПРОС
  const dramas = await prisma.drama.findMany({
    where: {
      deletedAt: null,
      ...(whereConditions.length > 0 ? { AND: whereConditions } : {})
    },
    include: {
      titles: true,
      _count: {
        select: { credits: true, genres: true },
      },
      genres: {
        include: { genre: true },
        take: 5 // Берем только 5 для тултипа
      },
      credits: {
        include: { person: true },
        take: 8 // Берем только 8 для тултипа
      },
    },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">

      {/* ВЕРХНИЙ РЯД */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Дорамы
            <span className="text-sm font-normal text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {dramas.length}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <MobileSearchButton />
          <Link
            href="/admin/dramas/new"
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Добавить дораму
          </Link>
        </div>
      </div>

      {/* НИЖНИЙ РЯД */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по названиям..." showGlobalSearch />
        </div>

        {/* Чипсы */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          {[
            { key: "no_genres", label: "Без жанров" },
            { key: "no_credits", label: "Без актёров" },
            { key: "no_poster", label: "Без постера" },
          ].map((f) => {
            const isActive = currentFilter === f.key;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (!isActive) params.set("filter", f.key);

            return (
              <Link
                key={f.key}
                href={`/admin/dramas?${params.toString()}`}
                className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 border-none ${isActive
                  ? "bg-accent text-white"
                  : "bg-transparent text-muted hover:bg-surface hover:text-foreground"
                  }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {dramas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted mb-4">В базе пока нет дорам</p>
          <Link
            href="/admin/dramas/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Добавить первую
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Объект
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Алиасы
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Ключевые факты
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Наполнение
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {dramas.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-border last:border-b-0 hover:bg-foreground/2 transition-colors"
                  >
                    {/* КОЛОНКА 1: Объект */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StatusDot
                          items={[
                            // Если нет альт. названий — это критично (красный)
                            { label: "Альт. названия", isFilled: d.titles.length > 1, isCritical: true },
                            { label: "Постер", isFilled: !!d.posterUrl },
                            { label: "Жанры", isFilled: d._count.genres > 0 },
                            { label: "Актеры", isFilled: d._count.credits > 0 },
                            { label: "Описание", isFilled: !!d.synopsis },
                          ]}
                        />
                        <div className="w-8 h-12 rounded bg-accent-soft/40 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                          {d.posterUrl ? (
                            <img src={d.posterUrl} alt={d.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-muted text-sm">🎬</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{d.title}</p>
                          {(d.ratingKinopoisk || d.ratingIMDB) && (
                            <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-current text-yellow-400" />
                              {d.ratingKinopoisk ?? d.ratingIMDB}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* КОЛОНКА 2: Алиасы */}
                    <td className="px-4 py-3">
                      <AliasBadge aliases={d.titles.filter(t => !t.isPrimary).map(t => t.title)} />
                    </td>

                    {/* КОЛОНКА 3: Ключевые факты */}
                    <td className="px-4 py-3 text-sm text-muted">
                      {[d.year, d.country].filter(Boolean).join(" · ") || "—"}
                    </td>

                    {/* КОЛОНКА 4: Наполнение (Используем _count и take) */}
                    <td className="px-4 py-3">
                      <MetricsIcons
                        credits={d.credits}
                        totalCredits={d._count.credits}
                        genres={d.genres}
                        totalGenres={d._count.genres}
                        hasSynopsis={!!d.synopsis}
                      />
                    </td>

                    {/* КОЛОНКА 5: Действия */}
                    <td className="px-4 py-3">
                      <DramaActions dramaId={d.id} dramaTitle={d.title} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}