"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSocialIcon } from "@/lib/social-icons";

type SocialLink = {
    id: number;
    platform: string;
    url: string;
    handle: string | null;
};

export function SocialLinks({ links }: { links: SocialLink[] }) {
    if (links.length === 0) return null;

    const MAX_VISIBLE = 5;
    // Если ссылок 5 или меньше, показываем их все. Если больше — показываем 4 и кнопку +N.
    const visible = links.length > MAX_VISIBLE ? links.slice(0, MAX_VISIBLE - 1) : links;
    const hidden = links.length > MAX_VISIBLE ? links.slice(MAX_VISIBLE - 1) : [];

    return (
        <div className="flex flex-wrap gap-2">
            {/* Видимые ссылки (максимум 4) */}
            {visible.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                    <div key={link.id} className="relative group/btn flex justify-center">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer"
                        >
                            <Icon className="w-4 h-4" />
                        </a>
                        {/* Тултип с названием платформы */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                            <span className="bg-zinc-800/95 text-white text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10 shadow-xl whitespace-nowrap capitalize">
                                {link.platform}
                            </span>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800/95" />
                        </div>
                    </div>
                );
            })}

            {/* Кнопка "+N" и поповер со скрытыми ссылками */}
            {hidden.length > 0 && (
                <div className="relative group/btn flex justify-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-muted hover:text-accent hover:border-accent/40 transition-all cursor-pointer text-xs font-semibold">
                                +{hidden.length}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-2 bg-surface border border-border rounded-xl shadow-xl">
                            <div className="flex flex-col gap-0.5">
                                {hidden.map((link) => {
                                    const Icon = getSocialIcon(link.platform);
                                    return (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted hover:bg-accent/10 hover:text-accent transition-colors"
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="capitalize truncate">{link.platform}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Тултип "Другие" */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 translate-y-1 group-hover/btn:translate-y-0 pointer-events-none z-50 flex flex-col items-center">
                        <span className="bg-zinc-800/95 text-white text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10 shadow-xl whitespace-nowrap">
                            Другие
                        </span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-zinc-800/95" />
                    </div>
                </div>
            )}
        </div>
    );
}