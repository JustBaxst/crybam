import { prisma } from "@/lib/prisma";
import { CatalogCard } from "@/components/CatalogCard";
import { getDramaSearchWhere } from "@/lib/search-queries";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { CatalogToolbar } from "@/components/CatalogToolbar";
import Link from "next/link";
import { X, Compass } from "lucide-react";

type SearchParams = Promise<{
  q?: string; sort?: string; genre?: string; mood?: string; theme?: string;
  status?: string; episodes?: string; country?: string;
}>;

export default async function DramasCatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, sort, genre, mood, theme, status, episodes, country } = await searchParams;

  const query = (q ?? "").trim();
  const currentSort = sort || "year_desc";

  // Парсим массивы через запятую
  const genreIds = genre ? genre.split(",").map(Number).filter(Boolean) : [];
  const moods = mood ? mood.split(",") : [];
  const themes = theme ? theme.split(",") : [];
  const statuses = status ? status.split(",") : [];
  const countries = country ? country.split(",") : [];

  const whereCondition: any = {
    deletedAt: null,
    ...getDramaSearchWhere(query),
  };

  // Множественные фильтры (используем "in")
  if (genreIds.length > 0) whereCondition.genres = { some: { genreId: { in: genreIds } } };
  if (moods.length > 0) whereCondition.moods = { some: { mood: { name: { in: moods } } } };
  if (themes.length > 0) whereCondition.themes = { some: { theme: { name: { in: themes } } } };
  if (statuses.length > 0) whereCondition.airStatus = { in: statuses };
  if (countries.length > 0) whereCondition.country = { in: countries };

  if (episodes) {
    if (episodes === "1-12") whereCondition.episodes = { lte: 12 };
    if (episodes === "13-20") whereCondition.episodes = { gte: 13, lte: 20 };
    if (episodes === "21+") whereCondition.episodes = { gte: 21 };
  }

  let orderBy: any = [{ year: "desc" }, { title: "asc" }];
  if (currentSort === "rating_desc") orderBy = [{ ratingKinopoisk: "desc" }, { ratingIMDB: "desc" }];
  else if (currentSort === "title_asc") orderBy = [{ title: "asc" }];
  else if (currentSort === "year_asc") orderBy = [{ year: "asc" }, { title: "asc" }];
  else if (currentSort === "episodes_desc") orderBy = [{ episodes: "desc" }, { title: "asc" }];
  else if (currentSort === "episodes_asc") orderBy = [{ episodes: "asc" }, { title: "asc" }];
  else if (currentSort === "random") orderBy = undefined;

  let dramas = await prisma.drama.findMany({
    where: whereCondition,
    include: {
      genres: { include: { genre: true } },
      moods: { include: { mood: true } },
    },
    orderBy,
  });

  if (currentSort === "random") dramas = dramas.sort(() => Math.random() - 0.5);

  // Данные для тулбара
  const allGenres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  const allMoods = await prisma.mood.findMany({ orderBy: { name: "asc" } });
  const allThemes = await prisma.dramaTheme.findMany({ orderBy: { name: "asc" } });
  const allCountriesRaw = await prisma.drama.findMany({
    where: { deletedAt: null, country: { not: null } },
    select: { country: true }, distinct: ["country"], orderBy: { country: "asc" }
  });
  const allCountries = allCountriesRaw.map(c => c.country).filter(Boolean) as string[];

  // Плашки активных фильтров
  const activeFilters: { label: string, key: string, value: string }[] = [];

  genreIds.forEach(id => {
    const g = allGenres.find(x => x.id === id);
    if (g) activeFilters.push({ label: `Жанр: ${g.name}`, key: "genre", value: String(id) });
  });
  moods.forEach(m => activeFilters.push({ label: `Настроение: ${m}`, key: "mood", value: m }));
  themes.forEach(t => activeFilters.push({ label: `Тема: #${t}`, key: "theme", value: t }));
  statuses.forEach(s => activeFilters.push({ label: `Статус: ${s === "ongoing" ? "Выходит" : s === "released" ? "Вышел" : "Анонс"}`, key: "status", value: s }));
  countries.forEach(c => activeFilters.push({ label: `Страна: ${c}`, key: "country", value: c }));
  if (episodes) activeFilters.push({ label: `Серий: ${episodes}`, key: "episodes", value: episodes });

  const buildClearUrl = (filterToRemove?: { key: string, value?: string }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "year_desc") params.set("sort", sort);
    if (episodes && filterToRemove?.key !== "episodes") params.set("episodes", episodes);

    const addValues = (key: string, vals: string[], removedVal?: string) => {
      const remaining = removedVal ? vals.filter(v => v !== removedVal) : vals;
      if (remaining.length > 0) params.set(key, remaining.join(","));
    };

    addValues("genre", genreIds.map(String), filterToRemove?.key === "genre" ? filterToRemove.value : undefined);
    addValues("mood", moods, filterToRemove?.key === "mood" ? filterToRemove.value : undefined);
    addValues("theme", themes, filterToRemove?.key === "theme" ? filterToRemove.value : undefined);
    addValues("status", statuses, filterToRemove?.key === "status" ? filterToRemove.value : undefined);
    addValues("country", countries, filterToRemove?.key === "country" ? filterToRemove.value : undefined);

    return `/dramas?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Каталог дорам</h1>
          <p className="text-sm text-muted mt-1">
            {query || activeFilters.length > 0 ? (
              <>
                Найдено: <span className="text-accent">{dramas.length}</span>{" "}
                {query && `по запросу «${query}»`}
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

      {/* ─── ЕДИНЫЙ БЛОК «НАВИГАЦИЯ» ─── */}
      <div className="bg-surface/20 border border-border/50 rounded-2xl p-6 mb-8 space-y-5 shadow-sm">

        {/* Заголовок блока */}
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Compass className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold">Навигация</h2>
        </div>

        {/* 1. Поиск */}
        <div className="max-w-2xl">
          <AdminSearchBar placeholder="Поиск по названию..." />
        </div>

        {/* 2. Фильтры и Сортировка */}
        <div className="pt-2">
          <CatalogToolbar
            allGenres={allGenres}
            allMoods={allMoods}
            allThemes={allThemes}
            allCountries={allCountries}
          />
        </div>

        {/* 3. Активные фильтры */}
        {activeFilters.length > 0 && (
          <div className="pt-4 border-t border-border/50 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted mr-1">Выбрано:</span>
            {activeFilters.map((f, i) => (
              <Link
                key={i}
                href={buildClearUrl(f)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-medium hover:bg-accent/20 transition-colors"
              >
                {f.label}
                <X className="w-3 h-3" />
              </Link>
            ))}
            <Link href="/dramas" className="text-xs text-muted hover:text-foreground underline ml-2">
              Сбросить всё
            </Link>
          </div>
        )}
      </div>

      {/* ─── СЕТКА ДОРАМ ─── */}
      {dramas.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {(query || activeFilters.length > 0)
              ? "По вашему запросу ничего не найдено"
              : "В базе пока нет дорам"}
          </p>
          {(query || activeFilters.length > 0) && (
            <Link
              href="/dramas"
              className="inline-block mt-3 text-sm text-accent hover:underline"
            >
              ← Сбросить поиск и фильтры
            </Link>
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