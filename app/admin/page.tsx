import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Film, User, UserCircle, Tag, TrendingUp, Minus } from "lucide-react"; // ← Добавили Minus
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

        {/* Строка 1: Компактные плашки с приростом */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: pluralize(stats.dramas.total, ["Дорама", "Дорамы", "Дорам"]), value: stats.dramas.total, icon: Film, href: "/admin/dramas", weeklyGrowth: stats.dramas.weeklyGrowth },
            { label: pluralize(stats.persons.total, ["Актер", "Актера", "Актеров"]), value: stats.persons.total, icon: User, href: "/admin/people", weeklyGrowth: stats.persons.weeklyGrowth },
            { label: pluralize(stats.characters.total, ["Персонаж", "Персонажа", "Персонажей"]), value: stats.characters.total, icon: UserCircle, href: "/admin/characters", weeklyGrowth: stats.characters.weeklyGrowth },
            { label: pluralize(stats.genres, ["Жанр", "Жанра", "Жанров"]), value: stats.genres, icon: Tag, href: "/admin/dramas", weeklyGrowth: 0 }, // Жанры пока 0
          ].map((s, i) => (
            <Link key={i} href={s.href} className={`${adminCardCompact} flex items-center justify-between`}>

              {/* Левая часть: Цифра и название */}
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold tabular-nums text-foreground">{s.value}</p>
                <p className="text-xs text-muted font-medium mt-0.5 truncate">{s.label}</p>
              </div>

              {/* Разделитель */}
              <div className="h-10 border-l border-border/50 mx-4" />

              {/* Правая часть: Прирост */}
              <div className="shrink-0 text-right">
                <div className="flex items-center justify-end gap-1">
                  {s.weeklyGrowth > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-bold text-green-500 tabular-nums">+{s.weeklyGrowth}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-muted" />
                      <span className="text-sm font-bold text-muted tabular-nums">0</span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-muted mt-0.5">за неделю</p>
              </div>

            </Link>
          ))}
        </div>

        {/* Строка 2: Верхний ряд */}
        <div className="col-span-12 lg:col-span-6">
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
        <div className="col-span-12 lg:col-span-9">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ marginBottom: 0 }}>
                Карта продуктивности
              </h2>
            </div>
            <div className="flex-1 w-full">
              <AdminHeatmap activities={heatmapActivities} currentUserId={data.user.id} />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <LastVictory victory={lastVictory} />
          <RecentActivity logs={recentLogs} />
        </div>

      </div>
    </div>
  );
}