import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PersonForm } from "../PersonForm";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

export default function NewPersonPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/admin/people" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад к списку
      </Link>
      <h1 className="text-2xl font-bold mb-6">Новый человек</h1>
      <PersonForm />
    </div>
  );
}
<AdminBreadcrumbs items={[{ label: "Дорамы", href: "/admin/dramas" }, { label: "Создание" }]} />