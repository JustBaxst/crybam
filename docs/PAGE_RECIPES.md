# PAGE_RECIPES.md: Рецепты страниц

## Рецепт 1: Bento-страница сущности
(Используется: `/dramas/[id]`, `/people/[id]`, `/characters/[id]`)

**Структура:**
1. **Хлебные крошки:** `text-sm text-muted mb-6`.
2. **Заголовок:** `text-[clamp(1.75rem,3vw,2.5rem)] font-bold` + альтернативные имена.
3. **Hero-сетка (`grid grid-cols-4 gap-6 mb-10`):**
   - **Левая (col-span-1):** Постер `aspect-[2/3]` + кнопка действия (Статус / В избранное).
   - **Центр (col-span-2):** Bento-блок «О ...» (2 колонки фактов).
   - **Правая (col-span-1):** Bento-блок «Действия» (соцсети, тултипы).
4. **Широкий блок:** Синопсис / Биография (Bento, с разделителем под заголовком).
5. **Табы:** Radix UI, стилизованные под дизайн.

**Компоненты:** `Tabs`, `RatingWidget`, `CardStatusToolbar`, `CryTagSelector`, `CryTagStats`, `TagsPopover`, `MoreItemsPopover`, `SoundtrackPlayer`, `AlternativeTitles`, `StatusDropdown`, `FavoriteActorButton`.

## Рецепт 2: Каталог с фильтрами
(Используется: `/dramas`, `/people`, `/characters`)

**Структура:**
1. **Заголовок** + счетчик.
2. **Блок «Навигация»** (`bg-surface/20 rounded-2xl p-6`):
   - Заголовок с иконкой `Compass`.
   - Поиск (`AdminSearchBar`).
   - Тулбар фильтров (`CatalogToolbar`, `PeopleToolbar`, `CharactersToolbar`).
   - Активные фильтры (плашки с крестиком).
3. **Сетка карточек** (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5`).

## Рецепт 3: Дашборд (Избранные актеры)
1. **Заголовок** с короной.
2. **Сетка статистики** (`grid-cols-6`). Bento-блоки с цифрами и иконками.
3. **Сетка карточек** (избранные).
4. **Горизонтальные карусели** (Топы).

## Рецепт 4: Форма создания/редактирования
(Используется: `NewDramaForm`, `PersonForm`, `EditEntryForm`, `EditDramaForm`)

**Структура:**
1. **Обертка:** `rounded-2xl border border-border bg-surface p-6 space-y-8`.
2. **Секции:** `FormSection` (иконка + заголовок + описание + поля).
3. **Поля:** инпуты с классами `w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent`.
4. **Кнопка:** `Button` с `type="submit"` + `isPending` для дизейбла.
5. **Ошибки:** красный блок с `error` и кнопкой «Открыть её →» (для дублей).