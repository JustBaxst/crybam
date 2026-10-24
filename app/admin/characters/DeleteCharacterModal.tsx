"use client";

import { useState, useTransition } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { deleteCharacter } from "./actions";

export function DeleteCharacterModal({
    characterId,
    characterName,
    onClose,
}: {
    characterId: number;
    characterName: string;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        const formData = new FormData();
        formData.set("characterId", String(characterId));

        startTransition(async () => {
            const result = await deleteCharacter(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl">
                <div className="flex items-start gap-3 p-6">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-base mb-1">Удалить персонажа?</h2>
                        <p className="text-sm text-muted">
                            «{characterName}» будет удален из базы. Действие необратимо.
                        </p>
                        {error && <p className="text-sm text-red-400 mt-2 font-medium">{error}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        autoFocus
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg border border-border text-sm hover:border-accent/40 transition-colors disabled:opacity-50"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isPending ? "Удаление..." : "Удалить"}
                    </button>
                </div>
            </div>
        </div>
    );
}