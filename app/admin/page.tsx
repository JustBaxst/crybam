import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Film, User, UserCircle, Tag, ArrowRight } from "lucide-react";
import { AdminHeatmap } from "@/components/admin/AdminHeatmap";
import { FixRandomButton } from "@/components/admin/FixRandomButton";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();

  if (!data) redirect("/");

  const { stats, heatmapActivities } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Обзор Crybam
          </h1>
          <p className="text-sm text-muted mt-1">
            С возвращением, {data.user.name}. Вот что происходит в базе.
          </p>
        </div>
      </div>

      {/* БЕНТО-СЕТКА (Верхний ряд) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Блок 1: Здоровье БД */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Здоровье базы данных
            </h2>
            {/* Прогресс-бар */}
            <div className="w-full h-4 rounded-full bg-background border border-border overflow-hidden flex">
              <div style={{ width: `${(stats.green / stats.total) * 100}%` }} className="bg-green-500 h-full" title="Зелёные" />
              <div style={{ width: `${(stats.yellow / stats.total) * 100}%` }} className="bg-yellow-500 h-full" title="Жёлтые" />
              <div style={{ width: `${(stats.red / stats.total) * 100}%` }} className="bg-red-500 h-full" title="Красные" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Link href="/admin/dramas?filter=green" className="group">
              <p className="text-2xl font-bold text-green-500 group-hover:underline">{stats.green}</p>
              <p className="text-xs text-muted">Заполнены</p>
            </Link>
            <Link href="/admin/dramas?filter=yellow" className="group">
              <p className="text-2xl font-bold text-yellow-500 group-hover:underline">{stats.yellow}</p>
              <p className="text-xs text-muted">В процессе</p>
            </Link>
            <Link href="/admin/dramas?filter=red" className="group">
              <p className="text-2xl font-bold text-red-500 group-hover:underline">{stats.red}</p>
              <p className="text-xs text-muted">Сломаны</p>
            </Link>
          </div>
        </div>

        {/* Блок 2: Быстрый старт */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Быстрый старт</h2>
          <div className="flex flex-col gap-2 flex-1">
            <Link href="/admin/dramas/new" className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border transition-colors text-sm">
              <span>Добавить дораму</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>
            <Link href="/admin/people/new" className="flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border transition-colors text-sm">
              <span>Добавить актера</span>
              <ArrowRight className="w-4 h-4 text-muted" />
            </Link>

            {/* Кнопка исправления */}
            <FixRandomButton />
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
          <Link key={i} href={s.href} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4 hover:border-accent/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Хитмап (Нижний ряд) */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-4">Активность</h2>
        <AdminHeatmap activities={heatmapActivities} />
      </div>
    </div>
  );
}