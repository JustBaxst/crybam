import Link from "next/link";
import { Plus, Pencil, Trash2, User as UserIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { MobileSearchButton } from "@/components/MobileSearchButton";
import { getPersonSearchWhere } from "@/lib/search-queries";

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
    undefined;

  const whereConditions = [searchCondition, filterCondition].filter(Boolean) as any[];

  const people = await prisma.person.findMany({
    where: whereConditions.length > 0 ? { AND: whereConditions } : undefined,
    include: { _count: { select: { credits: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-6">
      
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

      {/* НИЖНИЙ РЯД: Поиск и Фильтры */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по имени..." />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          <span className="text-xs text-muted shrink-0 mr-1">Фильтры:</span>
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

      {people.length === 0 ? (
        <p className="text-muted">В базе пока нет актёров.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-xl shrink-0 overflow-hidden">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{p.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {p._count.credits} {plural(p._count.credits, "роль", "роли", "ролей")}
                </p>
              </div>
              <Link
                href={`/admin/people/${p.id}`}
                className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors shrink-0"
                title="Редактировать"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </div>
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