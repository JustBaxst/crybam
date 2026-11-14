import Link from "next/link";
import { Heart, Crown, Film } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";
import { FavoriteActorButton } from "@/components/people/FavoriteActorButton";

type PersonWithData = {
    id: number;
    name: string;
    photoUrl: string | null;
    aliases: { name: string; language: string }[];
    bio: string | null;
    _count: { credits: number; favoriteBy: number };
    credits: { drama: { id: number; title: string; year: number | null } }[];
};

export function PeopleCard({ person, isFavorite }: { person: PersonWithData; isFavorite: boolean }) {

    return (
        <div className="group relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:border-accent/50">

            {/* ─── ПОСТЕР И HOVER-ОВЕРЛЕЙ ─── */}
            <div className="relative aspect-2/3 bg-accent-soft overflow-hidden rounded-t-xl">

                <Link href={`/people/${person.id}`} className="absolute inset-0 z-10">
                    <PosterImage posterUrl={person.photoUrl} title={person.name} className="absolute inset-0" />
                </Link>

                {/* Верхние пилюли */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20 pointer-events-none">
                    {/* Левая: Количество избранных */}
                    <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-semibold shadow-sm text-white">
                        <Heart className={`w-3.5 h-3.5 ${person._count.favoriteBy > 0 ? "fill-red-400 text-red-400" : ""}`} />
                        <span>{person._count.favoriteBy}</span>
                    </div>

                    {/* Правая: Статус избранного */}
                    {isFavorite && (
                        <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-yellow-400/30 bg-black/60 backdrop-blur-md text-xs font-semibold shadow-sm text-yellow-400">
                            <Crown className="w-3.5 h-3.5" />
                            <span>В избранном</span>
                        </div>
                    )}
                </div>

                {/* Hover-оверлей */}
                <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hidden md:flex flex-col justify-between p-4">
                    <div className="w-full pt-1">
                        <p className="text-white/90 text-xs leading-relaxed line-clamp-8">
                            {person.bio || "Биография пока отсутствует..."}
                        </p>
                        {person.credits.length > 0 && (
                            <div className="mt-4">
                                <p className="text-[10px] text-white/50 uppercase mb-1.5">Известен по:</p>
                                <ul className="text-xs text-white/80 space-y-1">
                                    {person.credits.slice(0, 3).map(c => (
                                        <li key={c.drama.id} className="truncate">• {c.drama.title}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="w-full shrink-0">
                        <FavoriteActorButton personId={person.id} initialIsFavorite={isFavorite} />
                    </div>
                </div>
            </div>

            {/* ─── ИНФОРМАЦИЯ ─── */}
            <div className="p-3 flex flex-col flex-1 rounded-b-xl">
                <Link href={`/people/${person.id}`} className="hover:text-accent transition-colors flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm leading-tight truncate">
                        {person.name}
                    </h3>
                </Link>

                <p className="text-xs text-muted mt-1.5 flex items-center gap-1">
                    <Film className="w-3 h-3" /> {person._count.credits} ролей
                </p>
            </div>
        </div>
    );
}