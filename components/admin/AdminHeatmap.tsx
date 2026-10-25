"use client";

import { useState, useMemo } from "react";
import { Tooltip } from "@/components/Tooltip";

type Activity = {
    date: string;
    level: number;
    episodes: number;
    dramaTitle: string;
    userIds: number[];
};

export function AdminHeatmap({
    activities,
    currentUserId
}: {
    activities: Activity[];
    currentUserId: number;
}) {
    const [filter, setFilter] = useState<"all" | "me">("all");

    // Фильтруем данные в зависимости от тумблера
    const filteredActivities = useMemo(() => {
        if (filter === "all") return activities;
        return activities.filter((a) => a.userIds.includes(currentUserId));
    }, [filter, activities, currentUserId]);

    // Создаем карту для быстрого поиска по дате (YYYY-MM-DD)
    const activityMap = useMemo(() => {
        const map = new Map<string, Activity>();
        filteredActivities.forEach((a) => map.set(a.date, a));
        return map;
    }, [filteredActivities]);

    // Генерируем сетку на 52 недели (365 дней) назад
    const weeks = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // Отступаем 364 дня назад

        // Выравниваем начало на воскресенье (или понедельник)
        const startDay = startDate.getDay(); // 0 - Вс, 1 - Пн и т.д.
        const offset = startDay === 0 ? 6 : startDay - 1; // Смещение для начала с понедельника
        startDate.setDate(startDate.getDate() - offset);

        const weeksArray: { date: Date; dateStr: string }[][] = [];
        let currentWeek: { date: Date; dateStr: string }[] = [];

        for (let i = 0; i < 7 * 53; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toISOString().slice(0, 10);

            currentWeek.push({ date: currentDate, dateStr });

            if (currentWeek.length === 7) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        }
        return weeksArray;
    }, []);

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
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day) => {
                            const activity = activityMap.get(day.dateStr);
                            const level = activity ? activity.level : 0;

                            // Форматируем дату для тултипа (например, "25 окт 2026")
                            const displayDate = day.date.toLocaleDateString("ru-RU", { day: 'numeric', month: 'short', year: 'numeric' });
                            const tooltipContent = activity
                                ? `${displayDate}: ${activity.episodes} действий (${activity.dramaTitle})`
                                : `${displayDate}: Нет активности`;

                            return (
                                <Tooltip key={day.dateStr} content={tooltipContent}>
                                    <div
                                        className={`w-3 h-3 rounded-sm transition-colors ${level === 0 ? "bg-background border border-border hover:border-accent/40" :
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
        </div>
    );
}