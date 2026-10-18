"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCharacter } from "../actions";

export function DeleteCharacterButton({
  characterId,
  characterName,
}: {
  characterId: number;
  characterName: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Удалить персонажа "${characterName}"? Действие необратимо.`))
      return;

    const formData = new FormData();
    formData.set("characterId", String(characterId));

    startTransition(async () => {
      const result = await deleteCharacter(formData);
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