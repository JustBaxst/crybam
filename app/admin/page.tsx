import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Film, User, UserCircle, Tag, ArrowRight, Activity, Trophy, Plus } from "lucide-react";
import { AdminHeatmap } from "@/components/admin/AdminHeatmap";
import { FixRandomButton } from "@/components/admin/FixRandomButton";
import { DatabaseHealth } from "@/components/admin/DatabaseHealth";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  if (!data) redirect("/");

  const { stats, heatmapActivities, lastVictory } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold">Обзор Crybam</h1>
          <p className="text-sm text-muted mt-1">С возвращением, {data.user.name}. Вот что происходит в базе.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Блок 1: Здоровье БД (с табами) */}
        <DatabaseHealth
          dramas={stats.dramas}
          persons={stats.persons}
          characters={stats.characters}
        />

        {/* Блок 2: Быстрый старт + Последняя победа */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Быстрый старт</h2>
            <div className="flex flex-col gap-3 flex-1">
              <Link href="/admin/dramas/new" className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group">
                <span className="font-medium">Добавить дораму</span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link href="/admin/people/new" className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group">
                <span className="font-medium">Добавить актера</span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link href="/admin/characters/new" className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group">
                <span className="font-medium">Добавить персонажа</span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <FixRandomButton />
            </div>
          </div>

          {/* Виджет: Последняя победа */}
          {lastVictory && (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5"><Trophy className="w-24 h-24" /></div>
              <h2 className="text-sm font-semibold text-muted flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Последняя победа
              </h2>
              <p className="text-sm font-medium text-foreground">
                «{lastVictory.entityName}» завершена!
              </p>
              <p className="text-xs text-muted mt-1">
                {lastVictory.user.name} • {format(new Date(lastVictory.createdAt), "d MMM, HH:mm", { locale: ru })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Счётчики (Средний ряд) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Дорамы", value: stats.dramas.total, icon: Film, href: "/admin/dramas" },
          { label: "Актеры", value: stats.persons.total, icon: User, href: "/admin/people" },
          { label: "Персонажи", value: stats.characters.total, icon: UserCircle, href: "/admin/characters" },
          { label: "Жанры", value: stats.genres, icon: Tag, href: "/admin/dramas" },
        ].map((s, i) => (
          <Link key={i} href={s.href} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4 hover:border-accent/40 hover:bg-accent/5 transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted font-medium mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Хитмап */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Карта продуктивности
          </h2>
        </div>
        <AdminHeatmap activities={heatmapActivities} currentUserId={data.user.id} />
      </div>
    </div>
  );
}