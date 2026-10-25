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

    // Проценты для прогресс-бара
    const safeTotal = currentStats.total || 1;
    const greenPct = (currentStats.green / safeTotal) * 100;
    const yellowPct = (currentStats.yellow / safeTotal) * 100;
    const redPct = (currentStats.red / safeTotal) * 100;

    return (
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-5 flex flex-col shadow-sm h-full">
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

            {/* Прогресс-бар с процентами */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-muted mb-2 font-medium">
                    <span>Общий прогресс заполнения</span>
                    <span className="text-green-500">{Math.round(greenPct)}% Готово</span>
                </div>
                <div className="w-full h-3 rounded-full bg-background border border-border overflow-hidden flex">
                    <div style={{ width: `${greenPct}%` }} className="bg-green-500 h-full transition-all" title={`Готово: ${currentStats.green}`} />
                    <div style={{ width: `${yellowPct}%` }} className="bg-yellow-500 h-full transition-all" title={`В процессе: ${currentStats.yellow}`} />
                    <div style={{ width: `${redPct}%` }} className="bg-red-500 h-full transition-all" title={`Сломаны: ${currentStats.red}`} />
                </div>
            </div>

            {/* Плашки со счётчиками (заполняют низ карточки) */}
            <div className="grid grid-cols-3 gap-3 mt-auto">
                <Link href={`${baseUrl}?filter=green`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-green-500/50 transition-colors">
                    <span className="text-2xl font-bold text-green-500">{currentStats.green}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold">Готовы</span>
                </Link>

                <Link href={`${baseUrl}?filter=yellow`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-yellow-500/50 transition-colors">
                    <span className="text-2xl font-bold text-yellow-500">{currentStats.yellow}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold">В процессе</span>
                </Link>

                <Link href={`${baseUrl}?filter=red`} className="flex flex-col p-3 rounded-xl border border-border bg-background hover:border-red-500/50 transition-colors">
                    <span className="text-2xl font-bold text-red-500">{currentStats.red}</span>
                    <span className="text-[10px] text-muted mt-1 uppercase tracking-wider font-semibold">Требуют внимания</span>
                </Link>
            </div>
        </div>
    );
}