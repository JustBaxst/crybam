"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, Filter, Check } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted mr-2"><Filter className="w-4 h-4" /> Фильтры:</div>

                {/* Жанр с поиском */}
                <SearchableSelect
                    options={allGenres.map(g => ({ id: String(g.id), label: g.name }))}
                    selectedValues={genreIds}
                    onToggle={(val) => toggleParam("genre", val)}
                    placeholder="Поиск жанра..."
                    buttonLabel="Жанр"
                />

                {/* Настроение с поиском */}
                <SearchableSelect
                    options={allMoods.map(m => ({ id: m.name, label: m.name }))}
                    selectedValues={moods}
                    onToggle={(val) => toggleParam("mood", val)}
                    placeholder="Поиск настроения..."
                    buttonLabel="Настроение"
                />

                {/* Тема с поиском */}
                <SearchableSelect
                    options={allThemes.map(t => ({ id: t.name, label: t.name }))}
                    selectedValues={themes}
                    onToggle={(val) => toggleParam("theme", val)}
                    placeholder="Поиск темы..."
                    buttonLabel="Тема"
                />

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

                {/* Страна с поиском */}
                <SearchableSelect
                    options={allCountries.map(c => ({ id: c, label: c }))}
                    selectedValues={countries}
                    onToggle={(val) => toggleParam("country", val)}
                    placeholder="Поиск страны..."
                    buttonLabel="Страна"
                />

                {/* Серии */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${currentEpisodes ? "border-accent text-accent" : ""}`}>
                            {currentEpisodes ? `${currentEpisodes} серий` : "Серии"} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem
                            onClick={() => setParam("episodes", currentEpisodes === "1-12" ? null : "1-12")}
                            className="cursor-pointer flex justify-between"
                        >
                            До 12 {currentEpisodes === "1-12" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setParam("episodes", currentEpisodes === "13-20" ? null : "13-20")}
                            className="cursor-pointer flex justify-between"
                        >
                            13–20 {currentEpisodes === "13-20" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setParam("episodes", currentEpisodes === "21+" ? null : "21+")}
                            className="cursor-pointer flex justify-between"
                        >
                            21 и больше {currentEpisodes === "21+" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Сортировка с галочками */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted hover:text-foreground">
                            <ArrowUpDown className="w-4 h-4" />
                            {currentSort === "year_desc" ? "По году ↓" :
                                currentSort === "year_asc" ? "По году ↑" :
                                    currentSort === "rating_desc" ? "По рейтингу ↓" :
                                        currentSort === "rating_asc" ? "По рейтингу ↑" :
                                            currentSort === "title_asc" ? "По алфавиту (А-Я)" :
                                                currentSort === "title_desc" ? "По алфавиту (Я-А)" :
                                                    currentSort === "episodes_desc" ? "По сериям ↓" :
                                                        currentSort === "episodes_asc" ? "По сериям ↑" :
                                                            currentSort === "random" ? "Случайно" : "Сортировка"}
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setParam("sort", "year_desc")} className="cursor-pointer flex justify-between">
                            По году (новые) {currentSort === "year_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "year_asc")} className="cursor-pointer flex justify-between">
                            По году (старые) {currentSort === "year_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => setParam("sort", "rating_desc")} className="cursor-pointer flex justify-between">
                            По рейтингу (высокий) {currentSort === "rating_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "rating_asc")} className="cursor-pointer flex justify-between">
                            По рейтингу (низкий) {currentSort === "rating_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => setParam("sort", "title_asc")} className="cursor-pointer flex justify-between">
                            По алфавиту (А-Я) {currentSort === "title_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "title_desc")} className="cursor-pointer flex justify-between">
                            По алфавиту (Я-А) {currentSort === "title_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => setParam("sort", "episodes_desc")} className="cursor-pointer flex justify-between">
                            По сериям (больше) {currentSort === "episodes_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "episodes_asc")} className="cursor-pointer flex justify-between">
                            По сериям (меньше) {currentSort === "episodes_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => setParam("sort", "random")} className="cursor-pointer flex justify-between text-accent">
                            🎲 Случайно {currentSort === "random" && <Check className="w-4 h-4 text-accent shrink-0" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}