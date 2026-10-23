import Link from "next/link";
import { Search, User as UserIcon, Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPersonSearchWhere } from "@/lib/search-queries";

type SearchParams = Promise<{ q?: string }>;

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const people = await prisma.person.findMany({
    where: getPersonSearchWhere(query),
    include: {
      _count: { select: { credits: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Актёры</h1>
        <p className="text-sm text-muted mt-1">
          {query ? (
            <>
              Найдено: <span className="text-accent">{people.length}</span> по
              запросу «{query}»
            </>
          ) : (
            <>
              Всего в базе:{" "}
              <span className="text-accent">{people.length}</span>{" "}
              {plural(people.length, "человек", "человека", "человек")}
            </>
          )}
        </p>
      </div>

      <form method="GET" className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Поиск по имени..."
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

      {people.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {query ? "Ничего не найдено" : "В базе пока нет актёров"}
          </p>
          {query && (
            <a
              href="/people"
              className="inline-block mt-3 text-sm text-accent hover:underline"
            >
              ← Очистить поиск
            </a>
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
              <div className="aspect-square bg-accent-soft/30 flex items-center justify-center text-5xl overflow-hidden">
                {p.photoUrl ? (
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
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