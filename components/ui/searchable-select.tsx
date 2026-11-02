"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Search } from "lucide-react";

type Option = { id: string | number; label: string };

export function SearchableSelect({
    options,
    selectedValues,
    onToggle,
    placeholder,
    buttonLabel,
    singleSelect = false,
    onSingleSelect,
}: {
    options: Option[];
    selectedValues: string[];
    onToggle?: (value: string) => void;
    placeholder: string;
    buttonLabel: string;
    singleSelect?: boolean;
    onSingleSelect?: (value: string | null) => void;
}) {
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover onOpenChange={(open) => !open && setSearch("")}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 ${selectedValues.length > 0 ? "border-accent text-accent" : ""}`}
                >
                    {buttonLabel}
                    {selectedValues.length > 0 && !singleSelect && `(${selectedValues.length})`}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-64 p-0 bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
                {/* Поле поиска */}
                <div className="p-2 border-b border-border/50 relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:border-accent transition-colors"
                    />
                </div>

                {/* Список */}
                <div className="max-h-60 overflow-y-auto p-1">
                    {filteredOptions.length === 0 ? (
                        <p className="text-xs text-muted text-center py-4">Ничего не найдено</p>
                    ) : (
                        filteredOptions.map((opt) => {
                            const valueStr = String(opt.id);
                            const isSelected = selectedValues.includes(valueStr);

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        if (singleSelect && onSingleSelect) {
                                            onSingleSelect(isSelected ? null : valueStr);
                                        } else if (onToggle) {
                                            onToggle(valueStr);
                                        }
                                    }}
                                    // ИЗМЕНИЛИ ХОВЕР: добавили accent, как в DropdownMenuItem
                                    className="w-full flex items-center justify-between gap-2 px-2 py-1.5 text-sm text-left rounded-md transition-colors hover:bg-accent/10 hover:text-accent focus:bg-accent/10 focus:text-accent focus:outline-none cursor-pointer"
                                >
                                    <span className="truncate flex-1">{opt.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}