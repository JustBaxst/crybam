import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CharacterForm } from "../CharacterForm";
import { DeleteCharacterButton } from "./DeleteCharacterButton";
import { CharacterRelations } from "./CharacterRelations";
import { CharacterAliasEditButton } from "../CharacterAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ fromDrama?: string }>;

export default async function EditCharacterPage({ 
  params, 
  searchParams 
}: { 
  params: Params;
  searchParams: SearchParams;
}) {
  const { id: rawId } = await params;
  const { fromDrama } = await searchParams;
  const id = Number(rawId);
  
  if (!Number.isInteger(id) || id <= 0) notFound();

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      drama: { select: { id: true, title: true, year: true } },
      aliases: true,
    },
  });

  if (!character) notFound();

  const relations = await prisma.characterRelation.findMany({
    where: { fromId: id },
    include: { to: { select: { id: true, name: true } } },
  });

  const availableCharacters = await prisma.character.findMany({
    where: { dramaId: character.dramaId, id: { not: id } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const dramas = await prisma.drama.findMany({
    select: { id: true, title: true, year: true },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  const formattedRelations = relations.map(r => ({
    id: r.id,
    relationType: r.relationType,
    relation: r.relation,
    target: r.to,
  }));

   // Ищем актера этого персонажа в контексте дорамы (если мы пришли из неё)
  let linkedActor = null;
  if (fromDrama) {
    const credit = await prisma.credit.findFirst({
      where: { 
        characterId: id, 
        dramaId: Number(fromDrama),
        roleType: "actor"
      },
      include: { person: true }
    });
    linkedActor = credit?.person;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      
      {/* Кнопка возврата, если мы пришли из дорамы */}
            {fromDrama && (
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Link
            href={`/admin/dramas/${fromDrama}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к дораме
          </Link>
          
          {linkedActor && (
            <span className="text-sm text-muted flex items-center gap-1.5">
              Актёр: 
              <Link 
                href={`/admin/people/${linkedActor.id}?fromDrama=${fromDrama}`}
                className="text-accent hover:underline font-medium"
              >
                {linkedActor.name}
              </Link>
            </span>
          )}
        </div>
      )}

      <AdminBreadcrumbs 
        items={[
          { label: "Персонажи", href: "/admin/characters" },
          { label: character.name }
        ]} 
      />

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap mt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <CharacterAliasEditButton 
              characterId={character.id} 
              currentAliases={character.aliases.map(a => a.name)} 
            />
          </div>
          <p className="text-sm text-muted">
            Из дорамы{" "}
            <Link
              href={`/admin/dramas/${character.drama.id}`}
              className="text-accent hover:underline"
            >
              {character.drama.title}
            </Link>
          </p>
        </div>
        
        <div className="shrink-0">
          <DeleteCharacterButton
            characterId={character.id}
            characterName={character.name}
          />
        </div>
      </div>

      {/* Передаем fromDrama в форму */}
      <CharacterForm character={character} dramas={dramas} fromDrama={fromDrama} />

      <CharacterRelations
        characterId={character.id}
        relations={formattedRelations}
        availableCharacters={availableCharacters}
      />
    </div>
  );
}