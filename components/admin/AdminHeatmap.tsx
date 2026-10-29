"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActionLabel } from "@/lib/action-labels";

type DayActivity = {
    date: string;
    level: number;
    episodes?: number;
    dramaTitle?: string;
    userIds?: number[];
};

type Props = {
    activities: DayActivity[];
    currentUserId: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const CELL = 12;      // 12px (как на главной)
const GAP = 2;        // 2px
const MONTH_GAP = 8;  // 8px (отступ между месяцами)

function toKey(d: Date) {
    return d.toLocaleDateString("sv-SE"); // ← Локальная дата для соответствия группировке
}

function levelClass(level: number) {
    switch (level) {
        case 0: return "bg-border/40";
        case 1: return "bg-accent/25";
        case 2: return "bg-accent/50";
        case 3: return "bg-accent/75";
        case 4: return "bg-accent";
        default: return "bg-border/40";
    }
}

export function AdminHeatmap({ activities, currentUserId }: Props) {
    const [filter, setFilter] = useState<"all" | "me">("all");

    const filteredActivities = useMemo(() => {
        if (filter === "all") return activities;
        return activities.filter((a) => a.userIds?.includes(currentUserId));
    }, [filter, activities, currentUserId]);

    const years = useMemo(() => {
        const set = new Set<number>();
        for (const a of filteredActivities) {
            set.add(new Date(a.date).getFullYear());
        }
        set.add(new Date().getFullYear());
        return Array.from(set).sort((a, b) => b - a);
    }, [filteredActivities]);

    const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
    const [hovered, setHovered] = useState<{
        activity: DayActivity;
        x: number;
        y: number;
    } | null>(null);

    const yearActivities = useMemo(
        () => filteredActivities.filter((a) => new Date(a.date).getFullYear() === year),
        [filteredActivities, year]
    );

    const totalActions = useMemo(
        () => yearActivities.reduce((sum, a) => sum + (a.episodes ?? 0), 0),
        [yearActivities]
    );

    const { weeks, monthPositions } = useMemo(() => {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);

        const startDay = (start.getDay() + 6) % 7;
        const firstCell = new Date(start.getTime() - startDay * DAY_MS);
        const totalDays = Math.round((end.getTime() - firstCell.getTime()) / DAY_MS) + 1;
        const weekCount = Math.ceil(totalDays / 7);

        const activityMap = new Map<string, DayActivity>();
        for (const a of yearActivities) activityMap.set(a.date, a);

        const weeks: {
            cells: (DayActivity | null)[];
            monthStart: number | null;
        }[] = [];
        let lastMonth = -1;

        for (let w = 0; w < weekCount; w++) {
            const cells: (DayActivity | null)[] = [];
            let monthStart: number | null = null;

            for (let d = 0; d < 7; d++) {
                const cellDate = new Date(firstCell.getTime() + (w * 7 + d) * DAY_MS);
                if (cellDate.getFullYear() !== year) {
                    cells.push(null);
                } else {
                    const key = toKey(cellDate);
                    const act = activityMap.get(key);
                    cells.push(act ?? { date: key, level: 0 });

                    if (cellDate.getDate() === 1 && cellDate.getMonth() !== lastMonth) {
                        monthStart = cellDate.getMonth();
                        lastMonth = cellDate.getMonth();
                    }
                }
            }

            weeks.push({ cells, monthStart });
        }

        // Точная математика отступов (как в YearHeatmap на главной)
        const monthPositions: { label: string; x: number }[] = [];
        let x = 0;
        weeks.forEach((week, wi) => {
            if (wi > 0) {
                x += week.monthStart !== null ? MONTH_GAP : GAP;
            }
            if (week.monthStart !== null) {
                monthPositions.push({ label: MONTH_LABELS[week.monthStart], x });
            }
            x += CELL;
        });

        return { weeks, monthPositions };
    }, [yearActivities, year]);

    const prevYear = years.find((y) => y > year);
    const nextYear = [...years].reverse().find((y) => y < year);

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === "all" ? "bg-accent text-white" : "bg-background border border-border text-muted hover:text-foreground"}`}
                    >
                        Вся команда
                    </button>
                    <button
                        onClick={() => setFilter("me")}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === "me" ? "bg-accent text-white" : "bg-background border border-border text-muted hover:text-foreground"}`}
                    >
                        Только я
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {prevYear && (
                        <button
                            onClick={() => setYear(prevYear)}
                            className="p-1 rounded-lg hover:bg-foreground/5 transition-colors text-muted hover:text-foreground"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    <span className="font-medium text-sm w-12 text-center text-accent">{year}</span>
                    {nextYear && (
                        <button
                            onClick={() => setYear(nextYear)}
                            className="p-1 rounded-lg hover:bg-foreground/5 transition-colors text-muted hover:text-foreground"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                    <span className="text-xs text-muted ml-1">
                        · {totalActions} {totalActions === 1 ? "действие" : "действий"}
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                <div className="inline-block min-w-full">
                    {/* Подписи месяцев */}
                    <div className="relative h-4 mb-1.5" style={{ paddingLeft: 40 }}>
                        {monthPositions.map((m, i) => (
                            <div
                                key={i}
                                className="absolute text-[10px] text-muted font-medium"
                                style={{ left: `${40 + m.x}px` }}
                            >
                                {m.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex">
                        {/* Дни недели */}
                        <div className="flex flex-col gap-0.5 pr-2 shrink-0">
                            {DAY_LABELS.map((label, i) => (
                                <div
                                    key={i}
                                    className="h-3 text-[10px] text-muted leading-3 w-7 text-right"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Сетка */}
                        <div className="flex">
                            {weeks.map((week, wi) => (
                                <div
                                    key={wi}
                                    className="flex flex-col gap-0.5"
                                    style={{
                                        marginLeft: wi === 0 ? 0 : week.monthStart !== null ? MONTH_GAP : GAP,
                                    }}
                                >
                                    {week.cells.map((day, di) => {
                                        if (!day) return <div key={di} style={{ width: CELL, height: CELL }} />;
                                        return (
                                            <div
                                                key={di}
                                                className={`rounded-sm cursor-pointer transition-colors ${levelClass(day.level)}`}
                                                style={{ width: CELL, height: CELL }}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const parent = e.currentTarget.closest(".relative")!.getBoundingClientRect();
                                                    setHovered({
                                                        activity: day,
                                                        x: rect.left - parent.left + rect.width / 2,
                                                        y: rect.top - parent.top,
                                                    });
                                                }}
                                                onMouseLeave={() => setHovered(null)}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3 pl-10 text-[10px] text-muted">
                <span>меньше</span>
                {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className={`rounded-sm ${levelClass(l)}`} style={{ width: CELL, height: CELL }} />
                ))}
                <span>больше</span>
            </div>

            {hovered && (
                <div
                    className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full mb-2 px-3 py-2 rounded-lg border border-border bg-surface shadow-xl text-xs whitespace-nowrap"
                    style={{ left: hovered.x, top: hovered.y }}
                >
                    {hovered.activity.level === 0 ? (
                        <span className="text-muted">
                            {new Date(hovered.activity.date).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "long",
                            })}{" "}
                            · нет активности
                        </span>
                    ) : (
                        <>
                            <div className="font-medium">
                                {new Date(hovered.activity.date).toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "long",
                                })}
                            </div>
                            <div className="text-muted mt-0.5">
                                {hovered.activity.episodes}{" "}
                                {hovered.activity.episodes === 1 ? "действие" : "действий"}
                                {/* Переводим технические названия на русский */}
                                {hovered.activity.dramaTitle && (
                                    <> · {hovered.activity.dramaTitle.split(", ").map(a => getActionLabel(a)).join(", ")}</>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}