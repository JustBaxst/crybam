"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShieldCheck, Smile, CloudRain } from "lucide-react";

type CryTagData = { cryTag: string; count: number };

export function CryTagWidget({ stats }: { stats: CryTagData[] }) {
    if (stats.length === 0) return null;

    const total = stats.reduce((sum, item) => sum + item.count, 0);
    const dominant = [...stats].sort((a, b) => b.count - a.count)[0];

    const getIcon = (tag: string, className: string) => {
        if (tag === "safe") return <ShieldCheck className={`w-4 h-4 ${className}`} />;
        if (tag === "bittersweet") return <Smile className={`w-4 h-4 ${className}`} />;
        return <CloudRain className={`w-4 h-4 ${className}`} />;
    };

    const getLabel = (tag: string) => {
        if (tag === "safe") return "Безопасно";
        if (tag === "bittersweet") return "Слёзы счастья";
        return "Рыдай";
    };

    const getColor = (tag: string) => {
        if (tag === "safe") return "text-green-400";
        if (tag === "bittersweet") return "text-yellow-400";
        return "text-blue-400";
    };

    const getBgColor = (tag: string) => {
        if (tag === "safe") return "bg-green-400";
        if (tag === "bittersweet") return "bg-yellow-400";
        return "bg-blue-400";
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface hover:bg-border/30 transition-colors text-xs font-medium">
                    {getIcon(dominant.cryTag, getColor(dominant.cryTag))}
                    <span>{getLabel(dominant.cryTag)}</span>
                    <span className="text-muted tabular-nums">({dominant.count})</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-semibold mb-3">Настроение зрителей</h4>
                <div className="space-y-3">
                    {stats.map((s) => {
                        const percent = Math.round((s.count / total) * 100);
                        return (
                            <div key={s.cryTag} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        {getIcon(s.cryTag, getColor(s.cryTag))}
                                        {getLabel(s.cryTag)}
                                    </span>
                                    <span className="text-muted tabular-nums">{s.count} ({percent}%)</span>
                                </div>
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className={`h-full ${getBgColor(s.cryTag)}`} style={{ width: `${percent}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}