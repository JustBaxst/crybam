import { Trophy } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function LastVictory({ victory }: { victory: any }) {
    if (!victory) return null;
    return (
        <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/2 shadow-[0_0_15px_rgba(234,179,8,0.05)] p-6 relative overflow-hidden shrink-0">
            <div className="absolute -right-4 -top-4 opacity-5"><Trophy className="w-24 h-24 text-yellow-500" /></div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 relative z-10">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Последняя победа
            </h2>
            <p className="text-sm font-medium text-foreground relative z-10">
                «{victory.entityName}» завершена!
            </p>
            <p className="text-xs text-muted mt-1 relative z-10">
                {victory.user.name} • {format(new Date(victory.createdAt), "d MMM, HH:mm", { locale: ru })}
            </p>
        </section>
    );
}