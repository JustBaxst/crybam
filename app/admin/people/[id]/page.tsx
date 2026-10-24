import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
      <div className="flex items-center justify-between mb-6">
      <AdminBreadcrumbs 
        items={[
          { label: "Персонажи", href: "/admin/characters" },
          { label: person.name }
        ]} 
      />
        <DeletePersonButton personId={person.id} personName={person.name} />
      </div>
      
      {/* Шапка с именем и кнопкой */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <PersonAliasEditButton 
          personId={person.id} 
          currentAliases={person.aliases.map((a) => a.name)} 
        />
      </div>

      {/* Сама форма редактирования (она была случайно удалена) */}
      <PersonForm person={person} />
    </div>
  );
}