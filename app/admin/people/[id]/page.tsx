import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "../PersonForm";
import { DeletePersonButton } from "./DeletePersonButton";
import { PersonAliasEditButton } from "../PersonAliasEditButton";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

type Params = Promise<{ id: string }>;

export default async function EditPersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
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
          { label: "Актёры", href: "/admin/people" }, // ← ИСПРАВЛЕНО
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

      <PersonForm person={person} />
    </div>
  );
}