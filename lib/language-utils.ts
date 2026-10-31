/**
 * Определяет язык текста по диапазону символов.
 * Используется для альтернативных названий и имен.
 */
export const detectLanguage = (text: string): string => {
    if (/[\uAC00-\uD7AF]/.test(text)) return "ko"; // Корейский
    if (/[а-яА-Я]/.test(text)) return "ru";        // Русский
    if (/[\u4e00-\u9fa5]/.test(text)) return "zh"; // Китайский
    if (/[\u3040-\u30ff]/.test(text)) return "ja"; // Японский
    if (/[a-zA-Z]/.test(text)) return "en";        // Английский
    return "unknown";
};