import { getAdminOverviewData } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Film, User, UserCircle, Tag, ArrowRight, Activity, Trophy, Plus, Zap, TrendingUp, Clock } from "lucide-react";
import { AdminHeatmap } from "@/components/admin/AdminHeatmap";
import { FixRandomButton } from "@/components/admin/FixRandomButton";
import { DatabaseHealth } from "@/components/admin/DatabaseHealth";
import { ApiStatus } from "@/components/admin/ApiStatus";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const adminCard = "rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md";
const adminCardCompact = "rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:border-accent/40 hover:bg-accent/5 group";
const sectionTitle = "text-lg font-semibold flex items-center gap-2 mb-4";
const actionLink = "flex items-center justify-between p-3 rounded-xl bg-background hover:bg-foreground/5 border border-border hover:border-accent/40 transition-all text-sm group";

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();
  if (!data) redirect("/");

  const { stats, heatmapActivities, lastVictory, recentLogs } = data;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Обзор Crybam</h1>
        <p className="text-sm text-muted">С возвращением, {data.user.name}. Вот что происходит в базе.</p>
      </section>

      {/* ОСНОВНАЯ 12-КОЛОНОЧНАЯ СЕТКА */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* РЯД 1: Верхний */}
        <div className="col-span-12 lg:col-span-6 flex">
          <DatabaseHealth
            dramas={stats.dramas}
            persons={stats.persons}
            characters={stats.characters}
          />
        </div>

        <div className="col-span-12 lg:col-span-3">
          <section className={`${adminCard} h-full flex flex-col`}>
            <h2 className={sectionTitle}>
              <Zap className="w-5 h-5 text-accent" />
              Быстрый старт
            </h2>
            <div className="flex flex-col gap-3 flex-1">
              <Link href="/admin/dramas/new" className={actionLink}>
                <span className="font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                  Добавить дораму
                </span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link href="/admin/people/new" className={actionLink}>
                <span className="font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                  Добавить актера
                </span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <Link href="/admin/characters/new" className={actionLink}>
                <span className="font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                  Добавить персонажа
                </span>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
              </Link>
              <div className="mt-auto pt-3">
                <FixRandomButton />
              </div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-3">
          <ApiStatus />
        </div>

        {/* РЯД 2: Карточки сущностей */}
        <div className="col-span-12">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Дорамы", value: stats.dramas.total, icon: Film, href: "/admin/dramas", trend: stats.dramas.progress },
              { label: "Актеры", value: stats.persons.total, icon: User, href: "/admin/people", trend: null },
              { label: "Персонажи", value: stats.characters.total, icon: UserCircle, href: "/admin/characters", trend: null },
              { label: "Жанры", value: stats.genres, icon: Tag, href: "/admin/dramas", trend: null },
            ].map((s, i) => (
              <Link key={i} href={s.href} className={adminCardCompact}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                    <p className="text-xs text-muted font-medium mt-0.5">{s.label}</p>
                    {s.trend !== null && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {s.trend}% заполнено
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <s.icon className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </div>

        {/* РЯД 3: Аналитика */}
        <div className="col-span-12 lg:col-span-8">
          <section className={`${adminCard} h-full`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={sectionTitle} style={{ marginBottom: 0 }}>
                <Activity className="w-5 h-5 text-accent" />
                Карта продуктивности
              </h2>
            </div>
            <div className="overflow-x-auto pb-4">
              <AdminHeatmap activities={heatmapActivities} currentUserId={data.user.id} />
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {lastVictory && (
            <section className={`${adminCard} relative overflow-hidden shrink-0`}>
              <div className="absolute -right-4 -top-4 opacity-5"><Trophy className="w-24 h-24" /></div>
              <h2 className={sectionTitle}>
                <Trophy className="w-5 h-5 text-yellow-500" />
                Последняя победа
              </h2>
              <p className="text-sm font-medium text-foreground">
                «{lastVictory.entityName}» завершена!
              </p>
              <p className="text-xs text-muted mt-1">
                {lastVictory.user.name} • {format(new Date(lastVictory.createdAt), "d MMM, HH:mm", { locale: ru })}
              </p>
            </section>
          )}

          <section className={`${adminCard} flex-1 flex flex-col`}>
            <h2 className={sectionTitle}>
              <Activity className="w-5 h-5 text-accent" />
              Недавняя активность
            </h2>
            <div className="space-y-4 overflow-y-auto flex-1">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">Пока нет событий.</p>
              ) : (
                recentLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-accent">{log.user.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">{log.user.name}</span>
                        {" "}
                        <span className="text-muted">
                          {log.action === "DRAMA_COMPLETED" ? "завершил(а) карточку" : "обновил(а)"}
                        </span>
                        {" "}
                        <span className="font-medium text-foreground">«{log.entityName}»</span>
                      </p>
                      <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(log.createdAt), "d MMM, HH:mm", { locale: ru })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}