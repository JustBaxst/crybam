"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, Hash, Sparkles } from "lucide-react";

type TagsPopoverProps = {
    genres: { id: number; name: string }[];
    themes: string[];
    moods: string[];
    hiddenCount: number;
};

export function TagsPopover({ genres, themes, moods, hiddenCount }: TagsPopoverProps) {
    if (hiddenCount <= 0) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="bg-transparent border border-border text-muted hover:bg-surface rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer">
                    +{hiddenCount} тегов
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-80 overflow-y-auto bg-surface border border-border rounded-xl p-4">

                {/* Жанры */}
                {genres.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Жанры
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-2">
                            {genres.map((g) => (
                                <Link
                                    key={g.id}
                                    href={`/dramas?genre=${g.id}`}
                                    className="text-sm text-foreground hover:text-accent hover:underline transition-colors"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Настроения */}
                {moods.length > 0 && (
                    <>
                        {genres.length > 0 && <div className="border-t border-border my-3" />}
                        <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Настроения
                            </h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-2">
                                {moods.map((m) => (
                                    <Link
                                        key={m}
                                        href={`/dramas?mood=${m}`}
                                        className="text-sm text-purple-400 hover:text-accent hover:underline transition-colors"
                                    >
                                        {m}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Темы */}
                {themes.length > 0 && (
                    <>
                        {(genres.length > 0 || moods.length > 0) && <div className="border-t border-border my-3" />}
                        <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> Темы
                            </h4>
                            <div className="flex flex-wrap gap-x-3 gap-y-2">
                                {themes.map((t) => (
                                    <Link
                                        key={t}
                                        href={`/dramas?theme=${t}`}
                                        className="text-sm text-blue-400 hover:text-accent hover:underline transition-colors"
                                    >
                                        #{t}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </PopoverContent>
        </Popover>
    );
}