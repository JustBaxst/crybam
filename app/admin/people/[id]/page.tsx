import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "../PersonForm";
import { DeletePersonButton } from "../DeletePersonButton";
import { PersonAliasEditButton } from "../PersonAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ fromDrama?: string }>;

export default async function EditPersonPage({
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

  const person = await prisma.person.findUnique({
    where: { id, deletedAt: null },
    include: { aliases: true, socialLinks: true }
  });

  if (!person) notFound();

  // Ищем персонажа этого актера в контексте дорамы (если мы пришли из неё)
  let linkedCharacter = null;
  if (fromDrama) {
    const credit = await prisma.credit.findFirst({
      where: {
        personId: id,
        dramaId: Number(fromDrama),
        characterId: { not: null } // Ищем только если есть привязка к персонажу
      },
      include: { character: true }
    });
    linkedCharacter = credit?.character;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* 1. Кнопка возврата (появляется только если мы пришли из дорамы) */}
      {fromDrama && (
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Link
            href={`/admin/dramas/${fromDrama}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к дораме
          </Link>

          {linkedCharacter && (
            <span className="text-sm text-muted flex items-center gap-1.5">
              Персонаж:
              <Link
                href={`/admin/characters/${linkedCharacter.id}?fromDrama=${fromDrama}`}
                className="text-accent hover:underline font-medium"
              >
                {linkedCharacter.name}
              </Link>
            </span>
          )}
        </div>
      )}

      {/* 2. Хлебные крошки */}
      <AdminBreadcrumbs
        items={[
          { label: "Актёры", href: "/admin/people" },
          { label: person.name }
        ]}
      />

      {/* 3. Шапка с именем, кнопкой удаления и алиасами */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap mt-2">
        <div className="flex items-center gap-4 flex-wrap min-w-0">
          <h1 className="text-2xl font-bold">{person.name}</h1>
          <PersonAliasEditButton
            personId={person.id}
            currentAliases={person.aliases.map((a) => a.name)}
          />
        </div>

        <div className="shrink-0">
          <DeletePersonButton personId={person.id} personName={person.name} />
        </div>
      </div>

      {/* 4. Форма с переданным параметром fromDrama */}
      <PersonForm person={person} fromDrama={fromDrama} />
    </div>
  );
}