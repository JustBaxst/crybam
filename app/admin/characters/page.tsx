import Link from "next/link";
import { Plus, UserCircle, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getCharacterSearchWhere } from "@/lib/search-queries";
import { StatusDot } from "@/components/admin/StatusDot";
import { AliasBadge } from "@/components/admin/AliasBadge";
import { CharacterActions } from "./CharacterActions";
import { Tooltip } from "@/components/Tooltip";

type SearchParams = Promise<{ q?: string; filter?: string }>;

export default async function AdminCharactersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();
  const currentFilter = filter || "";

  const searchCondition = getCharacterSearchWhere(query);

  const filterCondition =
    currentFilter === "no_photo" ? { imageUrl: null } :
      currentFilter === "no_desc" ? { description: null } :
        undefined;

  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  const characters = await prisma.character.findMany({
    where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
    include: {
      drama: { select: { id: true, title: true } },
      aliases: true,
      // Берем только 1 кредит, чтобы узнать важность роли
      credits: { take: 1, select: { importance: true } },
    },
    orderBy: [
      { drama: { title: "asc" } },
      { name: "asc" },
    ],
  });

  // Функция для рендера бейджа важности
  const renderImportance = (importance?: string) => {
    if (!importance) return <span className="text-xs text-muted/50">—</span>;
    if (importance === "lead") return <span className="text-[10px] px-2 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">Главная</span>;
    if (importance === "guest") return <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">Эпизод</span>;
    return <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">Второстепенная</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">

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

      {/* НИЖНИЙ РЯД */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени персонажа..." showGlobalSearch />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
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
                className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 border-none ${isActive
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">Объект</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">Алиасы</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">Ключевые факты</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">Наполнение</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">Действия</th>
                </tr>
              </thead>
              <tbody>
                {characters.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-foreground/2 transition-colors">
                    {/* КОЛОНКА 1: Объект */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StatusDot
                          items={[
                            { label: "Фото/Алиасы", isFilled: !!c.imageUrl || c.aliases.length > 0, isCritical: true },
                            { label: "Описание", isFilled: !!c.description },
                          ]}
                        />
                        <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center shrink-0 overflow-hidden">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-5 h-5 text-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{c.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* КОЛОНКА 2: Алиасы */}
                    <td className="px-4 py-3">
                      <AliasBadge aliases={c.aliases.map(a => a.name)} />
                    </td>

                    {/* КОЛОНКА 3: Ключевые факты */}
                    <td className="px-4 py-3 text-sm text-muted">
                      <Link href={`/admin/dramas/${c.drama.id}`} className="hover:text-accent transition-colors truncate block max-w-50">
                        {c.drama.title}
                      </Link>
                    </td>

                    {/* КОЛОНКА 4: Наполнение */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {renderImportance(c.credits[0]?.importance)}
                        <Tooltip content={c.description ? "Описание есть" : "Нет описания"}>
                          <FileText className={`w-3.5 h-3.5 ${c.description ? "text-green-500" : "text-muted/30"}`} />
                        </Tooltip>
                      </div>
                    </td>

                    {/* КОЛОНКА 5: Действия */}
                    <td className="px-4 py-3">
                      <CharacterActions characterId={c.id} characterName={c.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}