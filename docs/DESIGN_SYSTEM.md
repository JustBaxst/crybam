# DESIGN_SYSTEM.md: Визуальные паттерны Crybam

## 🎨 Семантические токены

- Фон: `bg-background`, `bg-surface`, `bg-surface/20` (для Bento-блоков).
- Текст: `text-foreground`, `text-muted`, `text-muted/70` (лейблы).
- Границы: `border-border`, `border-border/50` (мягкие).
- Акцент: `text-accent`, `bg-accent`, `bg-accent/10`.
- Эмоции: `text-cry-safe`, `text-cry-happy`, `text-cry-sad`.
  ⚠️ НИКОГДА: `bg-zinc-*`, `bg-gray-*`, `text-gray-*`.
- **Источник правды:** Все цвета объявляются в `app/globals.css` в блоке `@theme`.
- **Базовые токены:** `--background`, `--surface`, `--foreground`, `--muted`, `--border`, `--accent`, `--accent-soft`, `--success`, `--warning`, `--danger`, `--info`, `--cry-safe`, `--cry-happy`, `--cry-sad`.
- **Цветовые схемы (темы):** В `globals.css` предопределены схемы акцента: `rose` (розовый), `amber` (янтарный), `lime` (лаймовый), `emerald` (изумрудный), `cyan` (бирюзовый), `blue` (синий), `pink` (малиновый). Они активируются через `data-accent="название"` на `<html>`.

## 🧱 Паттерн: Bento-блок

Используется для карточек на страницах.

- Классы: `bg-surface/20 p-6 rounded-2xl border border-border/50`.
- Внутри: заголовок с иконкой (`text-lg font-semibold flex items-center gap-2`), затем контент.
- Разделители: `<div className="border-t border-border/50 my-4" />`.

### Паттерн: Bento-дашборд (Админка)

Используется на страницах редактирования сущностей (`/admin/dramas/[id]`, `/admin/people/[id]`, `/admin/characters/[id]`).

- **Hero-сетка:** `grid grid-cols-1 md:grid-cols-4 gap-6 mb-6`.
- **Левая колонка (col-span-1):** Постер/Фото (`aspect-[2/3] rounded-2xl border border-border`).
- **Правая колонка (col-span-3):** Блок «Факты» (`bg-surface/20 p-6 rounded-2xl border border-border/50`).
- **Кнопки действий:** Находятся в шапке страницы (не внутри блоков).
- **Формы:** Скрыты в модальных окнах (открываются по кнопке «Редактировать»).

## 🖼️ Паттерн: Постер и Фотографии (PosterImage)

- **Формат:** Строго прямоугольный `aspect-[2/3]` (для больших постеров) или `w-14 h-20` (для мини-карточек актеров в касте).
- **Скругления:** `rounded-lg`, `rounded-xl` или `rounded-2xl`. ❌ Круглые аватарки (`rounded-full`) запрещены.
- **Объект:** `object-cover`, чтобы не искажать пропорции.
- **Заглушка:** Если картинки нет, показываем иконку из `lucide-react` (например, `<User />` или `<Film />`) и/или название. ❌ Эмодзи (🎬, 👤) запрещены.
- **Источники картинок:** только из белого списка `next.config.ts` (см. `PROJECT_RULES.md`). Новый домен — сначала в конфиг, потом в код.

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

## 🗂️ Паттерн: Табы с Bento-контентом

- Обёртка: `<Tabs>` из `components/ui/tabs.tsx`.
- Список: `TabsList` с `border-b border-border`.
- Триггер: `TabsTrigger` с `data-[state=active]:border-accent data-[state=active]:text-foreground text-muted`.
- Контент таба: Bento-обёртка `bg-surface/20 p-6 rounded-2xl border border-border/50`.
- Заголовок внутри таба: иконка `w-5 h-5 text-accent` + `text-lg font-semibold`.
- Пустое состояние: `text-center py-10 text-muted italic border border-dashed border-border rounded-2xl`.

## 📊 Паттерн: Тепловая карта (Heatmap)

- **Сетка:** Пустые дни — прозрачный фон с тонкой рамкой (`bg-transparent border border-border/60`). Дни с активностью — градация акцентного цвета (`bg-accent/25`, `bg-accent/50` и т.д.).
- **Ховер:** При наведении ячейка увеличивается (`hover:scale-125`) и получает акцентную рамку (`hover:ring-1 hover:ring-accent`).
- **Детализация:** По клику открывается `Popover` (не тултип!), внутри которого можно скроллить список событий.

## 🪟 Паттерн: Модалка (Form)

- Оверлей: `fixed inset-0 bg-background/80 backdrop-blur-sm`.
- Контейнер: `max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-surface`.
- Шапка: `px-6 py-4 border-b border-border` + крестик.
- Тело: `p-6 overflow-y-auto`.
- Футер: `px-6 py-4 border-t border-border` + кнопки.
- Блокировка скролла: обязательно `useLockBodyScroll` **на верхнем уровне компонента** (не внутри обработчиков).
- Ошибка дубля: красный блок с `error` и кнопкой «Открыть её →» (`existingId`).
- **Обязательно:** использовать универсальный `Modal` из `components/ui/modal.tsx`.
- ❌ Запрещено: верстать `fixed inset-0` и шапку с крестиком вручную.
- Для подтверждений (удаление, несохраненные данные) использовать `ConfirmDialog`.

## 🗃️ Паттерн: Popover (Всплывающее меню)

