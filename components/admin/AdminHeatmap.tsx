"use client";

import { useState } from "react";
import { Tooltip } from "@/components/Tooltip";

type Activity = {
    date: string;
    level: number;
    episodes: number;
    dramaTitle: string;
};

export function AdminHeatmap({ activities }: { activities: Activity[] }) {
    const [filter, setFilter] = useState<"all" | "me">("all");
    const weeks = Array.from({ length: 52 }, (_, i) => i);

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === "all" ? "bg-accent text-white" : "bg-background text-muted hover:text-foreground"}`}
                >
                    Вся команда
                </button>
                <button
                    onClick={() => setFilter("me")}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === "me" ? "bg-accent text-white" : "bg-background text-muted hover:text-foreground"}`}
                >
                    Только я
                </button>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {weeks.map((week) => (
                    <div key={week} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, day) => {
                            const level = (week * 7 + day) % 4;
                            return (
                                <Tooltip key={day} content="Нет данных (MVP)">
                                    <div
                                        className={`w-3 h-3 rounded-sm ${level === 0 ? "bg-background border border-border" :
                                            level === 1 ? "bg-green-900/40" :
                                                level === 2 ? "bg-green-700/60" :
                                                    level === 3 ? "bg-green-500/80" :
                                                        "bg-green-400"
                                            }`}
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted mt-2">Логи активности (Фаза 1 готова, тепловая карта в разработке)</p>
        </div>
    );
}