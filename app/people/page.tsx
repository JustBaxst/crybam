import Link from "next/link";
import { User as UserIcon, Film, X, Compass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPersonSearchWhere } from "@/lib/search-queries";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { PeopleToolbar } from "@/components/PeopleToolbar";

type SearchParams = Promise<{
  q?: string; sort?: string; agency?: string; age?: string; gender?: string;
  nationality?: string; zodiac?: string; dramaId?: string;
}>;

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort, agency, age, gender, nationality, zodiac, dramaId } = await searchParams;
  const query = (q ?? "").trim();
  const currentSort = sort || "name_asc";

  const agencies = agency ? agency.split(",") : [];
  const genders = gender ? gender.split(",") : [];
  const nationalities = nationality ? nationality.split(",") : [];
  const zodiacs = zodiac ? zodiac.split(",") : [];
  const dramaIds = dramaId ? dramaId.split(",").map(Number) : [];

  const whereCondition: any = {
    deletedAt: null,
    ...getPersonSearchWhere(query)
  };

  if (agencies.length) whereCondition.agency = { in: agencies };
  if (genders.length) whereCondition.gender = { in: genders };
  if (nationalities.length) whereCondition.nationality = { in: nationalities };
  if (zodiacs.length) whereCondition.zodiacWestern = { in: zodiacs };
  if (dramaIds.length) whereCondition.credits = { some: { dramaId: { in: dramaIds } } };

  // Фильтр по возрасту
  if (age) {
    const currentYear = new Date().getFullYear();
    if (age === "under_25") whereCondition.birthDate = { gte: new Date(`${currentYear - 25}-01-01`) };
    if (age === "25_35") whereCondition.birthDate = { gte: new Date(`${currentYear - 35}-01-01`), lte: new Date(`${currentYear - 25}-12-31`) };
    if (age === "35_45") whereCondition.birthDate = { gte: new Date(`${currentYear - 45}-01-01`), lte: new Date(`${currentYear - 35}-12-31`) };
    if (age === "over_45") whereCondition.birthDate = { lte: new Date(`${currentYear - 45}-12-31`) };
  }

  let orderBy: any = [{ name: "asc" }];
  if (currentSort === "name_desc") orderBy = [{ name: "desc" }];
  if (currentSort === "age_asc") orderBy = [{ birthDate: "desc" }];
  if (currentSort === "age_desc") orderBy = [{ birthDate: "asc" }];
  if (currentSort === "roles_desc") orderBy = [{ credits: { _count: "desc" } }];
  if (currentSort === "roles_asc") orderBy = [{ credits: { _count: "asc" } }];

  const people = await prisma.person.findMany({
    where: whereCondition,
    include: {
      _count: { select: { credits: true } },
    },
    orderBy,
  });

  // Данные для фильтров
  const allAgenciesRaw = await prisma.person.findMany({ where: { deletedAt: null, agency: { not: null } }, select: { agency: true }, distinct: ["agency"], orderBy: { agency: "asc" } });
  const allAgencies = allAgenciesRaw.map(a => a.agency).filter(Boolean) as string[];

  const allNationalitiesRaw = await prisma.person.findMany({ where: { deletedAt: null, nationality: { not: null } }, select: { nationality: true }, distinct: ["nationality"], orderBy: { nationality: "asc" } });
  const allNationalities = allNationalitiesRaw.map(n => n.nationality).filter(Boolean) as string[];

  const allZodiacsRaw = await prisma.person.findMany({ where: { deletedAt: null, zodiacWestern: { not: null } }, select: { zodiacWestern: true }, distinct: ["zodiacWestern"], orderBy: { zodiacWestern: "asc" } });
  const allZodiacs = allZodiacsRaw.map(z => z.zodiacWestern).filter(Boolean) as string[];

  const allDramas = await prisma.drama.findMany({ where: { deletedAt: null }, select: { id: true, title: true }, orderBy: { title: "asc" } });

  // Плашки
  const activeFilters: { label: string, key: string, value: string }[] = [];
  agencies.forEach(a => activeFilters.push({ label: `Агентство: ${a}`, key: "agency", value: a }));
  genders.forEach(g => activeFilters.push({ label: `Пол: ${g === "male" ? "Мужской" : g === "female" ? "Женский" : "Другой"}`, key: "gender", value: g }));
  nationalities.forEach(n => activeFilters.push({ label: `Страна: ${n}`, key: "nationality", value: n }));
  zodiacs.forEach(z => activeFilters.push({ label: `Знак: ${z}`, key: "zodiac", value: z }));
  dramaIds.forEach(id => {
    const d = allDramas.find(x => x.id === id);
    if (d) activeFilters.push({ label: `Дорама: ${d.title}`, key: "dramaId", value: String(id) });
  });
  if (age) activeFilters.push({ label: `Возраст: ${age.replace("_", "-")}`, key: "age", value: age });

  const buildClearUrl = (filterToRemove?: { key: string, value?: string }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "name_asc") params.set("sort", sort);
    if (age && filterToRemove?.key !== "age") params.set("age", age);

    const addValues = (key: string, vals: string[], removedVal?: string) => {
      const remaining = removedVal ? vals.filter(v => v !== removedVal) : vals;
      if (remaining.length > 0) params.set(key, remaining.join(","));
    };

    addValues("agency", agencies, filterToRemove?.key === "agency" ? filterToRemove.value : undefined);
    addValues("gender", genders, filterToRemove?.key === "gender" ? filterToRemove.value : undefined);
    addValues("nationality", nationalities, filterToRemove?.key === "nationality" ? filterToRemove.value : undefined);
    addValues("zodiac", zodiacs, filterToRemove?.key === "zodiac" ? filterToRemove.value : undefined);
    addValues("dramaId", dramaIds.map(String), filterToRemove?.key === "dramaId" ? filterToRemove.value : undefined);

    return `/people?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Актёры</h1>
        <p className="text-sm text-muted mt-1">
          {query || activeFilters.length > 0 ? (
            <>Найдено: <span className="text-accent">{people.length}</span></>
          ) : (
            <>Всего в базе: <span className="text-accent">{people.length}</span> {plural(people.length, "человек", "человека", "человек")}</>
          )}
        </p>
      </div>

      {/* ─── ЕДИНЫЙ БЛОК «НАВИГАЦИЯ» ─── */}
      <div className="bg-surface/20 border border-border/50 rounded-2xl p-6 mb-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Compass className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold">Навигация</h2>
        </div>

        <div className="max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени..." />
        </div>

        <div className="pt-2">
          <PeopleToolbar
            allAgencies={allAgencies}
            allNationalities={allNationalities}
            allZodiacs={allZodiacs}
            allDramas={allDramas}
          />
        </div>

        {activeFilters.length > 0 && (
          <div className="pt-4 border-t border-border/50 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted mr-1">Выбрано:</span>
            {activeFilters.map((f, i) => (
              <Link key={i} href={buildClearUrl(f)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-medium hover:bg-accent/20 transition-colors">
                {f.label} <X className="w-3 h-3" />
              </Link>
            ))}
            <Link href="/people" className="text-xs text-muted hover:text-foreground underline ml-2">Сбросить всё</Link>
          </div>
        )}
      </div>

      {people.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {query || activeFilters.length > 0 ? "Ничего не найдено" : "В базе пока нет актёров"}
          </p>
          {(query || activeFilters.length > 0) && (
            <Link href="/people" className="inline-block mt-3 text-sm text-accent hover:underline">
              ← Сбросить поиск и фильтры
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {people.map((p) => (
            <Link
              key={p.id}
              href={`/people/${p.id}`}
              className="rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors group"
            >
              <div className="aspect-2/3 bg-accent-soft/30 flex items-center justify-center text-5xl overflow-hidden">
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-muted" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">
                  {p.name}
                </p>
                {p.nameNative && (
                  <p className="text-xs text-muted truncate mt-0.5">
                    {p.nameNative}
                  </p>
                )}
                <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  {p._count.credits}{" "}
                  {plural(p._count.credits, "роль", "роли", "ролей")}
                </p>
              </div>
            </Link>
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