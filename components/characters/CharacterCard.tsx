import Link from "next/link";
import { Film, UserCircle, ArrowRight } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";

type CharacterWithData = {
    id: number;
    name: string;
    imageUrl: string | null;
    description: string | null;
    drama: { id: number; title: string };
    credits: {
        importance: string;
        person: { id: number; name: string };
    }[];
};

export function CharacterCard({ character }: { character: CharacterWithData }) {
    const actor = character.credits[0]?.person;
    const importance = character.credits[0]?.importance;

    return (
        <div className="group relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:border-accent/50">

            {/* ─── ПОСТЕР И HOVER-ОВЕРЛЕЙ ─── */}
            <div className="relative aspect-2/3 bg-accent-soft overflow-hidden rounded-t-xl">

                <Link href={`/characters/${character.id}`} className="absolute inset-0 z-10">
                    <PosterImage posterUrl={character.imageUrl} title={character.name} className="absolute inset-0" />
                </Link>

                {/* Верхние пилюли (Важность) */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20 pointer-events-none">
                    {importance && (
                        <div className="inline-flex items-center h-6 px-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[10px] font-semibold shadow-sm text-white uppercase tracking-wider">
                            {importance === "lead" ? "Главная" : importance === "guest" ? "Эпизод" : "Второстепенная"}
                        </div>
                    )}
                </div>

                {/* Hover-оверлей */}
                <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hidden md:flex flex-col justify-between p-4">
                    <div className="w-full pt-1">
                        <p className="text-white/90 text-xs leading-relaxed line-clamp-10">
                            {character.description || "Описание пока отсутствует..."}
                        </p>
                    </div>
                    <div className="w-full shrink-0 flex flex-col gap-2">
                        <Link href={`/dramas/${character.drama.id}`} className="flex items-center gap-2 w-full h-9 px-3 rounded-lg bg-surface/20 border border-white/10 hover:bg-surface/40 hover:border-accent/40 text-white text-xs font-medium transition-colors">
                            <Film className="w-4 h-4 text-accent" />
                            <span>К дораме</span>
                        </Link>
                        {actor && (
                            <Link href={`/people/${actor.id}`} className="flex items-center gap-2 w-full h-9 px-3 rounded-lg bg-surface/20 border border-white/10 hover:bg-surface/40 hover:border-accent/40 text-white text-xs font-medium transition-colors">
                                <UserCircle className="w-4 h-4 text-accent" />
                                <span>К актеру</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── ИНФОРМАЦИЯ ─── */}
            <div className="p-3 flex flex-col flex-1 rounded-b-xl">
                <Link href={`/characters/${character.id}`} className="hover:text-accent transition-colors">
                    <h3 className="font-semibold text-sm leading-tight truncate">
                        {character.name}
                    </h3>
                </Link>
                {actor && (
                    <p className="text-xs text-muted mt-0.5 truncate">
                        {actor.name}
                    </p>
                )}
                <p className="text-xs text-muted mt-2 flex items-center gap-1.5">
                    <Film className="w-4 h-4 shrink-0 text-accent" />
                    <span className="truncate">{character.drama.title}</span>
                </p>
            </div>
        </div>
    );
}