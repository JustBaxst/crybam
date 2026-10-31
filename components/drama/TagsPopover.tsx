"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sun, Moon, CloudRain } from "lucide-react";

// Типы для пропсов
type TagsPopoverProps = {
    genres: { id: number; name: string }[];
    themes: string[];
    mood: string | null; // cryTag
    hiddenCount: number;
};

export function TagsPopover({ genres, themes, mood, hiddenCount }: TagsPopoverProps) {
    if (hiddenCount <= 0) return null;

    const getMoodIcon = (m: string) => {
        if (m === "sad") return <CloudRain className="w-4 h-4 text-blue-400" />;
        if (m === "bittersweet") return <Moon className="w-4 h-4 text-purple-400" />;
        if (m === "safe") return <Sun className="w-4 h-4 text-yellow-400" />;
        return null;
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="px-3 py-1 rounded-full border border-border text-muted text-sm hover:bg-surface hover:text-foreground transition-colors">
                    +{hiddenCount} тегов
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-80 overflow-y-auto">
                <div className="space-y-4">

                    {/* Жанры */}
                    {genres.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Жанры</h4>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((g) => (
                                    <Link
                                        key={g.id}
                                        href={`/dramas?genre=${g.id}`}
                                        className="text-sm text-accent hover:underline"
                                    >
                                        {g.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Настроение */}
                    {mood && (
                        <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Настроение</h4>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                {getMoodIcon(mood)}
                                <span className="capitalize">{mood === "sad" ? "Грустное" : mood === "bittersweet" ? "Горько-сладкое" : "Безопасное"}</span>
                            </div>
                        </div>
                    )}

                    {/* Темы */}
                    {themes.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Темы</h4>
                            <div className="flex flex-wrap gap-2">
                                {themes.map((t) => (
                                    <Link
                                        key={t}
                                        href={`/dramas?search=${t}`}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        #{t}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </PopoverContent>
        </Popover>
    );
}