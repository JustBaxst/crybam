"use client";

import { useState } from "react";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { DeleteCharacterModal } from "./DeleteCharacterModal";

export function CharacterActions({ characterId, characterName }: { characterId: number; characterName: string }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-end relative">
            <ActionDropdown
                editHref={`/admin/characters/${characterId}`}
                onDeleteClick={() => setModalOpen(true)}
            />

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