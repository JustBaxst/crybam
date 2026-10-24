import Link from "next/link";
import { Search, UserCircle, Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCharacterSearchWhere } from "@/lib/search-queries";
import { AdminSearchBar } from "@/components/AdminSearchBar"; // Используем наш красивый поиск

type SearchParams = Promise<{ q?: string }>;

export default async function CharactersCatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const characters = await prisma.character.findMany({
    where: getCharacterSearchWhere(query),
    include: {
      drama: { select: { id: true, title: true, year: true } },
      credits: {
        where: { roleType: "actor" },
        include: { person: { select: { id: true, name: true, photoUrl: true } } },
        take: 1, // Берем только первого актера
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Персонажи</h1>
          <p className="text-sm text-muted mt-1">
            Всего в базе: <span className="text-accent">{characters.length}</span>
          </p>
        </div>
        
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени персонажа..." />
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted">
            {query ? `По запросу «${query}» ничего не найдено` : "В базе пока нет персонажей"}
          </p>
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
                    className="w-full h-full object-cover"
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