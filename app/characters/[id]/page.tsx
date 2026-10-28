import Link from "next/link";
import { notFound } from "next/navigation";
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
  Film,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AlternativeTitles } from "@/app/dramas/[id]/AlternativeTitles";

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
        include: { person: true },
      },
      // Получаем связи, где он источник, и где он цель
      relationsA: { include: { to: { select: { id: true, name: true } } } },
      relationsB: { include: { from: { select: { id: true, name: true } } } },
    },
  });

  if (!character) notFound();

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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href={`/dramas/${character.drama.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        К дораме «{character.drama.title}»
      </Link>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* ФОТО */}
        <div className="w-32 h-48 md:w-40 md:h-60 rounded-2xl bg-accent-soft flex items-center justify-center text-6xl shrink-0 overflow-hidden shadow-lg">
          {character.imageUrl ? (
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-16 h-16 text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold leading-tight">{character.name}</h1>

          {/* Альтернативные имена */}
          <AlternativeTitles
            label="Другие имена:"
            titles={character.aliases.map((a) => ({
              id: a.id,
              title: a.name,
              language: a.language
            }))}
          />

          {/* Характеристики */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-muted">
            {character.gender && (
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Пол:</span>
                {character.gender === 'male' ? 'Мужской' : character.gender === 'female' ? 'Женский' : 'Другой'}
              </span>
            )}
            {character.age && (
              <span className="flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Возраст:</span>
                {character.age}
              </span>
            )}
            {character.height && (
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Рост:</span>
                {character.height}
              </span>
            )}
            {character.birthDate && (
              <span className="flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-accent" />
                <span className="text-muted/70">День рождения:</span>
                {character.birthDate}
              </span>
            )}
            {character.occupation && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Профессия:</span>
                {character.occupation}
              </span>
            )}
          </div>

          {/* Кто играет */}
          {actor && (
            <div className="mt-6 flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
              <div className="w-12 h-16 rounded-md bg-accent-soft/40 flex items-center justify-center overflow-hidden shrink-0">
                {actor.photoUrl ? (
                  <img src={actor.photoUrl} alt={actor.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-muted" />
                )}
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">Играет актёр</p>
                <Link href={`/people/${actor.id}`} className="text-lg font-semibold text-accent hover:underline">
                  {actor.name}
                </Link>
              </div>
            </div>
          )}

          {character.description && (
            <p className="text-sm text-muted mt-6 leading-relaxed whitespace-pre-wrap">
              {character.description}
            </p>
          )}
        </div>
      </div>

      {/* Связи */}
      {(character.relationsA.length > 0 || character.relationsB.length > 0) && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-accent" />
            Связи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Связи, где персонаж - источник (Он - отец для ...) */}
            {character.relationsA.map((r) => (
              <div key={`a-${r.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
                {getRelationIcon(r.relationType)}
                <div>
                  <p className="text-xs text-muted">Для <Link href={`/characters/${r.to.id}`} className="text-foreground hover:underline font-medium">{r.to.name}</Link> он(а):</p>
                  <p className="text-sm font-semibold text-accent">{r.relation}</p>
                </div>
              </div>
            ))}

            {/* Связи, где персонаж - цель (... - отец для него) */}
            {character.relationsB.map((r) => (
              <div key={`b-${r.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface">
                {getRelationIcon(r.relationType)}
                <div>
                  <p className="text-xs text-muted">
                    <Link href={`/characters/${r.from.id}`} className="text-foreground hover:underline font-medium">{r.from.name}</Link> ему/ей:
                  </p>
                  <p className="text-sm font-semibold text-accent">{r.relation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ссылка на дораму */}
      <section className="mt-12 p-6 rounded-2xl border border-border bg-surface flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide mb-1">Персонаж из дорамы</p>
          <h3 className="text-lg font-bold">{character.drama.title}</h3>
        </div>
        <Link
          href={`/dramas/${character.drama.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          <Film className="w-4 h-4" />
          Перейти к дораме
        </Link>
      </section>
    </div>
  );
}