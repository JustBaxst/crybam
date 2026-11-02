"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown, Filter, Check } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

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

                {/* Агентство с поиском */}
                <SearchableSelect
                    options={allAgencies.map(a => ({ id: a, label: a }))}
                    selectedValues={agencies}
                    onToggle={(val) => toggleParam("agency", val)}
                    placeholder="Поиск агентства..."
                    buttonLabel="Агентство"
                />

                {/* Возраст */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${currentAge ? "border-accent text-accent" : ""}`}>
                            {currentAge ? currentAge.replace("_", "-") : "Возраст"} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {[{ v: "under_25", l: "До 25" }, { v: "25_35", l: "25-35" }, { v: "35_45", l: "35-45" }, { v: "over_45", l: "45+" }].map(o => (
                            <DropdownMenuItem
                                key={o.v}
                                onClick={() => setParam("age", currentAge === o.v ? null : o.v)}
                                className="cursor-pointer flex justify-between"
                            >
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

                {/* Национальность с поиском */}
                <SearchableSelect
                    options={allNationalities.map(n => ({ id: n, label: n }))}
                    selectedValues={nationalities}
                    onToggle={(val) => toggleParam("nationality", val)}
                    placeholder="Поиск страны..."
                    buttonLabel="Национальность"
                />

                {/* Знак зодиака с поиском */}
                <SearchableSelect
                    options={allZodiacs.map(z => ({ id: z, label: z }))}
                    selectedValues={zodiacs}
                    onToggle={(val) => toggleParam("zodiac", val)}
                    placeholder="Поиск знака..."
                    buttonLabel="Знак"
                />

                {/* Дорама с поиском */}
                <SearchableSelect
                    options={allDramas.map(d => ({ id: String(d.id), label: d.title }))}
                    selectedValues={dramaIds}
                    onToggle={(val) => toggleParam("dramaId", val)}
                    placeholder="Поиск дорамы..."
                    buttonLabel="Дорама"
                />
            </div>

            {/* Сортировка с галочками */}
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
                        <DropdownMenuItem onClick={() => setParam("sort", "name_asc")} className="cursor-pointer flex justify-between">По имени (А-Я) {currentSort === "name_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "name_desc")} className="cursor-pointer flex justify-between">По имени (Я-А) {currentSort === "name_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "age_asc")} className="cursor-pointer flex justify-between">По возрасту (моложе) {currentSort === "age_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "age_desc")} className="cursor-pointer flex justify-between">По возрасту (старше) {currentSort === "age_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "roles_desc")} className="cursor-pointer flex justify-between">По ролям (больше) {currentSort === "roles_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "roles_asc")} className="cursor-pointer flex justify-between">По ролям (меньше) {currentSort === "roles_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}