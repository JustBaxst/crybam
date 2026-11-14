# DESIGN_SYSTEM.md: Визуальные паттерны Crybam

## 🎨 Семантические токены
- Фон: `bg-background`, `bg-surface`, `bg-surface/20` (для Bento-блоков).
- Текст: `text-foreground`, `text-muted`, `text-muted/70` (лейблы).
- Границы: `border-border`, `border-border/50` (мягкие).
- Акцент: `text-accent`, `bg-accent`, `bg-accent/10`.
- Эмоции: `text-cry-safe`, `text-cry-happy`, `text-cry-sad`.
⚠️ НИКОГДА: `bg-zinc-*`, `bg-gray-*`, `text-gray-*`.

## 🧱 Паттерн: Bento-блок
Используется для карточек на страницах.
- Классы: `bg-surface/20 p-6 rounded-2xl border border-border/50`.
- Внутри: заголовок с иконкой (`text-lg font-semibold flex items-center gap-2`), затем контент.
- Разделители: `<div className="border-t border-border/50 my-4" />`.

## 🖼️ Паттерн: Постер (PosterImage)
- Aspect: `aspect-[2/3]`.
- Скругления: `rounded-xl` или `rounded-2xl`.
- Заглушка: если картинки нет, показываем иконку 🎬 и название.

## 🏷️ Паттерн: Пилюли (Badges/Tags)
- Жанры: `bg-accent/10 text-accent border border-accent/20 rounded-full px-2 py-0.5 text-[10px]`.
- Темы: `text-blue-400`, `#хештег`.
- Настроения: `text-purple-400`.
- Рейтинг (карточка): `bg-black/60 backdrop-blur-md rounded-full h-6 px-2 text-xs font-semibold`.
- Рейтинг Crybam (блок оценок): акцентная пилюля `bg-accent/10 border-accent/30 text-accent font-bold`, выводится **первой**, при отсутствии оценок — прочерк `—`.
- Внешние рейтинги (KP, MDL, IMDb): `bg-surface border border-border rounded-md px-2 py-1.5 text-[11px]`. Douban удалён из интерфейса.

## 😢 Паттерн: CryTag
- Источник правды: `lib/cry-tags.ts` (`CRY_TAGS`, `isCryTag`).
- Отображение: `components/CryBadge.tsx` или `components/ui/cry-tag-display.tsx`.
- Селектор: `components/drama/CryTagSelector.tsx`.
- Статистика: `components/drama/CryTagStats.tsx` (прогресс-бары с процентами).
- ⚠️ Не хардкодить иконки/цвета в компонентах — только из `CRY_TAGS`.

## 🪟 Паттерн: Модалка (Form)
- Оверлей: `fixed inset-0 bg-background/80 backdrop-blur-sm`.
- Контейнер: `max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-surface`.
- Шапка: `px-6 py-4 border-b border-border` + крестик.
- Тело: `p-6 overflow-y-auto`.
- Футер: `px-6 py-4 border-t border-border` + кнопки.
- Блокировка скролла: обязательно `useLockBodyScroll` **на верхнем уровне компонента** (не внутри обработчиков).
- Ошибка дубля: красный блок с `error` и кнопкой «Открыть её →» (`existingId`).

## 🖱️ Паттерн: Hover-оверлей (Карточки)
- Фон: `bg-black/85`.
- Появление: `opacity-0 group-hover:opacity-100 transition-opacity`.
- Внутри: синопсис (`line-clamp-[14]`), панель статусов (`CardStatusToolbar`).
- Верхние пилюли (рейтинг/CryTag) при наведении исчезают: `group-hover:opacity-0`.
- Матрешка тегов: кнопка `+N` переключает контент оверлея на теги (жанры, темы, настроения). Только на `md+` (на мобильных оверлей скрыт).

### Кнопки в Hover-оверлее
Все интерактивные элементы поверх затемненного постера должны использовать стиль «стекло»:
- Классы: `bg-surface/20 border border-white/10 text-white text-xs font-medium`.
- Hover: `hover:bg-surface/40 hover:border-accent/40`.
- Активное состояние (например, выбранный статус или «В избранном»): `bg-accent border-accent text-white shadow-md` (или желтый акцент для избранного).
- Иконки внутри кнопок: `text-accent` (или белые в неактивном состоянии).

## 📝 Паттерн: Формы (Input/Select/Textarea)
- Базовые классы инпутов: `w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm`.
- Лейблы: `block text-xs font-medium text-muted mb-1.5`.
- 🎯 Цель: вынести в `components/ui/form-elements.tsx` (`FormLabel`, `FormInput`, `FormSelect`, `FormTextarea`) и перестать дублировать классы.
- Импорт из TVmaze: `TvmazeImportModal` → предпросмотр → выбор полей → заполнение формы. Название и синопсис **не импортируются** (на английском).
- Заглушки: `[ОБНОВИТЬ ИНДЕКС]` после создания `form-elements.tsx`.

## 🔤 Паттерн: Обрезка длинных списков
- Функция `processList(arr, limit)` возвращает `{ visible, hidden }`.
- `visible` — первые N элементов, `hidden` — остальные.
- Для скрытых используется `MoreItemsPopover` (каналы, студии, озвучка).

## 📅 Паттерн: Форматирование дат
- Функция `formatAired(from, to)` возвращает красивую строку (без "г.").
- Дублируется в `app/dramas/[id]/page.tsx`. **Рекомендуется вынести в `lib/date-utils.ts`**.