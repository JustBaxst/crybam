import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  UserCircle,
  FileText,
  Calendar,
  Ruler,
  Briefcase,
  User,
  Film,
  Edit,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteCharacterButton } from "./DeleteCharacterButton";
import { CharacterRelations } from "./CharacterRelations";
import { updateCharacterAliases } from "../actions";
import { AliasEditButton } from "@/components/AliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { EditCharacterButton } from "../EditCharacterButton";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ fromDrama?: string }>;

export default async function EditCharacterPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id: rawId } = await params;
  const { fromDrama } = await searchParams;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const character = await prisma.character.findUnique({
    where: { id, deletedAt: null },
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
    where: { dramaId: character.dramaId, id: { not: id }, deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const dramas = await prisma.drama.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true, year: true },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  const formattedRelations = relations.map((r) => ({
    id: r.id,
    relationType: r.relationType,
    relation: r.relation,
    target: r.to,
  }));

  // Ищем актера, который играет этого персонажа
  const credit = await prisma.credit.findFirst({
    where: { characterId: id, roleType: "actor", person: { deletedAt: null } },
    include: { person: true },
  });
  const linkedActor = credit?.person;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Кнопка возврата (если пришли из дорамы) */}
      {fromDrama && (
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Link
            href={`/admin/dramas/${fromDrama}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к дораме
          </Link>
        </div>
      )}

      <AdminBreadcrumbs
        items={[
          { label: "Персонажи", href: "/admin/characters" },
          { label: character.name },
        ]}
      />

      {/* Шапка */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap mt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <AliasEditButton
              buttonText="Другие имена"
              icon={<Edit className="w-4 h-4" />}
              title="Другие имена персонажа"
              description="Добавляй сюда разные варианты написания (транслитерации), чтобы поиск находил персонажа."
              placeholder={"Ё Джин Гу\nЁ Чжин-гу\nYeo Jin-goo"}
              entityId={character.id}
              idField="characterId"
              fieldName="aliases"
              currentAliases={character.aliases.map((a) => a.name)}
              action={updateCharacterAliases}
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

        <div className="flex items-center gap-2 shrink-0">
          <EditCharacterButton character={character} dramas={dramas} />
          <DeleteCharacterButton
            characterId={character.id}
            characterName={character.name}
          />
        </div>
      </div>

      {/* Bento-сетка */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Левая колонка: Фото */}
        <div className="md:col-span-1">
          <div className="relative aspect-2/3 rounded-2xl overflow-hidden border border-border bg-surface/20">
            {character.imageUrl ? (
              <Image
                src={character.imageUrl}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-muted/30" />
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Факты */}
        <div className="md:col-span-3">
          <section className="bg-surface/20 p-6 rounded-2xl border border-border/50 h-full">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> Факты
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <FactRow
                Icon={User}
                label="Пол"
                value={
                  character.gender === "male"
                    ? "Мужской"
                    : character.gender === "female"
                      ? "Женский"
                      : character.gender === "other"
                        ? "Другой"
                        : null
                }
              />
              <FactRow
                Icon={Briefcase}
                label="Профессия / Роль"
                value={character.occupation}
              />
              <FactRow Icon={Ruler} label="Рост" value={character.height} />
              <FactRow Icon={Calendar} label="Возраст" value={character.age} />
              <FactRow
                Icon={Calendar}
                label="День рождения"
                value={character.birthDate}
              />

              {linkedActor && (
                <FactRow
                  Icon={Film}
                  label="Играет актер"
                  value={
                    <Link
                      href={`/admin/people/${linkedActor.id}`}
                      className="text-accent hover:underline"
                    >
                      {linkedActor.name}
                    </Link>
                  }
                />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Блок Описание */}
      <section className="bg-surface/20 p-6 rounded-2xl border border-border/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Описание
        </h2>
        {character.description ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {character.description}
          </p>
        ) : (
          <p className="text-xs text-muted/50 italic">
            Описание пока не заполнено
          </p>
        )}
      </section>

      {/* Блок Связи (используем готовый компонент) */}
      <CharacterRelations
        characterId={character.id}
        relations={formattedRelations}
        availableCharacters={availableCharacters}
      />
    </div>
  );
}

function FactRow({
  Icon,
  label,
  value,
}: {
  Icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted uppercase tracking-wide">
          {label}
        </p>
        <div className="text-sm text-foreground truncate">
          {value || <span className="text-muted/50">—</span>}
        </div>
      </div>
    </div>
  );
}
