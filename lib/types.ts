// lib/types.ts
export type EntryData = {
    status: string;
    rating: number | null;
    cryTag: string | null;
    impression: string | null;
    review: string | null;
    quote: string | null;
    notes: string | null;
    progress: number | null;
    rewatchCount: number;
    startedAt: Date | null;
    watchedAt: Date | null;
    isFavorite: boolean; // ← Теперь это поле есть в едином типе для всех
};