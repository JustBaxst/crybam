"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, Filter, Check } from "lucide-react";

type Option = { id?: number; name: string };

export function CatalogToolbar({ allGenres, allMoods, allThemes, allCountries }: { allGenres: Option[]; allMoods: Option[]; allThemes: Option[]; allCountries: string[]; }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getArrayParam = (key: string) => searchParams.get(key)?.split(",").filter(Boolean) || [];

    const genreIds = getArrayParam("genre");
    const moods = getArrayParam("mood");
    const themes = getArrayParam("theme");
    const statuses = getArrayParam("status");
    const countries = getArrayParam("country");
    const currentEpisodes = searchParams.get("episodes");
    const currentSort = searchParams.get("sort") || "year_desc";

    const toggleParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let current = getArrayParam(key);

        if (current.includes(value)) {
            current = current.filter(v => v !== value);
        } else {
            current.push(value);
        }

        if (current.length > 0) params.set(key, current.join(","));
        else params.delete(key);

        router.push(`/dramas?${params.toString()}`);
    };

    const setParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value); else params.delete(key);
        router.push(`/dramas?${params.toString()}`);
    };

    return (
        // Убрали рамки и фон, оставили только flex-контейнер
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted mr-2"><Filter className="w-4 h-4" /> Фильтры:</div>

                {/* Жанр */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${genreIds.length ? "border-accent text-accent" : ""}`}>
                            Жанр {genreIds.length > 0 && `(${genreIds.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allGenres.map((g) => (
                            <DropdownMenuItem key={g.id} onClick={() => toggleParam("genre", String(g.id))} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0" title={g.name}>{g.name}</span>
                                {genreIds.includes(String(g.id)) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Настроение */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${moods.length ? "border-accent text-accent" : ""}`}>
                            Настроение {moods.length > 0 && `(${moods.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allMoods.map((m) => (
                            <DropdownMenuItem key={m.name} onClick={() => toggleParam("mood", m.name)} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0" title={m.name}>{m.name}</span>
                                {moods.includes(m.name) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Тема */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${themes.length ? "border-accent text-accent" : ""}`}>
                            Тема {themes.length > 0 && `(${themes.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allThemes.map((t) => (
                            <DropdownMenuItem key={t.name} onClick={() => toggleParam("theme", t.name)} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0" title={`#${t.name}`}>#{t.name}</span>
                                {themes.includes(t.name) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Статус */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${statuses.length ? "border-accent text-accent" : ""}`}>
                            Статус {statuses.length > 0 && `(${statuses.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {[{ v: "released", l: "Вышел" }, { v: "ongoing", l: "Выходит" }, { v: "announced", l: "Анонс" }].map(s => (
                            <DropdownMenuItem key={s.v} onClick={() => toggleParam("status", s.v)} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="flex-1 min-w-0">{s.l}</span>
                                {statuses.includes(s.v) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Страна */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${countries.length ? "border-accent text-accent" : ""}`}>
                            Страна {countries.length > 0 && `(${countries.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allCountries.map((c) => (
                            <DropdownMenuItem key={c} onClick={() => toggleParam("country", c)} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0" title={c}>{c}</span>
                                {countries.includes(c) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Серии */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${currentEpisodes ? "border-accent text-accent" : ""}`}>
                            {currentEpisodes ? `${currentEpisodes} серий` : "Серии"} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem onClick={() => setParam("episodes", "1-12")} className="cursor-pointer flex justify-between">До 12 {currentEpisodes === "1-12" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("episodes", "13-20")} className="cursor-pointer flex justify-between">13–20 {currentEpisodes === "13-20" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("episodes", "21+")} className="cursor-pointer flex justify-between">21 и больше {currentEpisodes === "21+" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Сортировка */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted hover:text-foreground">
                            <ArrowUpDown className="w-4 h-4" />
                            {currentSort === "year_desc" ? "По году ↓" : currentSort === "year_asc" ? "По году ↑" : currentSort === "rating_desc" ? "По рейтингу" : currentSort === "title_asc" ? "По алфавиту" : currentSort === "episodes_desc" ? "По сериям ↓" : currentSort === "episodes_asc" ? "По сериям ↑" : currentSort === "random" ? "Случайно" : "Сортировка"}
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setParam("sort", "year_desc")} className="cursor-pointer">По году (новые)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "year_asc")} className="cursor-pointer">По году (старые)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "rating_desc")} className="cursor-pointer">По рейтингу</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "title_asc")} className="cursor-pointer">По алфавиту</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "episodes_desc")} className="cursor-pointer">По сериям (больше)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "episodes_asc")} className="cursor-pointer">По сериям (меньше)</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "random")} className="cursor-pointer text-accent">🎲 Случайно</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}