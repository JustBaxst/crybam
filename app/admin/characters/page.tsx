import Link from "next/link";
import { Plus, Pencil, UserCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminCharactersPage() {
  const characters = await prisma.character.findMany({
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Персонажи</h1>
          <p className="text-sm text-muted mt-1">
            Всего: <span className="text-accent">{characters.length}</span>{" "}
            {plural(characters.length, "персонаж", "персонажа", "персонажей")}
          </p>
        </div>
        <Link
          href="/admin/characters/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Добавить персонажа
        </Link>
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
                  className="border-b border-border last:border-b-0 hover:bg-foreground/[0.02] transition-colors"
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