- Базовая обертка: `Popover`, `PopoverTrigger`, `PopoverContent` из `components/ui/popover.tsx`.
- Контейнер (уже настроен в компоненте): `rounded-xl border border-border/50 bg-surface shadow-xl z-50 p-2 w-fit`.
- Отступ от триггера: `sideOffset={6}`.
- Анимация: нативные CSS-транзишены (`transition-opacity data-[state=open]:opacity-100`).
- **Внутренние ссылки (списки):**
  - Обертка: `flex flex-col gap-0.5 mt-1`.
  - Элемент (Link): `flex items-center justify-between px-2 py-1.5 text-sm rounded-lg hover:bg-accent/10 hover:text-accent transition-colors group`.
  - Иконка слева: `w-3.5 h-3.5 text-muted group-hover:text-accent transition-colors`.
  - Число/значение справа: `font-semibold tabular-nums`.
- ❌ Не использовать стандартный `bg-white` или `bg-zinc` внутри поповеров.

## 🖱️ Паттерн: Hover-оверлей (Карточки)

- Фон: `bg-black/85`.
- Появление: `opacity-0 group-hover:opacity-100 transition-opacity`.
- Внутри: синопсис (`line-clamp-[14]`), панель статусов (`CardStatusToolbar`).
- Верхние пилюли (рейтинг/CryTag) при наведении исчезают: `group-hover:opacity-0`.
- Матрешка тегов: кнопка `+N` переключает контент оверлея на теги (жанры, темы, настроения). Только на `md+` (на мобильных оверлей скрыт).

### Панель статусов в оверлее (CardStatusToolbar)

- Кнопки имеют размер `w-8 h-8`, скругление `rounded-lg`.
- Тултипы рисуются кастомно (через `group-hover/btn`), фон — `bg-surface`, текст — `text-foreground`, рамка — `border-border`. ❌ Запрещено использовать `bg-zinc` или `bg-black`.
- Иконки берутся строго из `DRAMA_STATUSES`.

## 🎴 Паттерн: Режимы карточек (Каталог / Избранное / Топы)

Все карточки сущностей (`CatalogCard`, `PeopleCard`, `CharacterCard`) поддерживают несколько режимов через пропсы. Это позволяет переиспользовать один компонент и не дублировать вёрстку.

### Режим «Каталог» (по умолчанию)

- Hover-оверлей с описанием и кнопками действий.
- Верхние пилюли (рейтинг, CryTag, избранное).
- Кнопки действий внутри оверлея.
- ❌ Не создавать отдельные компоненты для каталога.

### Режим «Избранное» (`hideHover={true}`, `showFavoritePills={false}`)

- Без hover-оверлея.
- Без верхних пилюль (или только заметка).
- Возможна заметка (`note`) поверх постера.
- Подпись под именем — стандартная (агентство, роли).
- Используется на страницах `/favorites/*`.

### Режим «Топы» (`hideHover={true}`, `showFavoritePills={false}`, `rank`, `footerText`)

- Без оверлея и пилюль.
- Бейдж с номером места (`rank`) в левом верхнем углу.
- Кастомная подпись (`footerText`) вместо стандартной (например, «X в избранном» или «Y ролей»).
- Ширина задаётся снаружи через `className` (обычно `w-40 shrink-0` для горизонтальных каруселей).
- Используется в топах на дашбордах.

### ⚠️ Правила

- ❌ Не писать кастомную вёрстку карточек внутри страниц — использовать существующие компоненты с пропсами.
- ✅ Перед созданием новой карточки проверить `PROJECT_INDEX.md` — возможно, нужный режим уже реализован.
- ✅ Новые пропсы делать опциональными, чтобы не ломать существующие страницы.

### Кнопки в Hover-оверлее

Все интерактивные элементы поверх затемненного постера должны использовать стиль «стекло»:

- Классы: `bg-surface/20 border border-white/10 text-white text-xs font-medium`.
- Hover: `hover:bg-surface/40 hover:border-accent/40`.
- Активное состояние (например, выбранный статус или «В избранном»): `bg-accent border-accent text-white shadow-md` (или желтый акцент для избранного).
- Иконки внутри кнопок: `text-accent` (или белые в неактивном состоянии).

## 📝 Паттерн: Формы (Input/Select/Textarea)

- Базовые классы инпутов: `w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm`.
- Лейблы: `block text-xs font-medium text-muted mb-1.5`.
- 🎯 **Обязательно:** используем `components/ui/form-elements.tsx` (`FormField`, `FormInput`, `FormSelect`, `FormTextarea`, `FormError`). ❌ Никаких ручных `inputCls` и `labelCls` в формах.
- Импорт из TVmaze: `TvmazeImportModal` → предпросмотр → выбор полей → заполнение формы. Название и синопсис **не импортируются** (на английском).
- Заглушки: `[ОБНОВИТЬ ИНДЕКС]` после создания `form-elements.tsx`.
- **Ошибки:** ❌ Запрещено писать кастомные красные `<div>` или `<p>`. Используйте готовый `FormError` из `form-elements.tsx`.

## 🔤 Паттерн: Обрезка длинных списков

- Функция `processList(arr, limit)` возвращает `{ visible, hidden }`.
- `visible` — первые N элементов, `hidden` — остальные.
- Для скрытых используется `MoreItemsPopover` (каналы, студии, озвучка).

## 📅 Паттерн: Форматирование дат

- Функция `formatAired(from, to)` возвращает красивую строку (без "г.").
- Дублируется в `app/dramas/[id]/page.tsx`. **Рекомендуется вынести в `lib/date-utils.ts`**.
