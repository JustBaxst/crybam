import Link from "next/link";
import { UserCircle, Film, X, Compass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCharacterSearchWhere } from "@/lib/search-queries";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { CharactersToolbar } from "@/components/CharactersToolbar";

type SearchParams = Promise<{
  q?: string; sort?: string; dramaId?: string; roleType?: string; personId?: string; gender?: string;
}>;

export default async function CharactersCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort, dramaId, roleType, personId, gender } = await searchParams;
  const query = (q ?? "").trim();
  const currentSort = sort || "name_asc";

  const dramaIds = dramaId ? dramaId.split(",").map(Number) : [];
  const roleTypes = roleType ? roleType.split(",") : [];
  const personIds = personId ? personId.split(",").map(Number) : [];
  const genders = gender ? gender.split(",") : [];

  const whereCondition: any = {
    ...getCharacterSearchWhere(query),
  };

  if (dramaIds.length) whereCondition.dramaId = { in: dramaIds };
  if (genders.length) whereCondition.gender = { in: genders };

  const creditConditions: any = {};
  if (roleTypes.length) creditConditions.importance = { in: roleTypes };
  if (personIds.length) creditConditions.personId = { in: personIds };
  if (Object.keys(creditConditions).length > 0) {
    whereCondition.credits = { some: creditConditions };
  }

  const characters = await prisma.character.findMany({
    where: whereCondition,
    include: {
      drama: { select: { id: true, title: true, year: true } },
      credits: {
        where: { roleType: "actor", person: { deletedAt: null } },
        include: { person: { select: { id: true, name: true, photoUrl: true } } },
        take: 1, // Берем только первого актера
      },
      aliases: { select: { name: true } }
    },
  });

  // Сортировка в памяти
  if (currentSort === "name_asc") characters.sort((a, b) => a.name.localeCompare(b.name));
  if (currentSort === "name_desc") characters.sort((a, b) => b.name.localeCompare(a.name));
  if (currentSort === "importance_desc" || currentSort === "importance_asc") {
    const importanceOrder: Record<string, number> = { lead: 0, support: 1, guest: 2 };
    const isDesc = currentSort === "importance_desc";
    characters.sort((a, b) => {
      const aImp = a.credits[0]?.importance || "support";
      const bImp = b.credits[0]?.importance || "support";
      const diff = (importanceOrder[aImp] ?? 1) - (importanceOrder[bImp] ?? 1);
      return isDesc ? diff : -diff;
    });
  }

  // Данные для фильтров
  const allDramas = await prisma.drama.findMany({ where: { deletedAt: null }, select: { id: true, title: true }, orderBy: { title: "asc" } });
  const allPersons = await prisma.person.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } });

  // Плашки
  const activeFilters: { label: string, key: string, value: string }[] = [];
  dramaIds.forEach(id => {
    const d = allDramas.find(x => x.id === id);
    if (d) activeFilters.push({ label: `Дорама: ${d.title}`, key: "dramaId", value: String(id) });
  });
  roleTypes.forEach(r => activeFilters.push({ label: `Роль: ${r === "lead" ? "Главная" : r === "support" ? "Второстепенная" : "Эпизод"}`, key: "roleType", value: r }));
  personIds.forEach(id => {
    const p = allPersons.find(x => x.id === id);
    if (p) activeFilters.push({ label: `Актер: ${p.name}`, key: "personId", value: String(id) });
  });
  genders.forEach(g => activeFilters.push({ label: `Пол: ${g === "male" ? "Мужской" : g === "female" ? "Женский" : "Другой"}`, key: "gender", value: g }));

  const buildClearUrl = (filterToRemove?: { key: string, value?: string }) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "name_asc") params.set("sort", sort);

    const addValues = (key: string, vals: string[], removedVal?: string) => {
      const remaining = removedVal ? vals.filter(v => v !== removedVal) : vals;
      if (remaining.length > 0) params.set(key, remaining.join(","));
    };

    addValues("dramaId", dramaIds.map(String), filterToRemove?.key === "dramaId" ? filterToRemove.value : undefined);
    addValues("roleType", roleTypes, filterToRemove?.key === "roleType" ? filterToRemove.value : undefined);
    addValues("personId", personIds.map(String), filterToRemove?.key === "personId" ? filterToRemove.value : undefined);
    addValues("gender", genders, filterToRemove?.key === "gender" ? filterToRemove.value : undefined);

    return `/characters?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Персонажи</h1>
        <p className="text-sm text-muted mt-1">
          Всего в базе: <span className="text-accent">{characters.length}</span>
        </p>
      </div>

      {/* ─── ЕДИНЫЙ БЛОК «НАВИГАЦИЯ» ─── */}
      <div className="bg-surface/20 border border-border/50 rounded-2xl p-6 mb-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-border/50">
          <Compass className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold">Навигация</h2>
        </div>

        <div className="max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени персонажа..." />
        </div>

        <div className="pt-2">
          <CharactersToolbar allDramas={allDramas} allPersons={allPersons} />
        </div>

        {activeFilters.length > 0 && (
          <div className="pt-4 border-t border-border/50 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted mr-1">Выбрано:</span>
            {activeFilters.map((f, i) => (
              <Link key={i} href={buildClearUrl(f)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 text-xs font-medium hover:bg-accent/20 transition-colors">
                {f.label} <X className="w-3 h-3" />
              </Link>
            ))}
            <Link href="/characters" className="text-xs text-muted hover:text-foreground underline ml-2">Сбросить всё</Link>
          </div>
        )}
      </div>

      {characters.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {query || activeFilters.length > 0 ? `Ничего не найдено` : "В базе пока нет персонажей"}
          </p>
          {(query || activeFilters.length > 0) && (
            <Link href="/characters" className="inline-block mt-3 text-sm text-accent hover:underline">
              ← Сбросить поиск и фильтры
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {characters.map((char) => {
            const actor = char.credits[0]?.person;

            return (
              <Link
                key={char.id}
                href={`/characters/${char.id}`}
                className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors"
              >
                {/* Фото персонажа (или заглушка) */}
                <div className="aspect-2/3 bg-accent-soft/30 flex items-center justify-center overflow-hidden relative">
                  {char.imageUrl ? (
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.03]"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-muted/50" />
                  )}
                  {/* Плашка с дорамой поверх фото */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-8">
                    <p className="text-xs text-white/90 line-clamp-1 flex items-center gap-1.5">
                      <Film className="w-3 h-3 shrink-0" />
                      {char.drama.title}
                    </p>
                  </div>
                </div>

                {/* Инфо */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{char.name}</h3>
                  {actor ? (
                    <p className="text-xs text-muted mt-1 truncate">
                      Играет: <span className="text-accent">{actor.name}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted mt-1 italic">Актер не указан</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}