import { Prisma } from "@prisma/client";

/**
 * Возвращает условие для поиска по дорамам (основное и альтернативные названия)
 */
export function getDramaSearchWhere(query: string): Prisma.DramaWhereInput | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  return {
    OR: [
      { titleLower: { contains: q } },
      { titles: { some: { titleLower: { contains: q } } } },
    ],
  };
}

/**
 * Возвращает условие для поиска по актерам (основное имя и альтернативные)
 */
export function getPersonSearchWhere(query: string): Prisma.PersonWhereInput | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  return {
    OR: [
      { nameLower: { contains: q } },
      { aliases: { some: { nameLower: { contains: q } } } },
    ],
  };
}

/**
 * Возвращает условие для поиска по персонажам (основное имя и альтернативные)
 */
export function getCharacterSearchWhere(query: string): Prisma.CharacterWhereInput | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  return {
    OR: [
      { nameLower: { contains: q } },
      { aliases: { some: { nameLower: { contains: q } } } }, 
    ],
  };
}