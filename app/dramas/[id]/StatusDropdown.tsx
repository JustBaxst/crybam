"use client";

import { useTransition } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus, PlayCircle, Clock, Eye, XCircle, PauseCircle, Trash2 } from "lucide-react";
import { quickSetStatus, incrementProgress, removeEntry } from "./actions";

const STATUSES = [
    { value: "watching", label: "Смотрю", Icon: PlayCircle },
    { value: "planned", label: "В планах", Icon: Clock },
    { value: "watched", label: "Просмотрено", Icon: Eye },
    { value: "on_hold", label: "Отложено", Icon: PauseCircle },
    { value: "dropped", label: "Брошено", Icon: XCircle },
];

type EntryData = {
    status: string;
    progress: number | null;
    rewatchCount: number;
};

export function StatusDropdown({
    dramaId,
    entry,
    episodes,
}: {
    dramaId: number;
    entry: EntryData | null;
    episodes: number | null;
}) {
    const [isPending, startTransition] = useTransition();

    const setStatus = (status: string) => {
        const formData = new FormData();
        formData.set("dramaId", String(dramaId));
        formData.set("status", status);
        startTransition(async () => {
            await quickSetStatus(formData);
        });
    };

    const handleIncrement = () => {
        startTransition(async () => {
            await incrementProgress(dramaId);
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            await removeEntry(dramaId);
        });
    };

    const currentStatusObj = entry ? STATUSES.find(s => s.value === entry.status) : null;
    const progress = entry?.progress || 0;
    const totalEpisodes = episodes || 0;

    const isWatching = entry?.status === "watching";
    const isRewatching = isWatching && (entry?.rewatchCount || 0) > 0;

    // Общие стили для кнопок, чтобы убрать фокус-ринг
    const btnResetCls = "outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

    return (
        <div className="flex flex-col gap-2 w-full">
            {!entry ? (
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <div className={`flex items-center w-full rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-colors overflow-hidden ${btnResetCls}`}>
                            {/* Левая часть - Быстрое добавление */}
                            <button
                                onPointerDown={(e) => e.stopPropagation()} // ← Останавливаем перехват Radix
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStatus("planned");
                                }}
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-accent disabled:opacity-50"
                            >
                                <Plus className="w-4 h-4" />
                                Добавить в дневник
                            </button>

                            {/* Правая часть - Визуальная стрелочка (клик всплывет до Trigger) */}
                            <div className="px-3 py-2.5 text-accent border-l border-accent/40 cursor-pointer">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            className="w-(--radix-dropdown-menu-trigger-width) rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1 p-1"
                        >
                            {STATUSES.map((s) => (
                                <DropdownMenu.Item
                                    key={s.value}
                                    onSelect={() => setStatus(s.value)}
                                    className={`flex items-center px-3 py-2 text-sm text-foreground hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer data-highlighted:bg-foreground/5 ${btnResetCls}`}
                                >
                                    {s.label}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            ) : (
                // СОСТОЯНИЕ 2: Дорама уже в дневнике
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            disabled={isPending}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-surface hover:border-accent/40 hover:bg-foreground/5 text-foreground text-sm font-medium transition-all disabled:opacity-50 ${btnResetCls}`}
                        >
                            <div className="flex items-center gap-2">
                                {currentStatusObj && <currentStatusObj.Icon className="w-4 h-4 text-accent" />}
                                {currentStatusObj?.label || entry.status}
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted" />
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="start"
                            className="w-(--radix-dropdown-menu-trigger-width) rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 mt-1 p-1"
                        >
                            {STATUSES.map((s) => (
                                <DropdownMenu.Item
                                    key={s.value}
                                    onSelect={() => setStatus(s.value)}
                                    className={`flex items-center px-3 py-2 text-sm text-foreground hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer data-highlighted:bg-foreground/5 ${btnResetCls}`}
                                >
                                    {s.label}
                                </DropdownMenu.Item>
                            ))}

                            <DropdownMenu.Separator className="h-px bg-border my-1 mx-2" />

                            <DropdownMenu.Item
                                onSelect={handleRemove}
                                className={`flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer data-highlighted:bg-red-500/10 ${btnResetCls}`}
                            >
                                <Trash2 className="w-4 h-4" />
                                Удалить из списка
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            )}

            {/* Блок прогресса */}
            {isWatching && totalEpisodes > 0 && (
                <div className="flex items-center justify-between px-1 text-sm text-muted mt-1">
                    <span className="font-medium">
                        {isRewatching ? "Пересм." : "Серии:"} {progress} / {totalEpisodes}
                    </span>
                    <button
                        onClick={handleIncrement}
                        disabled={isPending || progress >= totalEpisodes}
                        className={`w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20 transition-colors disabled:opacity-50 ${btnResetCls}`}
                        title="Отметить просмотренную серию"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}