export type StatusLevel = "green" | "yellow" | "red";

/**
 * Определяет статус заполненности дорамы.
 * Красный: нет альтернативных названий.
 * Зелёный: есть альты, постер, описание, жанры и актёры.
 * Жёлтый: есть альты, но не хватает чего-то ещё.
 */
export function getDramaStatusLevel(params: {
    hasAltTitles: boolean;
    hasPoster: boolean;
    hasGenres: boolean;
    hasCredits: boolean;
    hasSynopsis: boolean;
}): StatusLevel {
    if (!params.hasAltTitles) return "red";
    if (params.hasPoster && params.hasGenres && params.hasCredits && params.hasSynopsis) {
        return "green";
    }
    return "yellow";
}

/**
 * Определяет статус заполненности персоны.
 * Красный: нет алиасов.
 * Зелёный: есть алиасы, фото и био.
 * Жёлтый: есть алиасы, но не хватает фото или био.
 */
export function getPersonStatusLevel(params: {
    hasAliases: boolean;
    hasPhoto: boolean;
    hasBio: boolean;
}): StatusLevel {
    if (!params.hasAliases) return "red";
    if (params.hasPhoto && params.hasBio) return "green";
    return "yellow";
}

/**
 * Определяет статус заполненности персонажа.
 * Красный: нет алиасов.
 * Зелёный: есть алиасы, фото и описание.
 * Жёлтый: есть алиасы, но не хватает фото или описания.
 */
export function getCharacterStatusLevel(params: {
    hasAliases: boolean;
    hasImage: boolean;
    hasDescription: boolean;
}): StatusLevel {
    if (!params.hasAliases) return "red";
    if (params.hasImage && params.hasDescription) return "green";
    return "yellow";
}