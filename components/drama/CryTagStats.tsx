import { ShieldCheck, Smile, Droplets } from "lucide-react";

type CryTagData = { cryTag: string; count: number };

export function CryTagStats({ stats }: { stats: CryTagData[] }) {
    if (stats.length === 0) return null;

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    // Хелперы для иконок и цветов
    const getIcon = (tag: string, className: string) => {
        if (tag === "safe") return <ShieldCheck className={className} />;
        if (tag === "bittersweet") return <Smile className={className} />;
        return <Droplets className={className} />;
    };

    const getColor = (tag: string) =>
        tag === "safe" ? "text-cry-safe" :
            tag === "bittersweet" ? "text-cry-happy" :
                "text-cry-sad";

    const getBgColor = (tag: string) =>
        tag === "safe" ? "bg-cry-safe" :
            tag === "bittersweet" ? "bg-cry-happy" :
                "bg-cry-sad";

    return (
        <div className="flex flex-col gap-2">
            {stats.map((stat) => {
                const percent = Math.round((stat.count / total) * 100);
                const label =
                    stat.cryTag === "safe" ? "Безопасно" :
                        stat.cryTag === "bittersweet" ? "Слёзы счастья" :
                            "Рыдай";

                return (
                    <div key={stat.cryTag} className="flex items-center gap-2">
                        {/* Иконка и текст слева */}
                        <div className={`flex items-center gap-1.5 w-24 shrink-0 text-[14px] ${getColor(stat.cryTag)}`}>
                            {getIcon(stat.cryTag, "w-4 h-4")}
                            <span>{label}</span>
                        </div>

                        {/* Прогресс-бар по центру */}
                        <div className="flex-1 h-2.5 bg-surface border border-border/50 rounded-full overflow-hidden">
                            <div className={`h-full ${getBgColor(stat.cryTag)}`} style={{ width: `${percent}%` }} />
                        </div>

                        {/* Процент справа */}
                        <span className="text-[14px] text-muted tabular-nums w-8 text-right shrink-0">
                            {percent}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
}