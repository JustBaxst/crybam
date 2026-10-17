"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePerson } from "../actions";

export function DeletePersonButton({ personId, personName }: { personId: number, personName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Удалить "${personName}"? Действие необратимо.`)) return;
    const formData = new FormData();
    formData.set("personId", String(personId));
    startTransition(async () => {
      const result = await deletePerson(formData);
      if (result?.error) alert(result.error);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" /> Удалить
    </button>
  );
}