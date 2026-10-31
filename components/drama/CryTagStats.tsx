"use client";

import { ShieldCheck, Smile, Droplets } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type CryTagData = { cryTag: string; count: number };

export function CryTagStats({ stats }: { stats: CryTagData[] }) {
    if (stats.length === 0) return null;

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

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

    const getLabel = (tag: string) =>
        tag === "safe" ? "Безопасно" :
            tag === "bittersweet" ? "Слёзы счастья" :
                "Рыдай";

    return (
        <div className="flex flex-col gap-2.5">
            {stats.map((stat) => {
                const percent = Math.round((stat.count / total) * 100);

                return (
                    <div key={stat.cryTag} className="flex items-center gap-3">

                        <Popover>
                            <PopoverTrigger asChild>
                                {/* Текст стал text-xs, ширина w-28 */}
                                <button className={`flex items-center gap-1.5 w-28 shrink-0 text-xs cursor-pointer hover:underline ${getColor(stat.cryTag)}`}>
                                    {getIcon(stat.cryTag, "w-3.5 h-3.5")}
                                    <span>{getLabel(stat.cryTag)}</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4 bg-surface border border-border rounded-xl shadow-lg" align="start">
                                <h4 className="text-sm font-semibold mb-3">Настроение зрителей</h4>
                                <div className="space-y-3">
                                    {stats.map((s) => {
                                        const p = Math.round((s.count / total) * 100);
                                        return (
                                            <div key={s.cryTag} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        {getIcon(s.cryTag, `w-3.5 h-3.5 ${getColor(s.cryTag)}`)}
                                                        {getLabel(s.cryTag)}
                                                    </span>
                                                    <span className="text-muted tabular-nums">{s.count} ({p}%)</span>
                                                </div>
                                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                                    <div className={`h-full ${getBgColor(s.cryTag)}`} style={{ width: `${p}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Полоска стала толще - h-2.5 */}
                        <div className="flex-1 h-2.5 bg-surface border border-border/50 rounded-full overflow-hidden">
                            <div className={`h-full ${getBgColor(stat.cryTag)}`} style={{ width: `${percent}%` }} />
                        </div>

                        {/* Текст процента тоже увеличили до text-xs и w-10 */}
                        <span className="text-xs text-muted tabular-nums w-10 text-right shrink-0">
                            {percent}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
}