import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "../PersonForm";
import { DeletePersonButton } from "./DeletePersonButton";

type Params = Promise<{ id: string }>;

export default async function EditPersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/people" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </Link>
        <DeletePersonButton personId={person.id} personName={person.name} />
      </div>
      
      <h1 className="text-2xl font-bold mb-6">{person.name}</h1>
      <PersonForm person={person} />
    </div>
  );
}