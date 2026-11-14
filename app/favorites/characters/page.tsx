import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, Heart, ChevronRight, Film, User, Users, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { CharacterCard } from "@/components/characters/CharacterCard";

export default async function FavoriteCharactersPage() {
    // 1. Получаем избранных персонажей пользователя
    const favorites = await prisma.userFavoriteCharacter.findMany({
        where: { userId: CURRENT_USER_ID },
        include: {
            character: {
                include: {
                    drama: { select: { id: true, title: true } },
                    credits: {
                        where: { roleType: "actor", person: { deletedAt: null } },
                        include: { person: { select: { id: true, name: true } } },
                        take: 1,
                    },
                },
            },
        },
    });

    if (!favorites) notFound();

    const characters = favorites.map(f => f.character);
    const totalCharacters = characters.length;

    // --- Статистика ---
    const getTopValue = (arr: (string | undefined | null)[]) => {
        const valid = arr.filter(Boolean) as string[];
        if (valid.length === 0) return "—";
        return Object.entries(valid.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0][0];
    };

    const topDrama = getTopValue(characters.map(c => c.drama.title));
    const topActor = getTopValue(characters.map(c => c.credits[0]?.person.name));
    const topImportance = getTopValue(characters.map(c => c.credits[0]?.importance === "lead" ? "Главная" : c.credits[0]?.importance === "guest" ? "Эпизод" : "Второстепенная"));

    // Уникальные дорамы среди избранных
    const uniqueDramas = new Set(characters.map(c => c.drama.id)).size;

    // --- Топ среди фанатов (глобальный) ---
    const globalTopCharacters = await prisma.character.findMany({
        where: { deletedAt: null, favoriteBy: { some: {} } },
        include: {
            drama: { select: { id: true, title: true } },
            credits: {
                where: { roleType: "actor", person: { deletedAt: null } },
                include: { person: { select: { id: true, name: true } } },
                take: 1,
            },
        },
        orderBy: { favoriteBy: { _count: "desc" } },
        take: 5,
    });

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Хлебные крошки */}
            <div className="flex items-center gap-2 text-sm text-muted mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Главная</Link>
                <ChevronRight className="w-4 h-4 opacity-50" />
                <span className="text-foreground">Любимые персонажи</span>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    Любимые персонажи
                </h1>
                <p className="text-sm text-muted mt-2">Твой топ персонажей из дорам</p>
            </div>

            {/* --- HERO СТАТИСТИКА --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Users className="w-6 h-6 text-accent mb-2" />
                    <span className="text-2xl font-bold">{totalCharacters}</span>
                    <span className="text-[11px] text-muted mt-0.5">В избранном</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Film className="w-6 h-6 text-accent mb-2" />
                    <span className="text-sm font-bold truncate max-w-full px-1">{topDrama}</span>
                    <span className="text-[11px] text-muted mt-1">Топ дорама</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <User className="w-6 h-6 text-accent mb-2" />
                    <span className="text-sm font-bold truncate max-w-full px-1">{topActor}</span>
                    <span className="text-[11px] text-muted mt-1">Топ актер</span>
                </div>
                <div className="bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <Star className="w-6 h-6 text-accent mb-2" />
                    <span className="text-sm font-bold truncate max-w-full px-1">{topImportance}</span>
                    <span className="text-[11px] text-muted mt-1">Чаще всего</span>
                </div>
            </div>

            {/* --- ВСЕ ИЗБРАННЫЕ --- */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" /> Твои избранные
                </h2>
                {characters.length === 0 ? (
                    <div className="text-center py-16 bg-surface/20 rounded-2xl border border-border/50 border-dashed">
                        <Crown className="w-12 h-12 text-muted/50 mx-auto mb-4" />
                        <p className="text-muted mb-2">Ты пока не добавил ни одного персонажа в избранное.</p>
                        <Link href="/characters" className="text-sm text-accent hover:underline">
                            Перейти в каталог персонажей →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {characters.map((char) => (
                            <CharacterCard key={char.id} character={char as any} />
                        ))}
                    </div>
                )}
            </section>

            {/* --- ТОП СРЕДИ ФАНАТОВ --- */}
            {globalTopCharacters.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" /> Топ среди фанатов
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-surface/50 px-2 py-1 rounded-md border border-border/50">Глобальный</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {globalTopCharacters.map((char) => (
                            <div key={char.id} className="w-40 shrink-0">
                                <CharacterCard character={char as any} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}