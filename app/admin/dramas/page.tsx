import Link from "next/link";
import { Plus, Star, Film, Tag, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getDramaSearchWhere } from "@/lib/search-queries";
import { StatusDot } from "@/components/admin/StatusDot";
import { AliasBadge } from "@/components/admin/AliasBadge";
import { DramaActions } from "./DramaActions";
import { Tooltip } from "@/components/Tooltip";

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
    undefined;

  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  const dramas = await prisma.drama.findMany({
    where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
    include: {
      titles: true, // ← Для AliasBadge
      _count: {
        select: { credits: true, genres: true },
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
         
        {/* Чипсы (без слова "Фильтры:") */}
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
                className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 border-none ${
                  isActive 
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
          {/* Оборачиваем таблицу для горизонтального скролла на узких экранах */}
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
                            { label: "Постер", isFilled: !!d.posterUrl, isCritical: true },
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

                    {/* КОЛОНКА 4: Наполнение */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-muted">
                        <Tooltip content="Актеры">
                          <span className="flex items-center gap-1 text-xs">
                            <Film className="w-3.5 h-3.5" /> {d._count.credits}
                          </span>
                        </Tooltip>
                        <Tooltip content="Жанры">
                          <span className="flex items-center gap-1 text-xs">
                            <Tag className="w-3.5 h-3.5" /> {d._count.genres}
                          </span>
                        </Tooltip>
                        <Tooltip content={d.synopsis ? "Описание есть" : "Нет описания"}>
                          <FileText className={`w-3.5 h-3.5 ${d.synopsis ? "text-green-500/70" : "text-muted/30"}`} />
                        </Tooltip>
                      </div>
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