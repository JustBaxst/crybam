import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "../PersonForm";
import { DeletePersonButton } from "./DeletePersonButton";
import { PersonAliasEditButton } from "../PersonAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { ArrowLeft, Link } from "lucide-react";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ fromDrama?: string }>;

export default async function EditPersonPage({ params, searchParams }: { params: Params, searchParams: SearchParams; }) {
  const { id: rawId } = await params;
  const { fromDrama } = await searchParams;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({ 
    where: { id },
    include: { aliases: true, socialLinks: true } 
  });
  
  if (!person) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Крошки теперь на своей строке */}
      <AdminBreadcrumbs 
        items={[
          { label: "Актёры", href: "/admin/people" }, 
          { label: person.name }
        ]} 
      />

            {/* Кнопка возврата, если мы пришли из дорамы */}
      {fromDrama && (
        <Link
          href={`/admin/dramas/${fromDrama}`}
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к дораме
        </Link>
      )}

      {/* Твои хлебные крошки */}
      <AdminBreadcrumbs 
        items={[
          { label: "Актёры", href: "/admin/people" },
          { label: person.name }
        ]} 
      />

      {/* Шапка с именем, кнопкой удаления и алиасами */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
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

            <PersonForm person={person} fromDrama={fromDrama} />
      
    </div>
    
  );
}