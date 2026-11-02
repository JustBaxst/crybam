"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowUpDown, Filter, Check } from "lucide-react";

export function PeopleToolbar({ allAgencies, allNationalities, allZodiacs, allDramas }: { allAgencies: string[]; allNationalities: string[]; allZodiacs: string[]; allDramas: { id: number, title: string }[]; }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const getArrayParam = (key: string) => searchParams.get(key)?.split(",").filter(Boolean) || [];

    const agencies = getArrayParam("agency");
    const nationalities = getArrayParam("nationality");
    const zodiacs = getArrayParam("zodiac");
    const genders = getArrayParam("gender");
    const dramaIds = getArrayParam("dramaId");
    const currentAge = searchParams.get("age");
    const currentSort = searchParams.get("sort") || "name_asc";

    const toggleParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let current = getArrayParam(key);
        if (current.includes(value)) current = current.filter(v => v !== value); else current.push(value);
        if (current.length > 0) params.set(key, current.join(",")); else params.delete(key);
        router.push(`/people?${params.toString()}`);
    };

    const setParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value); else params.delete(key);
        router.push(`/people?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted mr-2"><Filter className="w-4 h-4" /> Фильтры:</div>

                {/* Агентство */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${agencies.length ? "border-accent text-accent" : ""}`}>
                            Агентство {agencies.length > 0 && `(${agencies.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allAgencies.map((a) => (
                            <DropdownMenuItem key={a} onClick={() => toggleParam("agency", a)} className="cursor-pointer flex items-center justify-between gap-2">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0">{a}</span>
                                {agencies.includes(a) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Возраст */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${currentAge ? "border-accent text-accent" : ""}`}>
                            {currentAge ? currentAge.replace("_", "-") : "Возраст"} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {[{ v: "under_25", l: "До 25" }, { v: "25_35", l: "25-35" }, { v: "35_45", l: "35-45" }, { v: "over_45", l: "45+" }].map(o => (
                            <DropdownMenuItem key={o.v} onClick={() => setParam("age", o.v)} className="cursor-pointer flex justify-between">
                                {o.l} {currentAge === o.v && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Пол */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${genders.length ? "border-accent text-accent" : ""}`}>
                            Пол {genders.length > 0 && `(${genders.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        {[{ v: "male", l: "Мужской" }, { v: "female", l: "Женский" }].map(g => (
                            <DropdownMenuItem key={g.v} onClick={() => toggleParam("gender", g.v)} className="cursor-pointer flex justify-between">
                                {g.l} {genders.includes(g.v) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Национальность */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${nationalities.length ? "border-accent text-accent" : ""}`}>
                            Национальность {nationalities.length > 0 && `(${nationalities.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allNationalities.map((n) => (
                            <DropdownMenuItem key={n} onClick={() => toggleParam("nationality", n)} className="cursor-pointer flex justify-between">
                                {n} {nationalities.includes(n) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Знак зодиака */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${zodiacs.length ? "border-accent text-accent" : ""}`}>
                            Знак {zodiacs.length > 0 && `(${zodiacs.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 max-h-60 overflow-y-auto">
                        {allZodiacs.map((z) => (
                            <DropdownMenuItem key={z} onClick={() => toggleParam("zodiac", z)} className="cursor-pointer flex justify-between">
                                {z} {zodiacs.includes(z) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Дорама */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${dramaIds.length ? "border-accent text-accent" : ""}`}>
                            Дорама {dramaIds.length > 0 && `(${dramaIds.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-60 overflow-y-auto">
                        {allDramas.map((d) => (
                            <DropdownMenuItem key={d.id} onClick={() => toggleParam("dramaId", String(d.id))} className="cursor-pointer flex justify-between">
                                <span className="whitespace-normal text-left leading-snug flex-1 min-w-0">{d.title}</span>
                                {dramaIds.includes(String(d.id)) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Сортировка */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted hover:text-foreground">
                            <ArrowUpDown className="w-4 h-4" />
                            {currentSort === "name_asc" ? "По имени (А-Я)" : currentSort === "name_desc" ? "По имени (Я-А)" : currentSort === "age_asc" ? "По возрасту (моложе)" : currentSort === "age_desc" ? "По возрасту (старше)" : currentSort === "roles_desc" ? "По ролям (больше)" : currentSort === "roles_asc" ? "По ролям (меньше)" : "Сортировка"}
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setParam("sort", "name_asc")} className="cursor-pointer">По имени (А-Я)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "name_desc")} className="cursor-pointer">По имени (Я-А)</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "age_asc")} className="cursor-pointer">По возрасту (моложе)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "age_desc")} className="cursor-pointer">По возрасту (старше)</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "roles_desc")} className="cursor-pointer">По ролям (больше)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "roles_asc")} className="cursor-pointer">По ролям (меньше)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}