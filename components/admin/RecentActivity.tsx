import { Activity, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getActionLabel } from "@/lib/action-labels";

export function RecentActivity({ logs }: { logs: any[] }) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex-1 flex flex-col min-h-62.5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Недавняя активность
                </h2>
                <Link
                    href="/admin/chronicle"
                    className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                    Все события <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-62.5 pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full flex-1">
                {logs.length === 0 ? (
                    <p className="text-sm text-muted text-center py-4">Пока нет событий.</p>
                ) : (
                    logs.map((log: any) => (
                        <div key={log.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-accent">{log.user.name[0]}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm leading-snug">
                                    <span className="font-semibold text-foreground">{log.user.name}</span>{" "}
                                    <span className="text-muted">{getActionLabel(log.action)}</span>{" "}
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
    );
}