"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteCharacterModal } from "./DeleteCharacterModal";

export function CharacterActions({ characterId, characterName }: { characterId: number; characterName: string }) {
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="flex items-center justify-end relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                        aria-label="Действия"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                        onClick={() => router.push(`/admin/characters/${characterId}`)}
                        className="cursor-pointer"
                    >
                        <Pencil className="w-4 h-4 text-muted mr-2" />
                        Редактировать
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => setModalOpen(true)}
                        className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {modalOpen && (
                <DeleteCharacterModal
                    characterId={characterId}
                    characterName={characterName}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}