export function getActionLabel(action: string): string {
    switch (action) {
        case "DRAMA_CREATED": return "добавил(а) дораму";
        case "DRAMA_UPDATED": return "обновил(а) данные дорамы";
        case "DRAMA_DELETED": return "удалил(а) дораму";
        case "DRAMA_COMPLETED": return "завершил(а) карточку";
        case "DRAMA_TITLES_UPDATED": return "обновил(а) названия дорамы";
        case "DRAMA_GENRES_UPDATED": return "обновил(а) жанры дорамы";
        case "DRAMA_MOODS_UPDATED": return "обновил(а) настроения дорамы";
        case "DRAMA_THEMES_UPDATED": return "обновил(а) темы дорамы";
        case "SOUNDTRACK_ADDED": return "добавил(а) саундтрек";
        case "SOUNDTRACK_REMOVED": return "удалил(а) саундтрек";

        case "PERSON_CREATED": return "добавил(а) актера";
        case "PERSON_UPDATED": return "обновил(а) данные актера";
        case "PERSON_DELETED": return "удалил(а) актера";
        case "PERSON_COMPLETED": return "завершил(а) карточку актера";
        case "PERSON_ALIASES_UPDATED": return "обновил(а) имена актера";

        case "CHARACTER_CREATED": return "добавил(а) персонажа";
        case "CHARACTER_UPDATED": return "обновил(а) данные персонажа";
        case "CHARACTER_DELETED": return "удалил(а) персонажа";
        case "CHARACTER_COMPLETED": return "завершил(а) карточку персонажа";
        case "CHARACTER_ALIASES_UPDATED": return "обновил(а) имена персонажа";
        case "CHARACTER_RELATION_ADDED": return "добавил(а) связь персонажу";
        case "CHARACTER_RELATION_REMOVED": return "удалил(а) связь у персонажа";

        case "CREDIT_ADDED": return "добавил(а) в каст";
        case "CREDIT_UPDATED": return "обновил(а) роль в касте";
        case "CREDIT_REMOVED": return "удалил(а) из каста";

        default: return action;
    }
}