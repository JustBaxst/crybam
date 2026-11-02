"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown, Filter, Check } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";

export function CharactersToolbar({ allDramas, allPersons }: { allDramas: { id: number, title: string }[]; allPersons: { id: number, name: string }[]; }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const getArrayParam = (key: string) => searchParams.get(key)?.split(",").filter(Boolean) || [];

    const dramaIds = getArrayParam("dramaId");
    const roleTypes = getArrayParam("roleType");
    const personIds = getArrayParam("personId");
    const genders = getArrayParam("gender");
    const currentSort = searchParams.get("sort") || "name_asc";

    const toggleParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let current = getArrayParam(key);
        if (current.includes(value)) current = current.filter(v => v !== value); else current.push(value);
        if (current.length > 0) params.set(key, current.join(",")); else params.delete(key);
        router.push(`/characters?${params.toString()}`);
    };

    const setParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value); else params.delete(key);
        router.push(`/characters?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted mr-2"><Filter className="w-4 h-4" /> Фильтры:</div>

                {/* Дорама с поиском */}
                <SearchableSelect
                    options={allDramas.map(d => ({ id: String(d.id), label: d.title }))}
                    selectedValues={dramaIds}
                    onToggle={(val) => toggleParam("dramaId", val)}
                    placeholder="Поиск дорамы..."
                    buttonLabel="Дорама"
                />

                {/* Тип роли */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={`gap-2 ${roleTypes.length ? "border-accent text-accent" : ""}`}>
                            Роль {roleTypes.length > 0 && `(${roleTypes.length})`} <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        {[{ v: "lead", l: "Главная" }, { v: "support", l: "Второстепенная" }, { v: "guest", l: "Эпизодическая" }].map(r => (
                            <DropdownMenuItem key={r.v} onClick={() => toggleParam("roleType", r.v)} className="cursor-pointer flex justify-between">
                                {r.l} {roleTypes.includes(r.v) && <Check className="w-4 h-4 text-accent shrink-0" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Актер с поиском */}
                <SearchableSelect
                    options={allPersons.map(p => ({ id: String(p.id), label: p.name }))}
                    selectedValues={personIds}
                    onToggle={(val) => toggleParam("personId", val)}
                    placeholder="Поиск актера..."
                    buttonLabel="Актер"
                />

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
            </div>

            {/* Сортировка с галочками */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 text-muted hover:text-foreground">
                            <ArrowUpDown className="w-4 h-4" />
                            {currentSort === "name_asc" ? "По имени (А-Я)" : currentSort === "name_desc" ? "По имени (Я-А)" : currentSort === "importance_desc" ? "Главные сверху" : currentSort === "importance_asc" ? "Эпизоды сверху" : "Сортировка"}
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setParam("sort", "name_asc")} className="cursor-pointer flex justify-between">По имени (А-Я) {currentSort === "name_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "name_desc")} className="cursor-pointer flex justify-between">По имени (Я-А) {currentSort === "name_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setParam("sort", "importance_desc")} className="cursor-pointer flex justify-between">По важности (Главные) {currentSort === "importance_desc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setParam("sort", "importance_asc")} className="cursor-pointer flex justify-between">По важности (Эпизоды) {currentSort === "importance_asc" && <Check className="w-4 h-4 text-accent shrink-0" />}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}