"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CryTagData = { cryTag: string; count: number };

export function CryTagStats({ stats }: { stats: CryTagData[] }) {
    if (stats.length === 0) return null;

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="flex flex-col gap-4">
            {stats.map((stat) => {
                const percent = Math.round((stat.count / total) * 100);
                const config = CRY_TAGS[stat.cryTag as CryTag];

                if (!config) return null;
                const { Icon, label, color, bg } = config;

                return (
                    <div key={stat.cryTag} className="flex flex-col gap-1.5 w-full">

                        <div className="flex items-center justify-between text-sm">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className={`flex items-center gap-2 cursor-pointer hover:underline ${color}`}>
                                        <Icon className="w-4 h-4" />
                                        <span className="whitespace-nowrap font-medium">{label}</span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-4 bg-surface border border-border rounded-xl shadow-lg" align="start">
                                    <h4 className="text-sm font-semibold mb-3">Настроение зрителей</h4>
                                    <div className="space-y-3">
                                        {stats.map((s) => {
                                            const p = Math.round((s.count / total) * 100);
                                            const sConfig = CRY_TAGS[s.cryTag as CryTag];
                                            if (!sConfig) return null;
                                            const SIcon = sConfig.Icon;

                                            return (
                                                <div key={s.cryTag} className="space-y-1.5">
                                                    <div className="flex justify-between text-sm">
                                                        <span className={`flex items-center gap-1.5 font-medium ${sConfig.color}`}>
                                                            <SIcon className="w-4 h-4" />
                                                            {sConfig.label}
                                                        </span>
                                                        <span className="text-muted tabular-nums">{s.count} ({p}%)</span>
                                                    </div>
                                                    <div className="h-2 bg-border rounded-full overflow-hidden">
                                                        <div className={`h-full ${sConfig.bg}`} style={{ width: `${p}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <span className="text-foreground font-semibold tabular-nums">{percent}%</span>
                        </div>

                        <div className="w-full h-2.5 bg-surface border border-border/50 rounded-full overflow-hidden mt-0.5">
                            <div
                                className={`h-full ${bg} rounded-full transition-all duration-500`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                    </div>
                );
            })}
        </div>
    );
}