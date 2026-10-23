import { Search, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CatalogCard } from "@/components/CatalogCard";
import { getDramaSearchWhere } from "@/lib/search-queries";

type SearchParams = Promise<{ q?: string; sort?: string }>; 

export default async function DramasCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort } = await searchParams; 
  const query = (q ?? "").trim();
  const currentSort = sort || "year_desc";

  const dramas = await prisma.drama.findMany({
where: getDramaSearchWhere(query),
    include: {
      genres: { include: { genre: true } },
    },
    orderBy: 
      currentSort === "rating_desc" 
        ? [{ ratingKinopoisk: "desc" }, { ratingIMDB: "desc" }] 
        : currentSort === "title_asc" 
        ? [{ title: "asc" }] 
        : [{ year: "desc" }, { title: "asc" }], // year_desc
  });

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
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                currentSort === s.key
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
      <form method="GET" className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-border bg-surface focus:border-accent outline-none transition-colors text-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Найти
          </button>
        </div>
      </form>

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