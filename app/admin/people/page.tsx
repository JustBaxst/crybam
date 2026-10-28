import Link from "next/link";
import { Plus, Film, FileText, User as UserIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getPersonSearchWhere } from "@/lib/search-queries";
import { StatusDot } from "@/components/admin/StatusDot";
import { AliasBadge } from "@/components/admin/AliasBadge";
import { PersonActions } from "./PersonActions";
import { Tooltip } from "@/components/Tooltip";

type SearchParams = Promise<{ q?: string; filter?: string }>;

export default async function AdminPeoplePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, filter } = await searchParams;
  const query = (q ?? "").trim();
  const currentFilter = filter || "";

  const searchCondition = getPersonSearchWhere(query);

  const filterCondition =
    currentFilter === "no_photo" ? { photoUrl: null } :
      currentFilter === "no_bio" ? { bio: null } :
        currentFilter === "green" ? {
          AND: [
            { aliases: { some: {} } },
            { photoUrl: { not: null } },
            { bio: { not: null } }
          ]
        } :
          currentFilter === "red" ? {
            // 🔴 Красный: нет альтернативных имён
            aliases: { none: {} }
          } :
            currentFilter === "yellow" ? {
              // 🟡 Жёлтый: есть альт. имена, но нет фото или био
              AND: [
                { aliases: { some: {} } },
                {
                  OR: [
                    { photoUrl: null },
                    { bio: null }
                  ]
                }
              ]
            } :
              undefined;

  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  const people = await prisma.person.findMany({
    where: {
      deletedAt: null,
      ...(whereConditions.length > 0 ? { AND: whereConditions } : {})
    },
    include: {
      aliases: true,
      _count: { select: { credits: true } },
      credits: {
        include: {
          drama: { select: { title: true } },
          character: { select: { name: true } }
        },
        take: 5
      }
    },
    orderBy: { name: "asc" },
  });

  // Функция для вычисления возраста
  const getAge = (date: Date | null) => {
    if (!date) return null;
    return Math.floor((Date.now() - new Date(date).getTime()) / 31557600000);
  };

  const getGenderLabel = (g: string | null) => {
    if (g === "male") return "Мужской";
    if (g === "female") return "Женский";
    if (g === "other") return "Другой";
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">

      {/* ВЕРХНИЙ РЯД */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Актёры и группа
            <span className="text-sm font-normal text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {people.length}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <MobileSearchButton />
          <Link
            href="/admin/people/new"
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
          <AdminSearchBar placeholder="Поиск по имени..." showGlobalSearch />
        </div>

        {/* Чипсы */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          {[
            { key: "no_photo", label: "Без фото" },
            { key: "no_bio", label: "Без биографии" },
          ].map((f) => {
            const isActive = currentFilter === f.key;
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (!isActive) params.set("filter", f.key);

            return (
              <Link
                key={f.key}
                href={`/admin/people?${params.toString()}`}
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

      {people.length === 0 ? (
        <p className="text-muted">В базе пока нет актёров.</p>
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
                {people.map((p) => {
                  const age = getAge(p.birthDate);
                  const gender = getGenderLabel(p.gender);
                  const facts = [gender, age ? `${age} лет` : null, p.agency].filter(Boolean).join(" · ");

                  const roleCount = p._count.credits; // ← Берем из _count (общее число)
                  const roleNames = p.credits.map(c => { // ← Итерируемся по урезанному массиву (макс 5)
                    return c.character?.name
                      ? `${c.drama.title} (${c.character.name})`
                      : c.drama.title;
                  });
                  const roleRest = roleCount > p.credits.length ? `\n...и еще ${roleCount - p.credits.length}` : "";
                  const roleTooltip = roleCount === 0
                    ? "Нет ролей"
                    : `Ролей (${roleCount}):\n${roleNames.join("\n")}${roleRest}`;

                  return (
                    <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-foreground/2 transition-colors">
                      {/* КОЛОНКА 1: Объект */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <StatusDot
                            items={[
                              { label: "Альт. имена", isFilled: p.aliases.length > 0, isCritical: true },
                              { label: "Фото", isFilled: !!p.photoUrl },
                              { label: "Биография", isFilled: !!p.bio },
                            ]}
                          />
                          <div className="w-10 h-14 rounded-md bg-accent-soft/40 flex items-center justify-center shrink-0 overflow-hidden">
                            {p.photoUrl ? (
                              <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon className="w-5 h-5 text-muted" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{p.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* КОЛОНКА 2: Алиасы */}
                      <td className="px-4 py-3">
                        <AliasBadge aliases={p.aliases.map(a => a.name)} />
                      </td>

                      {/* КОЛОНКА 3: Ключевые факты */}
                      <td className="px-4 py-3 text-sm text-muted">
                        {facts || "—"}
                      </td>

                      {/* КОЛОНКА 4: Наполнение */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Tooltip content={<span className="whitespace-pre-wrap">{roleTooltip}</span>}>
                            <span className={`flex items-center gap-1 text-xs ${roleCount > 0 ? "text-green-500" : "text-muted/30"}`}>
                              <Film className="w-3.5 h-3.5" /> {roleCount}
                            </span>
                          </Tooltip>
                          <Tooltip content={p.bio ? "Биография есть" : "Нет биографии"}>
                            <FileText className={`w-3.5 h-3.5 ${p.bio ? "text-green-500" : "text-muted/30"}`} />
                          </Tooltip>
                        </div>
                      </td>

                      {/* КОЛОНКА 5: Действия */}
                      <td className="px-4 py-3">
                        <PersonActions personId={p.id} personName={p.name} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}