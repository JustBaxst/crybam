import Link from "next/link";
import { Plus, Pencil, UserCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";

type SearchParams = Promise<{ q?: string; filter?: string }>;



export default async function AdminCharactersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();
  const currentFilter = filter || "";

  const searchCondition = query
    ? { nameLower: { contains: query.toLowerCase() } }
    : {};

    const filterCondition = 
    currentFilter === "no_photo" ? { imageUrl: null } :
    currentFilter === "no_desc" ? { description: null } :
    {};

  const characters = await prisma.character.findMany({
    where: { AND: [searchCondition, filterCondition] },
    include: {
      drama: { select: { id: true, title: true, year: true } },
      _count: { select: { credits: true } },
    },
    orderBy: [
      { drama: { title: "asc" } },
      { name: "asc" },
    ],
  });

 return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
      
      {/* ВЕРХНИЙ РЯД */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Персонажи
            <span className="text-sm font-normal text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {characters.length}
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <MobileSearchButton />
          <Link
            href="/admin/characters/new"
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </Link>
        </div>
      </div>

      {/* НИЖНИЙ РЯД: Поиск и Фильтры */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени персонажа..." />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          <span className="text-xs text-muted shrink-0 mr-1">Фильтры:</span>
          {[
            { key: "no_photo", label: "Без фото" },
            { key: "no_desc", label: "Без описания" },
          ].map((f) => {
            const isActive = currentFilter === f.key;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (!isActive) params.set("filter", f.key);
            
            return (
              <Link
                key={f.key}
                href={`/admin/characters?${params.toString()}`}
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

      {characters.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface/50 p-10 text-center">
          <p className="text-muted mb-4">В базе пока нет персонажей</p>
          <Link
            href="/admin/characters/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Добавить первого
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                  Персонаж
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden md:table-cell">
                  Дорама
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide hidden lg:table-cell">
                  Ролей
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {characters.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-b-0 hover:bg-foreground/2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent-soft/40 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                        {c.imageUrl ? (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-4 h-4 text-muted" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {c.name}
                        </p>
                        {c.description && (
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                    <Link
                      href={`/admin/dramas/${c.drama.id}`}
                      className="hover:text-accent transition-colors"
                    >
                      {c.drama.title}
                      {c.drama.year && (
                        <span className="text-xs ml-1">({c.drama.year})</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden lg:table-cell">
                    {c._count.credits}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/characters/${c.id}`}
                        className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors"
                        title="Редактировать"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
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