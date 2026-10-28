export function getActionLabel(action: string): string {
    switch (action) {
        case "DRAMA_CREATED": return "добавил(а) дораму";
        case "DRAMA_UPDATED": return "обновил(а) дораму";
        case "DRAMA_DELETED": return "удалил(а) дораму";
        case "DRAMA_COMPLETED": return "завершил(а) карточку";

        case "PERSON_CREATED": return "добавил(а) актера";
        case "PERSON_UPDATED": return "обновил(а) актера";
        case "PERSON_DELETED": return "удалил(а) актера";
        case "PERSON_COMPLETED": return "завершил(а) карточку";

        case "CHARACTER_CREATED": return "добавил(а) персонажа";
        case "CHARACTER_UPDATED": return "обновил(а) персонажа";
        case "CHARACTER_DELETED": return "удалил(а) персонажа";
        case "CHARACTER_COMPLETED": return "завершил(а) карточку";

        default: return action;
    }
}