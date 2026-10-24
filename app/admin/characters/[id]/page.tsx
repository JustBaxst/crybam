import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CharacterForm } from "../CharacterForm";
import { DeleteCharacterButton } from "./DeleteCharacterButton";

type Params = Promise<{ id: string }>;

export default async function EditCharacterPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      drama: { select: { id: true, title: true, year: true } },
      aliases: true, // ← ДОБАВИЛИ ПОДТЯГИВАНИЕ ИМЕН
    },
  });

  if (!character) notFound();

  const dramas = await prisma.drama.findMany({
    select: { id: true, title: true, year: true },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/characters"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
        <DeleteCharacterButton
          characterId={character.id}
          characterName={character.name}
        />
      </div>

      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">{character.name}</h1>
        {/* Сюда мы позже добавим кнопку "Другие имена" (модалку) */}
        <p className="text-sm text-muted w-full mt-1">
          Из дорамы{" "}
          <Link
            href={`/admin/dramas/${character.drama.id}`}
            className="text-accent hover:underline"
          >
            {character.drama.title}
          </Link>
        </p>
      </div>

      <CharacterForm character={character} dramas={dramas} />
    </div>
  );
}