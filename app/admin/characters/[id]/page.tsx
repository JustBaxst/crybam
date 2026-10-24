import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CharacterForm } from "../CharacterForm";
import { DeleteCharacterButton } from "./DeleteCharacterButton";
import { CharacterRelations } from "./CharacterRelations";
import { CharacterAliasEditButton } from "../CharacterAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

type Params = Promise<{ id: string }>;

export default async function EditCharacterPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
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

  // Получаем связи, где этот персонаж является источником (from)
  const relations = await prisma.characterRelation.findMany({
    where: { fromId: id },
    include: { to: { select: { id: true, name: true } } },
  });

  // Получаем список других персонажей из этой же дорамы
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Хлебные крошки */}
      <AdminBreadcrumbs 
        items={[
          { label: "Персонажи", href: "/admin/characters" },
          { label: character.name }
        ]} 
      />

      {/* Шапка с именем, кнопкой "Другие имена" и удалением */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
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

      {/* Форма персонажа */}
      <CharacterForm character={character} dramas={dramas} />

      {/* Блок связей */}
      <CharacterRelations
        characterId={character.id}
        relations={formattedRelations}
        availableCharacters={availableCharacters}
      />
    </div>
  );
}