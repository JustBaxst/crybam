import Link from "next/link";
import { AlertCircle, CheckCircle2, Film, User, UserCircle } from "lucide-react";

type StatGroup = { total: number; green: number; yellow: number; red: number };
type Props = { stats: { dramas: StatGroup; persons: StatGroup; characters: StatGroup } };

export function AttentionBlock({ stats }: Props) {
    const totalRed = stats.dramas.red + stats.persons.red + stats.characters.red;
    const totalYellow = stats.dramas.yellow + stats.persons.yellow + stats.characters.yellow;

    if (totalRed === 0 && totalYellow === 0) {
        return (
            <div className="col-span-12 rounded-2xl border border-green-500/30 bg-green-500/5 p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-sm font-medium text-green-500">Все карточки в идеальном состоянии. Отличная работа!</p>
            </div>
        );
    }

    const isRed = totalRed > 0;
    const bgClass = isRed ? "border-red-500/30 bg-red-500/5" : "border-yellow-500/30 bg-yellow-500/5";
    const textClass = isRed ? "text-red-500" : "text-yellow-500";
    const icon = isRed ? <AlertCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />;

    return (
        <div className={`col-span-12 rounded-2xl border ${bgClass} p-4`}>
            <div className={`flex items-center gap-2 mb-3 font-semibold ${textClass}`}>
                {icon}
                {isRed ? "Обратите внимание" : "В процессе заполнения"}
            </div>
            <div className="flex flex-wrap gap-3">
                {stats.dramas.red > 0 && (
                    <Link href="/admin/dramas?filter=red" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors text-sm">
                        <Film className="w-4 h-4 text-muted" />
                        <span><strong className="text-foreground">{stats.dramas.red}</strong> дорам нужны альт. названия</span>
                    </Link>
                )}
                {stats.persons.red > 0 && (
                    <Link href="/admin/people?filter=red" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors text-sm">
                        <User className="w-4 h-4 text-muted" />
                        <span><strong className="text-foreground">{stats.persons.red}</strong> актерам нужны альт. имена</span>
                    </Link>
                )}
                {stats.characters.red > 0 && (
                    <Link href="/admin/characters?filter=red" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors text-sm">
                        <UserCircle className="w-4 h-4 text-muted" />
                        <span><strong className="text-foreground">{stats.characters.red}</strong> персонажам нужны альт. имена</span>
                    </Link>
                )}
            </div>
        </div>
    );
}