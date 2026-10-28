import { Activity, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function RecentActivity({ logs }: { logs: any[] }) {
    return (
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex-1 flex flex-col min-h-[200px]">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-accent" />
                Недавняя активность
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[200px] pr-2 flex-1">
                {logs.length === 0 ? (
                    <p className="text-sm text-muted text-center py-4">Пока нет событий.</p>
                ) : (
                    logs.map((log: any) => (
                        <div key={log.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-accent">{log.user.name[0]}</span>
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-semibold text-foreground">{log.user.name}</span>{" "}
                                    <span className="text-muted">{log.action === "DRAMA_COMPLETED" ? "завершил(а) карточку" : "обновил(а)"}</span>{" "}
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