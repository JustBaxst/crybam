import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Film, User, UserCircle, Tag, TrendingUp } from "lucide-react";
import { AdminHeatmap } from "@/components/admin/AdminHeatmap";
import { DatabaseHealth } from "@/components/admin/DatabaseHealth";
import { ApiStatus } from "@/components/admin/ApiStatus";
import { AttentionBlock } from "@/components/admin/AttentionBlock";
import { QuickStart } from "@/components/admin/QuickStart";
import { LastVictory } from "@/components/admin/LastVictory";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { pluralize } from "@/lib/pluralize";

const adminCardCompact = "rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:border-accent/40 hover:bg-accent/5 group";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  if (!data) redirect("/");

  const { stats, heatmapActivities, lastVictory, recentLogs } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <section className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold">Обзор Crybam</h1>
        <p className="text-sm text-muted">С возвращением, {data.user.name}. Вот что происходит в базе.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Строка 1: Компактные плашки */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: pluralize(stats.dramas.total, ["Дорама", "Дорамы", "Дорам"]), value: stats.dramas.total, icon: Film, href: "/admin/dramas" },
            { label: pluralize(stats.persons.total, ["Актер", "Актера", "Актеров"]), value: stats.persons.total, icon: User, href: "/admin/people" },
            { label: pluralize(stats.characters.total, ["Персонаж", "Персонажа", "Персонажей"]), value: stats.characters.total, icon: UserCircle, href: "/admin/characters" },
            { label: pluralize(stats.genres, ["Жанр", "Жанра", "Жанров"]), value: stats.genres, icon: Tag, href: "/admin/dramas" },
          ].map((s, i) => (
            <Link key={i} href={s.href} className={adminCardCompact}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                  <p className="text-xs text-muted font-medium mt-0.5">{s.label}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Строка 2: Верхний ряд */}
        <div className="col-span-12 lg:col-span-6 flex">
          <DatabaseHealth dramas={stats.dramas} persons={stats.persons} characters={stats.characters} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <QuickStart />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ApiStatus />
        </div>

        {/* Строка 3: Обратите внимание */}
        <div className="col-span-12">
          <AttentionBlock stats={stats} />
        </div>

        {/* Строка 4: Нижний ряд */}
        <div className="col-span-12 lg:col-span-8">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ marginBottom: 0 }}>
                Карта продуктивности
              </h2>
            </div>
            <div className="overflow-x-auto pb-4 flex-1">
              <AdminHeatmap activities={heatmapActivities} currentUserId={data.user.id} />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <LastVictory victory={lastVictory} />
          <RecentActivity logs={recentLogs} />
        </div>

      </div>
    </div>
  );
}