import Link from "next/link";
import { Plus, Pencil, Trash2, Star, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteDramaButton } from "./DeleteDramaButton";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getDramaSearchWhere } from "@/lib/search-queries";

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

     // Собираем всё в массив, отбрасывая undefined (пустые условия)
  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  const dramas = await prisma.drama.findMany({
    where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
    include: {
      platforms: { include: { platform: true } },    
      studios: { include: { studio: true } },        
      _count: {
        select: { credits: true, genres: true },
      },
    },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
      
      {/* ВЕРХНИЙ РЯД: Заголовок и Кнопка */}
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
          {/* Мобильная иконка для глобального поиска (44x44) */}
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

      {/* НИЖНИЙ РЯД: Поиск и Фильтры */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по названиям..." />
        </div>
        
        {/* Чипсы (скроллятся на мобилке) */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          <span className="text-xs text-muted shrink-0 mr-1">Фильтры:</span>
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
          <p className="text-muted mb-4">
            В базе пока нет дорам
          </p>
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                  Название
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden md:table-cell">
                  Год
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden md:table-cell">
                  Страна
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden lg:table-cell">
                  Платформы                                     
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden lg:table-cell">
                  Студии                                        
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden xl:table-cell">
                  Кредитов
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-12 rounded bg-accent-soft/40 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                        {d.posterUrl ? (
                          <img
                            src={d.posterUrl}
                            alt={d.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-muted text-sm">🎬</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {d.title}
                        </p>
                        {(d.ratingKinopoisk || d.ratingIMDB) && (
                          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                            {d.ratingKinopoisk ?? d.ratingIMDB}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {d.year ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    {d.country ?? "—"}
                  </td>
                    <td className="px-4 py-3 text-sm text-muted hidden lg:table-cell max-w-37.5 truncate">
                    {d.platforms.map((p) => p.platform.name).join(", ") || "—"}  
                  </td>
                    <td className="px-4 py-3 text-sm text-muted hidden lg:table-cell max-w-37.5 truncate">
                    {d.studios.map((s) => s.studio.name).join(", ") || "—"}     
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden xl:table-cell">
                    {d._count.credits} / {d._count.genres} жанров
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/dramas/${d.id}`}
                        className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteDramaButton
                        dramaId={d.id}
                        dramaTitle={d.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}