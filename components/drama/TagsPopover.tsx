"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TagsPopoverProps = {
    genres: { id: number; name: string }[];
    themes: string[];
    hiddenCount: number;
};

export function TagsPopover({ genres, themes, hiddenCount }: TagsPopoverProps) {
    if (hiddenCount <= 0) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="bg-transparent border border-border text-muted hover:bg-surface rounded-full px-3 py-1 text-xs font-medium transition-colors">
                    +{hiddenCount} тегов
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-80 overflow-y-auto bg-surface border border-border rounded-xl p-4">

                {/* Жанры */}
                {genres.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Жанры</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-2">
                            {genres.map((g) => (
                                <Link
                                    key={g.id}
                                    href={`/dramas?genre=${g.id}`}
                                    className="text-sm text-foreground hover:text-accent transition-colors"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Разделитель */}
                {genres.length > 0 && themes.length > 0 && (
                    <div className="border-t border-border my-3" />
                )}

                {/* Темы */}
                {themes.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Темы</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-2">
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

            </PopoverContent>
        </Popover>
    );
}