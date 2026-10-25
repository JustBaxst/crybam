import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Film, User, UserCircle, Tag, ArrowRight, Activity } from "lucide-react";
import { AdminHeatmap } from "@/components/admin/AdminHeatmap";
import { FixRandomButton } from "@/components/admin/FixRandomButton";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();

  if (!data) redirect("/");

  const { stats, heatmapActivities } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Обзор Crybam
          </h1>
          <p className="text-sm text-muted mt-1">
            С возвращением, {data.user.name}. Вот что происходит в базе.
          </p>
        </div>
      </div>

      {/* БЕНТО-СЕТКА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Блок 1: Здоровье БД */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Декоративный фон */}
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-32 h-32" />
          </div>

          <div className="relative z-10">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Здоровье базы данных
            </h2>

            {/* Толстый прогресс-бар с подписями */}
            <div className="w-full h-10 rounded-xl bg-background border border-border overflow-hidden flex mb-6 shadow-inner">
              <div style={{ width: `${(stats.green / stats.total) * 100}%` }} className="bg-green-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`Готово: ${stats.green}`}>
                {(stats.green / stats.total) * 100 > 5 ? `${Math.round((stats.green / stats.total) * 100)}%` : ''}
              </div>
              <div style={{ width: `${(stats.yellow / stats.total) * 100}%` }} className="bg-yellow-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`В процессе: ${stats.yellow}`}>
                {(stats.yellow / stats.total) * 100 > 5 ? `${Math.round((stats.yellow / stats.total) * 100)}%` : ''}
              </div>
              <div style={{ width: `${(stats.red / stats.total) * 100}%` }} className="bg-red-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`Сломаны: ${stats.red}`}>
                {(stats.red / stats.total) * 100 > 5 ? `${Math.round((stats.red / stats.total) * 100)}%` : ''}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <Link href="/admin/dramas?filter=green" className="group p-4 rounded-xl border border-transparent hover:border-green-500/30 hover:bg-green-500/5 transition-all">
              <p className="text-3xl font-bold text-green-500 group-hover:scale-105 transition-transform origin-left">{stats.green}</p>
              <p className="text-xs text-muted mt-1 font-medium">Готовы</p>
            </Link>
            <Link href="/admin/dramas?filter=yellow" className="group p-4 rounded-xl border border-transparent hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all">
              <p className="text-3xl font-bold text-yellow-500 group-hover:scale-105 transition-transform origin-left">{stats.yellow}</p>
              <p className="text-xs text-muted mt-1 font-medium">В процессе</p>
            </Link>
            <Link href="/admin/dramas?filter=red" className="group p-4 rounded-xl border border-transparent hover:border-red-500/30 hover:bg-red-500/5 transition-all">
              <p className="text-3xl font-bold text-red-500 group-hover:scale-105 transition-transform origin-left">{stats.red}</p>
              <p className="text-xs text-muted mt-1 font-medium">Требуют внимания</p>
            </Link>
          </div>
        </div>

        {/* Блок 2: Быстрый старт */}
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

            <div className="mt-auto pt-2">
              <FixRandomButton />
            </div>
          </div>
        </div>
      </div>

      {/* Счётчики (Средний ряд) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Дорамы", value: stats.total, icon: Film, href: "/admin/dramas" },
          { label: "Актеры", value: stats.persons, icon: User, href: "/admin/people" },
          { label: "Персонажи", value: stats.characters, icon: UserCircle, href: "/admin/characters" },
          { label: "Жанры", value: stats.genres, icon: Tag, href: "/admin/dramas" },
        ].map((s, i) => (
          <Link key={i} href={s.href} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4 hover:border-accent/40 hover:bg-accent/5 transition-all shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted font-medium mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Хитмап (Нижний ряд) */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Карта продуктивности
          </h2>
        </div>
        {/* Передаем ID текущего пользователя для работы тумблера "Только я" */}
        <AdminHeatmap activities={heatmapActivities} currentUserId={data.user.id} />
      </div>
    </div>
  );
}