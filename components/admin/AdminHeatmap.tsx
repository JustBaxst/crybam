"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DayActivity = {
    date: string;
    level: number;
    episodes?: number; // в админке это количество действий
    dramaTitle?: string;
    userIds?: number[]; // ID пользователей, сделавших действие
};

type Props = {
    activities: DayActivity[];
    currentUserId: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const CELL = 12;      // w-3 = 12px
const GAP = 4;        // обычный отступ
const MONTH_GAP = 10; // отступ в начале нового месяца

function toKey(d: Date) {
    return d.toISOString().slice(0, 10);
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

    // Фильтруем данные в зависимости от тумблера
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

        const startDay = (start.getDay() + 6) % 7; // Пн=0
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
    }, [year, yearActivities]);

    return (
        <div className="relative">
            {/* Тумблер фильтрации */}
            <div className="flex items-center gap-2 mb-4">
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

            {/* Шапка: переключатель года + сумма */}
            <div className="flex items-center mb-3 pl-10 gap-3">
                <button
                    onClick={() => {
                        const i = years.indexOf(year);
                        if (i < years.length - 1) setYear(years[i + 1]);
                    }}
                    disabled={year === years[years.length - 1]}
                    className="w-6 h-6 rounded-md border border-border hover:border-accent/40 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-semibold text-accent min-w-[44px] text-center">
                    {year}
                </span>
                <button
                    onClick={() => {
                        const i = years.indexOf(year);
                        if (i > 0) setYear(years[i - 1]);
                    }}
                    disabled={year === years[0]}
                    className="w-6 h-6 rounded-md border border-border hover:border-accent/40 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm text-muted">
                    · <span className="text-accent font-medium">{totalActions}</span> действий
                </span>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
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
                        <div className="flex flex-col gap-1 pr-2">
                            {DAY_LABELS.map((label, i) => (
                                <div
                                    key={i}
                                    className="h-3 text-[10px] text-muted leading-3 w-7 text-right"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>

                        <div className="flex">
                            {weeks.map((week, wi) => (
                                <div
                                    key={wi}
                                    className="flex flex-col gap-1"
                                    style={{
                                        marginLeft:
                                            wi === 0 ? 0 : week.monthStart !== null ? MONTH_GAP : GAP,
                                    }}
                                >
                                    {week.cells.map((day, di) => {
                                        if (!day) return <div key={di} className="w-3 h-3" />;
                                        return (
                                            <div
                                                key={di}
                                                className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${levelClass(day.level)}`}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const parent = e.currentTarget
                                                        .closest(".relative")!
                                                        .getBoundingClientRect();
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
                    <div key={l} className={`w-3 h-3 rounded-sm ${levelClass(l)}`} />
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
                                {hovered.activity.dramaTitle && <> · {hovered.activity.dramaTitle}</>}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}