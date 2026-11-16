import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Ruler,
  Droplet,
  Brain,
  Star,
  Film,
  FileText,
  Share2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeletePersonButton } from "../DeletePersonButton";
import { PersonAliasEditButton } from "../PersonAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { EditPersonButton } from "../EditPersonButton";
import { SocialLinks } from "@/components/people/SocialLinks";
import Image from "next/image";
import { Tooltip } from "@/components/Tooltip";

type Params = Promise<{ id: string }>;

export default async function EditPersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({
    where: { id, deletedAt: null },
    include: {
      aliases: true,
      socialLinks: true,
      credits: {
        include: { drama: true, character: true },
        orderBy: { drama: { year: "desc" } },
      },
    },
  });

  if (!person) notFound();

  const getAge = (date: Date | null) =>
    date
      ? Math.floor((Date.now() - new Date(date).getTime()) / 31557600000)
      : null;
  const age = getAge(person.birthDate);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Актёры", href: "/admin/people" },
          { label: person.name },
        ]}
      />

      {/* Шапка */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap mt-2">
        <div className="flex items-center gap-4 flex-wrap min-w-0">
          <h1 className="text-2xl font-bold">{person.name}</h1>
          <PersonAliasEditButton
            personId={person.id}
            currentAliases={person.aliases.map((a) => a.name)}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditPersonButton person={person} />
          <DeletePersonButton personId={person.id} personName={person.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Левая колонка: Фото */}
        <div className="md:col-span-1">
          <div className="relative aspect-2/3 rounded-2xl overflow-hidden border border-border bg-surface/20">
            {person.photoUrl ? (
              <Image
                src={person.photoUrl}
                alt={person.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-muted/30" />
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Факты */}
        <div className="md:col-span-3">
          <section className="bg-surface/20 p-6 rounded-2xl border border-border/50 h-full">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Факты
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <FactRow
                Icon={Calendar}
                label="Дата рождения"
                value={
                  person.birthDate
                    ? new Date(person.birthDate).toLocaleDateString("ru-RU")
                    : null
                }
                sub={age ? `${age} лет` : undefined}
              />
              <FactRow
                Icon={MapPin}
                label="Место рождения"
                value={person.birthPlace}
              />
              <FactRow
                Icon={Ruler}
                label="Рост"
                value={person.height ? `${person.height} см` : null}
              />
              <FactRow
                Icon={Droplet}
                label="Группа крови"
                value={person.bloodType}
              />
              <FactRow Icon={Brain} label="MBTI" value={person.mbti} />
              <FactRow
                Icon={Star}
                label="Зодиак"
                value={[person.zodiacWestern, person.zodiacChinese]
                  .filter(Boolean)
                  .join(" / ")}
              />
            </div>
            <div className="border-t border-border/50 my-6" />
            <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Агентство и соцсети
            </h2>
            <div className="space-y-4">
              <p className="text-sm">
                <span className="text-muted">Агентство:</span>{" "}
                {person.agency || "—"}
              </p>
              {person.socialLinks.length > 0 ? (
                <SocialLinks links={person.socialLinks} />
              ) : (
                <p className="text-xs text-muted/50 italic">
                  Соцсети не заполнены
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Блок Биография */}
      <section className="bg-surface/20 p-6 rounded-2xl border border-border/50 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Биография
        </h2>
        {person.bio ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {person.bio}
          </p>
        ) : (
          <p className="text-xs text-muted/50 italic">
            Биография пока не заполнена
          </p>
        )}
      </section>

      {/* Блок Роли */}
      <section className="bg-surface/20 p-6 rounded-2xl border border-border/50">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4 flex items-center gap-2">
          <Film className="w-4 h-4" /> Роли в дорамах ({person.credits.length})
        </h2>
        {person.credits.length === 0 ? (
          <p className="text-xs text-muted/50 italic">
            Актер пока не добавлен ни в одну дораму
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {person.credits.map((c) => (
              <Link
                key={c.id}
                href={`/admin/dramas/${c.dramaId}`}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-accent/40 transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-semibold truncate">
                    {c.drama.title}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {c.character
                      ? `Роль: ${c.character.name}`
                      : "Роль не указана"}
                  </p>
                </div>
                <span className="text-xs text-muted shrink-0">
                  {c.drama.year || ""}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FactRow({
  Icon,
  label,
  value,
  sub,
}: {
  Icon: any;
  label: string;
  value: string | number | null;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-foreground truncate">
          {value || <span className="text-muted/50">—</span>}
        </p>
        {sub && <p className="text-[11px] text-muted/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
