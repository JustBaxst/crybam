import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Film, User, UserCircle, ShieldCheck, Clock } from "lucide-react";

type LogItem = {
    id: number;
    action: string;
    entityType: string;
    entityName: string;
    createdAt: Date;
    user: { name: string; avatarUrl: string | null };
};

export function ChronicleFeed({ logs }: { logs: LogItem[] }) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-12 text-muted border-2 border-dashed border-border rounded-2xl">
                Пока нет событий в хронике.
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "drama": return <Film className="w-4 h-4 text-accent" />;
            case "person": return <User className="w-4 h-4 text-blue-400" />;
            case "character": return <UserCircle className="w-4 h-4 text-purple-400" />;
            default: return <ShieldCheck className="w-4 h-4 text-muted" />;
        }
    };

    const getActionText = (action: string) => {
        switch (action) {
            case "DRAMA_COMPLETED": return "завершил(а) карточку";
            case "DRAMA_CREATED": return "добавил(а) дораму";
            case "PERSON_CREATED": return "добавил(а) актера";
            case "CHARACTER_CREATED": return "добавил(а) персонажа";
            default: return "обновил(а)";
        }
    };

    return (
        <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
            {logs.map((log) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Точка на таймлайне */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        {getIcon(log.entityType)}
                    </div>

                    {/* Карточка события */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-surface shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-foreground">{log.user.name}</span>
                            <span className="text-[10px] text-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(log.createdAt), "d MMM, HH:mm", { locale: ru })}
                            </span>
                        </div>
                        <p className="text-sm text-muted">
                            {getActionText(log.action)} <span className="font-medium text-foreground">«{log.entityName}»</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}