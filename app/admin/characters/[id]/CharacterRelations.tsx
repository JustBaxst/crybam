"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Heart, Users, Swords, Home } from "lucide-react";
import { addCharacterRelation, deleteCharacterRelation } from "../actions";

type Relation = {
  id: number;
  relationType: string;
  relation: string;
  target: { id: number; name: string };
};

type Option = { id: number; name: string };

export function CharacterRelations({
  characterId,
  relations,
  availableCharacters,
}: {
  characterId: number;
  relations: Relation[];
  availableCharacters: Option[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("fromId", String(characterId));

    startTransition(async () => {
      const result = await addCharacterRelation(formData);
      if (result?.error) setError(result.error);
      else (e.target as HTMLFormElement).reset();
    });
  };

  const handleDelete = (id: number) => {
    const formData = new FormData();
    formData.set("relationId", String(id));
    formData.set("characterId", String(characterId));

    startTransition(async () => {
      await deleteCharacterRelation(formData);
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "family": return <Home className="w-4 h-4 text-blue-400" />;
      case "romance": return <Heart className="w-4 h-4 text-pink-400" />;
      case "friendship": return <Users className="w-4 h-4 text-green-400" />;
      case "rivalry": return <Swords className="w-4 h-4 text-red-400" />;
      default: return <Users className="w-4 h-4 text-muted" />;
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm";

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 mt-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-accent" />
        Связи с персонажами
      </h2>

      {/* Список текущих связей */}
      {relations.length > 0 && (
        <div className="space-y-2 mb-6">
          {relations.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-background border border-border">
              <div className="flex items-center gap-2 text-sm">
                {getIcon(r.relationType)}
                <span className="text-muted">Этот персонаж — <span className="text-foreground">{r.relation}</span> для</span>
                <span className="font-medium text-accent">{r.target.name}</span>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={isPending}
                className="text-muted hover:text-red-400 transition-colors p-1"
                title="Удалить связь"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-background p-4 rounded-xl border border-border">
        <div className="md:col-span-1">
          <label className="block text-xs text-muted mb-1.5">Тип связи</label>
          <select name="relationType" className={inputCls} required>
            <option value="family">Семья</option>
            <option value="romance">Романтика</option>
            <option value="friendship">Дружба</option>
            <option value="rivalry">Вражда</option>
          </select>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-xs text-muted mb-1.5">Кто он для цели</label>
          <input type="text" name="relation" placeholder="отец, брат, муж..." required className={inputCls} />
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs text-muted mb-1.5">Целевой персонаж</label>
          <select name="toId" className={inputCls} required defaultValue="">
            <option value="" disabled>— выбери —</option>
            {availableCharacters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </form>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}