import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Crown, Star, Users, Briefcase, ChevronRight, Heart, Film,
    Flame, Trophy, Brain, Sparkles, Calendar
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";

export default async function FavoriteActorsPage() {
    const favorites = await prisma.userFavoriteActor.findMany({
        where: { userId: CURRENT_USER_ID },
        include: {
            person: {
                include: {
                    _count: { select: { credits: true, favoriteBy: true } },
                },
            },
        },
    });

    if (!favorites) notFound();

    const actors = favorites.map(f => f.person);
    const totalActors = actors.length;

    // --- Вычисления для статистики ---
    let totalAge = 0;
    let ageCount = 0;
    let totalRoles = 0;

    actors.forEach(a => {
        totalRoles += a._count.credits;
        if (a.birthDate) {
            const age = Math.floor((Date.now() - new Date(a.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
            totalAge += age;
            ageCount++;
        }
    });
    const averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;

    const getTopValue = (arr: (string | null | undefined)[]) => {
        const valid = arr.filter(Boolean) as string[];
        if (valid.length === 0) return "—";
        return Object.entries(valid.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0][0];
    };

    const topAgency = getTopValue(actors.map(a => a.agency));
    const topMbti = getTopValue(actors.map(a => a.mbti));
    const topZodiac = getTopValue(actors.map(a => a.zodiacWestern));

    // --- Топы ---
    const topByRoles = [...actors].sort((a, b) => b._count.credits - a._count.credits).slice(0, 5);

    const globalTopActors = await prisma.person.findMany({
        where: { deletedAt: null, favoriteBy: { some: {} } },
        include: { _count: { select: { favoriteBy: true } } },
        orderBy: { favoriteBy: { _count: "desc" } },
        take: 5,
    });

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            {/* Хлебные крошки */}
            <div className="flex items-center gap-2 text-sm text-muted mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
                <ChevronRight className="w-4 h-4 opacity-50" />
                <span className="text-foreground">Любимые актеры</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    Любимые актеры
                </h1>
                <p className="text-sm text-muted mt-2">Твои кумиры и фавориты</p>
            </div>

            {/* --- HERO СТАТИСТИКА (6 плашек) --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Users className="w-6 h-6 text-accent mb-2" />
                    <span className="text-xl font-bold">{totalActors}</span>
                    <span className="text-[11px] text-muted mt-0.5">В избранном</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Calendar className="w-6 h-6 text-accent mb-2" />
                    <span className="text-xl font-bold">{averageAge}</span>
                    <span className="text-[11px] text-muted mt-0.5">Средний возраст</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Film className="w-6 h-6 text-accent mb-2" />
                    <span className="text-xl font-bold">{totalRoles}</span>
                    <span className="text-[11px] text-muted mt-0.5">Всего ролей</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Briefcase className="w-6 h-6 text-accent mb-2" />
                    <span className="text-sm font-bold leading-tight line-clamp-2 px-1">{topAgency}</span>
                    <span className="text-[11px] text-muted mt-1">Топ агентство</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Brain className="w-6 h-6 text-accent mb-2" />
                    <span className="text-lg font-bold">{topMbti}</span>
                    <span className="text-[11px] text-muted mt-0.5">Топ MBTI</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-6 h-6 text-accent mb-2" />
                    <span className="text-sm font-bold leading-tight line-clamp-2 px-1">{topZodiac}</span>
                    <span className="text-[11px] text-muted mt-1">Топ Зодиак</span>
                </div>
            </div>

            {/* --- ВСЕ ИЗБРАННЫЕ (ПЕРЕНЕСЕНО НАВЕРХ) --- */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" /> Твои избранные
                </h2>
                {actors.length === 0 ? (
                    <div className="text-center py-16 bg-surface/20 rounded-2xl border border-border/50 border-dashed">
                        <Crown className="w-12 h-12 text-muted/50 mx-auto mb-4" />
                        <p className="text-muted mb-2">Ты пока не добавил ни одного актера в избранное.</p>
                        <Link href="/people" className="text-sm text-accent hover:underline">
                            Перейти в каталог актеров →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {favorites.map((fav) => {
                            const actor = fav.person;
                            return (
                                <Link
                                    key={fav.personId}
                                    href={`/people/${actor.id}`}
                                    className="group flex flex-col rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors overflow-hidden"
                                >
                                    <div className="aspect-2/3 bg-accent-soft overflow-hidden relative">
                                        {actor.photoUrl ? (
                                            <img src={actor.photoUrl} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl text-muted">👤</div>
                                        )}
                                        {fav.note && (
                                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] p-1.5 rounded border border-white/20 line-clamp-2">
                                                {fav.note}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">{actor.name}</h3>
                                        <p className="text-xs text-muted mt-1 truncate">{actor.agency || "Агентство не указано"}</p>
                                        <p className="text-xs text-muted mt-0.5">{actor._count.credits} ролей</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* --- ТОП СРЕДИ ФАНАТОВ --- */}
            {globalTopActors.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" /> Топ среди фанатов
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-surface/50 px-2 py-1 rounded-md border border-border/50">Глобальный</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {globalTopActors.map((actor, idx) => (
                            <Link
                                key={actor.id}
                                href={`/people/${actor.id}`}
                                className="group relative w-40 shrink-0 rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors"
                            >
                                <div className="aspect-2/3 bg-accent-soft relative overflow-hidden">
                                    {actor.photoUrl ? (
                                        <img src={actor.photoUrl} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-muted">👤</div>
                                    )}
                                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white border border-white/20">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="p-2 text-center">
                                    <p className="text-sm font-semibold truncate">{actor.name}</p>
                                    <p className="text-[10px] text-muted flex items-center justify-center gap-1 mt-0.5">
                                        <Heart className="w-3 h-3 text-red-400 fill-current" /> {actor._count.favoriteBy} в избранном
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* --- ТОП ПО РОЛЯМ --- */}
            {topByRoles.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" /> Топ по ролям
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-surface/50 px-2 py-1 rounded-md border border-border/50">Среди твоих</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {topByRoles.map((actor, idx) => (
                            <Link
                                key={actor.id}
                                href={`/people/${actor.id}`}
                                className="group relative w-40 shrink-0 rounded-xl border border-border bg-surface overflow-hidden hover:border-accent/50 transition-colors"
                            >
                                <div className="aspect-2/3 bg-accent-soft relative overflow-hidden">
                                    {actor.photoUrl ? (
                                        <img src={actor.photoUrl} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-muted">👤</div>
                                    )}
                                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white border border-white/20">
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className="p-2 text-center">
                                    <p className="text-sm font-semibold truncate">{actor.name}</p>
                                    <p className="text-[10px] text-muted flex items-center justify-center gap-1 mt-0.5">
                                        <Film className="w-3 h-3 text-accent" /> {actor._count.credits} ролей
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}