import { Search, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CatalogCard } from "@/components/CatalogCard";
import { getDramaSearchWhere } from "@/lib/search-queries";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import Link from "next/link";

// 1. Добавили новые параметры в тип
type SearchParams = Promise<{
  q?: string;
  sort?: string;
  genre?: string;
  mood?: string;
  theme?: string;
}>;

export default async function DramasCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 2. Достаем все параметры
  const { q, sort, genre, mood, theme } = await searchParams;
  const query = (q ?? "").trim();
  const currentSort = sort || "year_desc";

  const genreId = genre ? Number(genre) : null;

  // 3. Собираем умное условие для базы
  const whereCondition: any = {
    deletedAt: null,
    ...getDramaSearchWhere(query),
  };

  if (genreId) {
    whereCondition.genres = { some: { genreId } };
  }
  if (mood) {
    whereCondition.moods = { some: { mood: { name: mood } } };
  }
  if (theme) {
    whereCondition.themes = { some: { theme: { name: theme } } };
  }

  // 4. Делаем запрос
  const dramas = await prisma.drama.findMany({
    where: whereCondition,
    include: {
      genres: { include: { genre: true } },
      moods: { include: { mood: true } },
    },
    orderBy:
      currentSort === "rating_desc"
        ? [{ ratingKinopoisk: "desc" }, { ratingIMDB: "desc" }]
        : currentSort === "title_asc"
          ? [{ title: "asc" }]
          : [{ year: "desc" }, { title: "asc" }],
  });

  // 5. Формируем плашки активных фильтров
  const activeFilters = [];
  if (mood) activeFilters.push({ label: `Настроение: ${mood}`, clearUrl: `/dramas?${q ? `q=${q}&` : ""}sort=${currentSort}` });
  if (theme) activeFilters.push({ label: `Тема: #${theme}`, clearUrl: `/dramas?${q ? `q=${q}&` : ""}sort=${currentSort}` });
  // Для жанра ссылку на сброс сделать сложнее, так как мы знаем только ID, но мы можем просто скрыть его при клике
  if (genreId) activeFilters.push({ label: `Жанр (ID: ${genreId})`, clearUrl: `/dramas?${q ? `q=${q}&` : ""}sort=${currentSort}` });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Каталог дорам</h1>
          <p className="text-sm text-muted mt-1">
            {query ? (
              <>
                Найдено: <span className="text-accent">{dramas.length}</span>{" "}
                по запросу «{query}»
              </>
            ) : (
              <>
                Всего в базе:{" "}
                <span className="text-accent">{dramas.length}</span>{" "}
                {plural(dramas.length, "дорама", "дорамы", "дорам")}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Сортировка */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className="text-muted">Сортировка:</span>
        <div className="flex items-center gap-1.5">
          {[
            { key: "year_desc", label: "По году" },
            { key: "rating_desc", label: "По рейтингу" },
            { key: "title_asc", label: "По алфавиту" },
          ].map((s) => (
            <a
              key={s.key}
              href={`/dramas?${query ? `q=${encodeURIComponent(query)}&` : ""}sort=${s.key}`}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${currentSort === s.key
                ? "bg-accent text-white border-accent"
                : "border-border hover:border-accent/40 text-muted hover:text-foreground"
                }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-8 max-w-2xl">
        <AdminSearchBar placeholder="Поиск по имени..." />
      </div>


      {/* Активные фильтры */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted">Активные фильтры:</span>
          {activeFilters.map((f, i) => (
            <Link
              key={i}
              href={f.clearUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-medium hover:bg-accent/20 transition-colors"
            >
              {f.label}
              <span className="text-base leading-none">&times;</span>
            </Link>
          ))}
          <Link href="/dramas" className="text-xs text-muted hover:text-foreground underline ml-2">
            Сбросить все
          </Link>
        </div>
      )}

      {/* Сетка */}
      {dramas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {query
              ? `По запросу «${query}» ничего не найдено`
              : "В базе пока нет дорам"}
          </p>
          {query && (
            <a
              href="/dramas"
              className="inline-block mt-3 text-sm text-accent hover:underline"
            >
              ← Очистить поиск
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {dramas.map((d) => (
            <CatalogCard
              key={d.id}
              dramaId={d.id}
              title={d.title}
              year={d.year}
              country={d.country}
              posterUrl={d.posterUrl}
              ratingKinopoisk={d.ratingKinopoisk}
              ratingIMDB={d.ratingIMDB}
              genres={d.genres.map((g) => g.genre.name)}
            />
          ))}
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