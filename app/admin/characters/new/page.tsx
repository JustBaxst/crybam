import { prisma } from "@/lib/prisma";
import { CharacterForm } from "../CharacterForm";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

export default async function NewCharacterPage() {
  const dramas = await prisma.drama.findMany({
    select: { id: true, title: true, year: true },
    orderBy: [{ year: "desc" }, { title: "asc" }],
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Правильные крошки */}
      <AdminBreadcrumbs items={[{ label: "Персонажи", href: "/admin/characters" }, { label: "Создание" }]} />
      
      <h1 className="text-2xl font-bold mb-6">Новый персонаж</h1>
      <CharacterForm dramas={dramas} />
    </div>
  );
}