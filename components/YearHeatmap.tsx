"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Activity, Film, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getActionLabel } from "@/lib/action-labels";
import { Tooltip } from "@/components/Tooltip";

type DramaItem = { title: string; episodes: number };
type AdminEvent = {
  userName: string;
  action: string;
  entityName: string;
  userId: number;
};

type DayActivity = {
  date: string;
  level: number;
  episodes?: number; // Для пользователя (серии)
  totalActions?: number; // Для админки (действия)
  items?: DramaItem[]; // Для пользователя
  events?: AdminEvent[]; // Для админки
  userIds?: number[];
};

type Props = {
  activities: DayActivity[];
  mode?: "user" | "admin";
  currentUserId?: number; // Нужен только для админки
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_LABELS = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];
const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const CELL = 12;
const GAP = 4;
const MONTH_GAP = 10;

function toKey(d: Date) {
  return d.toLocaleDateString("sv-SE");
}

function levelClass(level: number) {
  switch (level) {
    case 0:
      return "bg-transparent border border-border/60";
    case 1:
      return "bg-accent/25 border border-transparent";
    case 2:
      return "bg-accent/50 border border-transparent";
    case 3:
      return "bg-accent/75 border border-transparent";
    case 4:
      return "bg-accent border border-transparent";
    default:
      return "bg-transparent border border-border/60";
  }
}

export function YearHeatmap({
  activities,
  mode = "user",
  currentUserId,
}: Props) {
  const [filter, setFilter] = useState<"all" | "me">("all");

  // Фильтрация для админки
  const filteredActivities = useMemo(() => {
    if (mode !== "admin" || filter === "all") return activities;
    return activities
      .map((a) => ({
        ...a,
        events: a.events?.filter((e) => e.userId === currentUserId),
      }))
      .filter((a) => a.events && a.events.length > 0);
  }, [mode, filter, activities, currentUserId]);

  const years = useMemo(() => {
    const set = new Set<number>();
    for (const a of filteredActivities) {
      set.add(new Date(a.date).getFullYear());
    }
    set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [filteredActivities]);

  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());

  const yearActivities = useMemo(
    () =>
      filteredActivities.filter((a) => new Date(a.date).getFullYear() === year),
    [filteredActivities, year],
  );

  const totalCount = useMemo(
    () =>
      yearActivities.reduce(
        (sum, a) =>
          sum + (a.events?.length || a.totalActions || a.episodes || 0),
        0,
      ),
    [yearActivities],
  );

  const { weeks, monthPositions } = useMemo(() => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const startDay = (start.getDay() + 6) % 7;
    const firstCell = new Date(start.getTime() - startDay * DAY_MS);
    const totalDays =
      Math.round((end.getTime() - firstCell.getTime()) / DAY_MS) + 1;
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
      if (wi > 0) x += week.monthStart !== null ? MONTH_GAP : GAP;
      if (week.monthStart !== null)
        monthPositions.push({ label: MONTH_LABELS[week.monthStart], x });
      x += CELL;
    });

    return { weeks, monthPositions };
  }, [yearActivities, year]);

  const prevYear = years.find((y) => y > year);
  const nextYear = [...years].reverse().find((y) => y < year);

  return (
    <div className="relative w-full">
      {/* Шапка с управлением */}
      <div
        className={`flex items-center justify-between mb-4 flex-wrap gap-2 ${mode === "user" ? "pl-10" : ""}`}
      >
        {/* Переключатель (только для админа) */}
        {mode === "admin" ? (
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
        ) : (
          <div /> // Пустая заглушка для Flexbox
        )}

        {/* Переключатель годов */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => prevYear && setYear(prevYear)}
            disabled={!prevYear}
            className="w-6 h-6 rounded-md border border-border hover:border-accent/40 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-semibold text-accent min-w-44px text-center">
            {year}
          </span>
          <button
            onClick={() => nextYear && setYear(nextYear)}
            disabled={!nextYear}
            className="w-6 h-6 rounded-md border border-border hover:border-accent/40 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm text-muted">
            · <span className="text-accent font-medium">{totalCount}</span>{" "}
            {mode === "admin" ? "действ." : "серий"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
            <div className="flex flex-col gap-1 pr-2 shrink-0">
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
                    if (!day)
                      return (
                        <div key={di} style={{ width: CELL, height: CELL }} />
                      );

                    // Берем количество из events (для админа) или episodes (для юзера)
                    const count =
                      day.events?.length ||
                      day.totalActions ||
                      day.episodes ||
                      0;
                    const unit = mode === "admin" ? "действ." : "сер.";
                    const dateStr = new Date(day.date).toLocaleDateString(
                      "ru-RU",
                      { day: "numeric", month: "long" },
                    );
                    const tooltipText =
                      day.level === 0
                        ? `${dateStr} · нет активности`
                        : `${dateStr} · ${count} ${unit}`;

                    const isLevel0 = day.level === 0;
                    const cellHover = isLevel0
                      ? "hover:border-accent/50 hover:bg-accent/5"
                      : "";

                    return (
                      <Popover key={di}>
                        <Tooltip content={tooltipText}>
                          <PopoverTrigger asChild>
                            <button
                              className={`rounded-sm transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background hover:scale-125 hover:ring-1 hover:ring-accent ${cellHover} ${levelClass(day.level)}`}
                              style={{ width: CELL, height: CELL }}
                              aria-label={`Активность за ${day.date}`}
                            />
                          </PopoverTrigger>
                        </Tooltip>
                        <PopoverContent className="w-72 p-0" align="center">
                          <div className="px-3 py-2 border-b border-border/50 bg-surface/50 rounded-t-xl">
                            <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                              <span>
                                {new Date(day.date).toLocaleDateString(
                                  "ru-RU",
                                  { day: "numeric", month: "long" },
                                )}
                              </span>
                              <span className="text-muted font-normal">
                                {count} {unit}
                              </span>
                            </div>
                          </div>

                          <div className="p-2">
                            {day.level === 0 ? (
                              <div className="text-xs text-muted text-center py-4 italic">
                                Нет активности
                              </div>
                            ) : (
                              <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5">
                                {/* Рендер для ПОЛЬЗОВАТЕЛЯ (Дорамы) */}
                                {mode === "user" &&
                                  day.items?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2 text-xs p-1.5 rounded-md hover:bg-accent/5"
                                    >
                                      <Film className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                      <div className="leading-tight">
                                        <span className="font-medium text-foreground">
                                          {item.title}
                                        </span>
                                        <span className="text-muted">
                                          {" "}
                                          · {item.episodes} сер.
                                        </span>
                                      </div>
                                    </div>
                                  ))}

                                {/* Рендер для АДМИНА (Действия) */}
                                {mode === "admin" &&
                                  day.events?.map((e, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2 text-xs p-1.5 rounded-md hover:bg-accent/5"
                                    >
                                      <Activity className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                      <div className="leading-tight">
                                        <span className="font-medium text-foreground">
                                          {e.userName}
                                        </span>{" "}
                                        <span className="text-muted">
                                          {getActionLabel(e.action)}
                                        </span>{" "}
                                        <span className="text-accent">
                                          «{e.entityName}»
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
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
          <div
            key={l}
            className={`rounded-sm ${levelClass(l)}`}
            style={{ width: CELL, height: CELL }}
          />
        ))}
        <span>больше</span>
      </div>
    </div>
  );
}
