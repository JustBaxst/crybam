import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CharacterForm } from "../CharacterForm";

export default async function NewCharacterPage() {
  const dramas = await prisma.drama.findMany({
    select: { id: true, title: true, year: true },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/admin/characters"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Назад к списку
      </Link>
      <h1 className="text-2xl font-bold mb-6">Новый персонаж</h1>
      <CharacterForm dramas={dramas} />
    </div>
  );
}