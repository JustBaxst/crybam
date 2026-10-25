"use client";

import { useState } from "react";
import Link from "next/link";

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

    // Логика подсчета для "Все" (сумма всех сущностей)
    const allStats = {
        total: dramas.total + persons.total + characters.total,
        green: dramas.green + persons.green + characters.green,
        yellow: dramas.yellow + persons.yellow + characters.yellow,
        red: dramas.red + persons.red + characters.red,
    };

    const currentStats = tab === "all" ? allStats : tab === "dramas" ? dramas : tab === "persons" ? persons : characters;

    // Ссылки для кликов по статусам
    const baseUrl = tab === "all" ? "/admin/dramas" : tab === "dramas" ? "/admin/dramas" : tab === "persons" ? "/admin/people" : "/admin/characters";

    return (
        <div className="md:col-span-2 rounded-2xl border border-border bg-surface p-6 flex flex-col justify-start shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        Здоровье базы данных
                    </h2>
                    {/* Табы */}
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
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${tab === t.id ? "bg-surface shadow text-foreground" : "text-muted hover:text-foreground"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Прогресс-бар */}
                <div className="w-full h-10 rounded-xl bg-background border border-border overflow-hidden flex mb-6 shadow-inner">
                    <div style={{ width: `${(currentStats.green / (currentStats.total || 1)) * 100}%` }} className="bg-green-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`Готово: ${currentStats.green}`}>
                        {(currentStats.green / (currentStats.total || 1)) * 100 > 5 ? `${Math.round((currentStats.green / (currentStats.total || 1)) * 100)}%` : ''}
                    </div>
                    <div style={{ width: `${(currentStats.yellow / (currentStats.total || 1)) * 100}%` }} className="bg-yellow-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`В процессе: ${currentStats.yellow}`}>
                        {(currentStats.yellow / (currentStats.total || 1)) * 100 > 5 ? `${Math.round((currentStats.yellow / (currentStats.total || 1)) * 100)}%` : ''}
                    </div>
                    <div style={{ width: `${(currentStats.red / (currentStats.total || 1)) * 100}%` }} className="bg-red-500/80 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all" title={`Сломаны: ${currentStats.red}`}>
                        {(currentStats.red / (currentStats.total || 1)) * 100 > 5 ? `${Math.round((currentStats.red / (currentStats.total || 1)) * 100)}%` : ''}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10 mt-auto pt-6">
                <Link href={`${baseUrl}?filter=green`} className="group p-4 rounded-xl border border-transparent hover:border-green-500/30 hover:bg-green-500/5 transition-all">
                    <p className="text-3xl font-bold text-green-500 group-hover:scale-105 transition-transform origin-left">{currentStats.green}</p>
                    <p className="text-xs text-muted mt-1 font-medium">Готовы</p>
                </Link>
                <Link href={`${baseUrl}?filter=yellow`} className="group p-4 rounded-xl border border-transparent hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all">
                    <p className="text-3xl font-bold text-yellow-500 group-hover:scale-105 transition-transform origin-left">{currentStats.yellow}</p>
                    <p className="text-xs text-muted mt-1 font-medium">В процессе</p>
                </Link>
                <Link href={`${baseUrl}?filter=red`} className="group p-4 rounded-xl border border-transparent hover:border-red-500/30 hover:bg-red-500/5 transition-all">
                    <p className="text-3xl font-bold text-red-500 group-hover:scale-105 transition-transform origin-left">{currentStats.red}</p>
                    <p className="text-xs text-muted mt-1 font-medium">Требуют внимания</p>
                </Link>
            </div>
        </div>
    );
}