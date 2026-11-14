import Link from "next/link";
import { notFound } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { FavoriteCharacterButton } from "@/components/characters/FavoriteCharacterButton";
import {
  ArrowLeft,
  User as UserIcon,
  Ruler,
  Cake,
  Heart,
  Home,
  Users,
  Swords,
  Briefcase,
  Info,
  BookOpen,
  Film,
  User,
  Calendar,
  ChevronRight
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AlternativeTitles } from "@/app/dramas/[id]/AlternativeTitles";
import { PublicCharacterRelations } from "@/components/characters/PublicCharacterRelations";

type Params = Promise<{ id: string }>;

export default async function CharacterPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const character = await prisma.character.findUnique({
    where: { id, deletedAt: null },
    include: {
      drama: true,
      aliases: true,
      credits: {
        where: { person: { deletedAt: null } },
        include: { person: true },
      },
      // Получаем связи, где он источник, и где он цель (только с живыми персонажами)
      relationsA: {
        where: { to: { deletedAt: null } },
        include: { to: { select: { id: true, name: true } } }
      },
      relationsB: {
        where: { from: { deletedAt: null } },
        include: { from: { select: { id: true, name: true } } }
      },
    },
  });

  if (!character) notFound();

  const favorite = await prisma.userFavoriteCharacter.findUnique({
    where: { userId_characterId: { userId: CURRENT_USER_ID, characterId: id } }
  });
  const isFavorite = !!favorite;

  const actor = character.credits.find((c) => c.roleType === "actor")?.person;

  const getRelationIcon = (type: string) => {
    switch (type) {
      case "family": return <Home className="w-4 h-4 text-blue-400" />;
      case "romance": return <Heart className="w-4 h-4 text-pink-400" />;
      case "friendship": return <Users className="w-4 h-4 text-green-400" />;
      case "rivalry": return <Swords className="w-4 h-4 text-red-400" />;
      default: return <Users className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href={`/dramas/${character.drama.id}`} className="hover:text-foreground transition-colors">
          К дораме «{character.drama.title}»
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-foreground truncate">{character.name}</span>
      </div>

      {/* ЗАГОЛОВОК */}
      <div className="mb-8">
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] text-balance font-bold leading-tight mb-2">
          {character.name}
        </h1>
        <AlternativeTitles
          label="Другие имена:"
          titles={character.aliases.map(a => ({ id: a.id, title: a.name, language: a.language }))}
        />
      </div>

      {/* HERO-ЗОНА */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

        {/* Колонка 1: Фото и Избранное */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="aspect-2/3 rounded-2xl overflow-hidden border border-border bg-accent-soft flex items-center justify-center text-6xl shadow-lg">
            {character.imageUrl ? (
              <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-16 h-16 text-muted" />
            )}
          </div>
          <FavoriteCharacterButton characterId={character.id} initialIsFavorite={isFavorite} />
        </div>

        {/* Колонка 2: О персонаже (факты + актер + дорама) */}
        <div className="lg:col-span-2 bg-surface/20 p-6 rounded-2xl border border-border/50 flex flex-col justify-start">
          <h2 className="text-lg font-semibold mb-4 pb-4 border-b border-border/50 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" /> О персонаже
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-6">
            {character.gender && (
              <div className="flex items-start gap-2">
                <UserIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted/70 text-[11px]">Пол:</span>
                  <span className="text-foreground font-medium">{character.gender === 'male' ? 'Мужской' : character.gender === 'female' ? 'Женский' : 'Другой'}</span>
                </div>
              </div>
            )}
            {character.age && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted/70 text-[11px]">Возраст:</span>
                  <span className="text-foreground font-medium">{character.age}</span>
                </div>
              </div>
            )}
            {character.height && (
              <div className="flex items-start gap-2">
                <Ruler className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted/70 text-[11px]">Рост:</span>
                  <span className="text-foreground font-medium">{character.height}</span>
                </div>
              </div>
            )}
            {character.birthDate && (
              <div className="flex items-start gap-2">
                <Cake className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted/70 text-[11px]">День рождения:</span>
                  <span className="text-foreground font-medium">{character.birthDate}</span>
                </div>
              </div>
            )}
            {character.occupation && (
              <div className="flex items-start gap-2 md:col-span-2">
                <Briefcase className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted/70 text-[11px]">Профессия:</span>
                  <span className="text-foreground font-medium">{character.occupation}</span>
                </div>
              </div>
            )}
          </div>

          {/* АКТЕР И ДОРАМА РЯДОМ */}
          <div className="mt-auto pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
            {actor && (
              <Link href={`/people/${actor.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-accent/50 transition-colors group">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-accent-soft/50 flex items-center justify-center shrink-0">
                  {actor.photoUrl ? <img src={actor.photoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-muted" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted uppercase tracking-wider">Играет актер</p>
                  <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">{actor.name}</p>
                </div>
              </Link>
            )}

            <Link href={`/dramas/${character.drama.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-accent/50 transition-colors group">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-accent-soft/50 flex items-center justify-center shrink-0">
                <Film className="w-5 h-5 text-muted" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-wider">Из дорамы</p>
                <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">{character.drama.title}</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Колонка 3: Пустая (на будущее) */}
        <div className="lg:col-span-1 bg-surface/20 p-5 rounded-2xl border border-border/50 flex flex-col gap-4">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Действия</h3>
          <div className="text-sm text-muted italic">Скоро здесь появятся функции...</div>
        </div>
      </div>

      {/* ОПИСАНИЕ */}
      {character.description && (
        <div className="mb-10 bg-surface/20 p-6 rounded-2xl border border-border/50">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" /> Описание
          </h2>
          <p className="text-muted leading-relaxed text-base max-w-5xl">{character.description}</p>
        </div>
      )}

      {/* ТАБЫ */}
      <Tabs defaultValue="relations" className="w-full">
        <TabsList>
          <TabsTrigger value="relations">Связи</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
        </TabsList>

        <TabsContent value="relations">
          <PublicCharacterRelations
            relations={[
              ...character.relationsA.map(r => ({ id: r.id, relationType: r.relationType, relation: r.relation, target: r.to })),
              ...character.relationsB.map(r => ({ id: r.id, relationType: r.relationType, relation: r.relation, target: r.from }))
            ]}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <div className="text-center py-10 text-muted italic border border-dashed border-border rounded-2xl">
            Галерея пока пуста.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}