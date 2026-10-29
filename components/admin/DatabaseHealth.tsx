"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type StatGroup = { total: number; green: number; yellow: number; red: number };

export function DatabaseHealth({
    dramas,
    persons,
    characters
}: {
    dramas: StatGroup;
    persons: StatGroup;
    characters: StatGroup;
}) {
    const [tab, setTab] = useState<"all" | "dramas" | "persons" | "characters">("all");

    const allStats = {
        total: dramas.total + persons.total + characters.total,
        green: dramas.green + persons.green + characters.green,
        yellow: dramas.yellow + persons.yellow + characters.yellow,
        red: dramas.red + persons.red + characters.red,
    };

    const currentStats = tab === "all" ? allStats : tab === "dramas" ? dramas : tab === "persons" ? persons : characters;
    const baseUrl = tab === "all" ? "/admin/dramas" : tab === "dramas" ? "/admin/dramas" : tab === "persons" ? "/admin/people" : "/admin/characters";

    const safeTotal = currentStats.total || 1;
    const greenPct = Math.round((currentStats.green / safeTotal) * 100);
    const yellowPct = Math.round((currentStats.yellow / safeTotal) * 100);
    const redPct = Math.round((currentStats.red / safeTotal) * 100);

    return (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col h-full">
            {/* Шапка с табами */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    Здоровье базы данных
                </h2>

                <div className="flex items-center gap-1 bg-background border border-border p-1 rounded-lg">
                    {[
                        { id: "all", label: "Все" },
                        { id: "dramas", label: "Дорамы" },
                        { id: "persons", label: "Актеры" },
                        { id: "characters", label: "Персонажи" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t.id ? "bg-surface shadow text-foreground" : "text-muted hover:text-foreground"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Центральный блок: огромная цифра и толстый прогресс-бар */}
            <div className="flex-1 flex flex-col justify-center py-4">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-4xl font-bold tabular-nums text-foreground">{currentStats.total}</p>
                        <p className="text-xs text-muted uppercase tracking-wider font-semibold mt-1">Всего объектов</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">{greenPct}%</p>
                        <p className="text-xs text-muted font-medium">заполнено</p>
                    </div>
                </div>

                {/* Толстый прогресс-бар */}
                <div className="w-full h-6 rounded-lg bg-background border border-border overflow-hidden flex shadow-inner relative group">
                    <div
                        style={{ width: `${greenPct}%` }}
                        className="bg-green-500 h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"
                        title={`Готово: ${currentStats.green}`}
                    >
                        {greenPct > 10 ? `${greenPct}%` : ''}
                    </div>
                    <div style={{ width: `${yellowPct}%` }} className="bg-yellow-500 h-full transition-all" title={`В процессе: ${currentStats.yellow}`} />
                    <div style={{ width: `${redPct}%` }} className="bg-red-500 h-full transition-all" title={`Требуют внимания: ${currentStats.red}`} />
                </div>
            </div>

            {/* Плашки со счётчиками внизу */}
            <div className="grid grid-cols-3 gap-3 mt-auto pt-4">
                <Link href={`${baseUrl}?filter=green`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-green-500/50 transition-colors text-center group">
                    <span className="text-2xl font-bold text-green-500">{currentStats.green}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold group-hover:text-foreground transition-colors">Готовы</span>
                </Link>

                <Link href={`${baseUrl}?filter=yellow`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-yellow-500/50 transition-colors text-center group">
                    <span className="text-2xl font-bold text-yellow-500">{currentStats.yellow}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold group-hover:text-foreground transition-colors">В процессе</span>
                </Link>

                <Link href={`${baseUrl}?filter=red`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-red-500/50 transition-colors text-center group">
                    <span className="text-2xl font-bold text-red-500">{currentStats.red}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold group-hover:text-foreground transition-colors">Требуют внимания</span>
                </Link>
            </div>
        </div>
    );
}