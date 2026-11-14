# PAGE_RECIPES.md: Рецепты страниц

## Рецепт 1: Bento-страница сущности
(Используется: `/dramas/[id]`, `/people/[id]`, `/characters/[id]`)

**Структура:**
1. **Хлебные крошки:** `text-sm text-muted mb-6`.
2. **Заголовок:** `text-[clamp(1.75rem,3vw,2.5rem)] font-bold` + альтернативные имена.
3. **Hero-сетка (`grid grid-cols-4 gap-6 mb-10`):**
   - **Левая (col-span-1):** Постер `aspect-[2/3]` + кнопка действия (`StatusDropdown` для дорам, `FavoriteActorButton` для актеров).
   - **Центр (col-span-2):** Bento-блок «О ...» (2 колонки фактов).
   - **Правая (col-span-1):** Bento-блок «Действия» (для актеров — `SocialLinks` с максимум 5 видимыми иконками и поповером `+N`).
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
   - Тулбар фильтров: `CatalogToolbar` (дорамы), `PeopleToolbar` (актеры), `CharactersToolbar` (персонажи). Внутри — `SearchableSelect` для списков с поиском.
   - Активные фильтры (плашки с крестиком и функцией `buildClearUrl`).
3. **Сетка карточек:** `CatalogCard` (с рейтингом Crybam, hover-оверлеем и `CardStatusToolbar`).

## Рецепт 3: Дашборд (Избранные актеры)
1. **Заголовок** с короной.
2. **Сетка статистики** (`grid-cols-2 md:grid-cols-3 lg:grid-cols-6`). 6 Bento-блоков: Всего в избранном, Средний возраст, Всего ролей, Топ-агентство, Топ-MBTI, Топ-Зодиак.
3. **Сетка карточек** (Твои избранные, до 4 колонок).
4. **Горизонтальные карусели:** «Топ среди фанатов» (глобальный) и «Топ по ролям» (среди избранных).

## Рецепт 4: Форма создания/редактирования
(Используется: `NewDramaForm`, `PersonForm`, `EditEntryForm`, `EditDramaForm`)

**Структура:**
1. **Обертка:** `rounded-2xl border border-border bg-surface p-6 space-y-8`.
2. **Секции:** `FormSection` (иконка + заголовок + описание + поля).
3. **Поля:** использовать `components/ui/form-elements.tsx` (FormInput, FormSelect, FormTextarea) — после его создания.
4. **Импорт:** кнопка `TvmazeImportModal` (предпросмотр с чекбоксами, исключая название и синопсис на английском).
5. **Кнопка:** `Button` с `type="submit"` + `isPending` для дизейбла.
6. **Ошибки:** красный блок с `error` и кнопкой «Открыть её →» (для дублей `existingId`).
7. **Планируется:** Sticky-панель справа со статусом заполнения (чек-лист).

## Рецепт 5: Таб «Галерея»
1. Bento-обёртка.
2. Заголовок с иконкой `Image`.
3. Секции: «Трейлеры», «Кадры», «Постеры».
4. Пустое состояние — dashed-блок.