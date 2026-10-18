import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteDramaButton } from "./DeleteDramaButton";

export default async function AdminDramasPage() {
  const dramas = await prisma.drama.findMany({
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Шапка */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Дорамы</h1>
          <p className="text-sm text-muted mt-1">
            Всего: <span className="text-accent">{dramas.length}</span>{" "}
            {plural(dramas.length, "дорама", "дорамы", "дорам")}
          </p>
        </div>
        <Link
          href="/admin/dramas/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Добавить дораму
        </Link>
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