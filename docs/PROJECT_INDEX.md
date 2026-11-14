# PROJECT_INDEX.md — Карта проекта Crybam

## components/ui/
### button.tsx
Базовый компонент кнопки. Варианты: default, outline, ghost, destructive. Размеры: default, sm, lg, icon.
export Button: (props: ButtonProps) => JSX.Element
client: no

### dropdown-menu.tsx
Обертка над Radix UI. Не импортировать Radix напрямую!
export DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator
client: yes
Не дублировать: отдельные меню для Drama/Person/Character.

### searchable-select.tsx
Выпадающий список с поиском (для фильтров).
export SearchableSelect: (props: {...}) => JSX.Element
client: yes

### cry-tag-display.tsx
Отображение эмоции (CryTag) с иконкой и цветом.
export CryTagDisplay: (props: { tag: CryTag; showIcon?: boolean; size?: "sm" | "md" | "lg"; variant?: "badge" | "text" }) => JSX.Element
client: no

### rating.tsx
Компонент оценки (10 полосок, поддержка половинок).
export Rating: (props: { initialValue?: number | null; onChange?: (val: number) => void }) => JSX.Element
client: yes

### tabs.tsx
Обертка над Radix Tabs.
export Tabs, TabsList, TabsTrigger, TabsContent
client: yes

### popover.tsx
Обертка над Radix Popover.
export Popover, PopoverTrigger, PopoverContent
client: yes

### split-button.tsx
Гибридная кнопка (основное действие + dropdown).
export SplitButton: (props: {...}) => JSX.Element
client: yes

## components/admin/
### ActionDropdown.tsx
Единое выпадающее меню действий для списков админки (Редактировать, Удалить).
export ActionDropdown: (props: { editHref: string; onDeleteClick: () => void; editLabel?: string; deleteLabel?: string }) => JSX.Element
client: yes
Не дублировать: отдельные меню для Drama/Person/Character.

### AdminHeatmap.tsx [DEPRECATED]
⚠️ Устарел. Используй `YearHeatmap` из components/YearHeatmap.tsx.
Не использовать в новых фичах.

### AliasBadge.tsx
Плашка с количеством альтернативных имен.
export AliasBadge: (props: { count: number }) => JSX.Element
client: no

### StatusDot.tsx
Точка статуса (green/yellow/red) для списков.
export StatusDot: (props: { status: "green" | "yellow" | "red" }) => JSX.Element
client: no

### MetricsIcons.tsx
Иконки метрик (постер, жанры, актеры, синопсис).
export MetricsIcons: (props: {...}) => JSX.Element
client: no

### RecentActivity.tsx
Лента последних действий (Хроника).
export RecentActivity: (props: { logs: any[] }) => JSX.Element
client: no

### QuickStart.tsx, FixRandomButton.tsx, LastVictory.tsx, ApiStatus.tsx, DatabaseHealth.tsx, AttentionBlock.tsx
Вспомогательные компоненты админки.
client: no

## components/
### CatalogCard.tsx
Карточка дорамы в каталоге. Bento, hover-оверлей, пилюли. Поддерживает матрешку тегов и быстрые статусы.
export CatalogCard: (props: CatalogCardProps) => JSX.Element
client: yes
Паттерн: "Карточка каталога"
Использовать для: карточки дорам в каталоге.

### CatalogToolbar.tsx
Панель фильтров и сортировки для каталога. Использует SearchableSelect.
export CatalogToolbar: (props: { allGenres, allMoods, allThemes, allCountries }) => JSX.Element
client: yes

### PeopleToolbar.tsx
Панель фильтров для каталога актеров. Использует SearchableSelect.
export PeopleToolbar: (props: {...}) => JSX.Element
client: yes

### CharactersToolbar.tsx
Панель фильтров для каталога персонажей.
export CharactersToolbar: (props: {...}) => JSX.Element
client: yes

### YearHeatmap.tsx
Тепловая карта активности (по дням). Используется на главной и в админке.
export YearHeatmap: (props: { activities: any[] }) => JSX.Element
client: no
Не дублировать: новые компоненты для heatmap.

### DramaCard.tsx
Старая карточка дорамы (используется в библиотеке). Bento, hover-оверлей.
export DramaCard: (props: {...}) => JSX.Element
client: no

### DramaListItem.tsx
Карточка дорамы в виде списка (используется в библиотеке).
export DramaListItem: (props: {...}) => JSX.Element
client: no

### PosterImage.tsx
Компонент постера с заглушкой (если картинка не загрузилась).
export PosterImage: (props: { posterUrl: string | null; title: string; year?: number; className?: string }) => JSX.Element
client: yes

### FormSection.tsx
Обертка для секций формы (иконка + заголовок + контент).
export FormSection: (props: { Icon, title, description, children }) => JSX.Element
client: no

### Tooltip.tsx
Кастомный тултип.
export Tooltip: (props: { content: string; children: React.ReactNode }) => JSX.Element
client: yes

### CryBadge.tsx
Плашка эмоции (safe, bittersweet, sad). Использует `CRY_TAGS` из lib.
export CryBadge: (props: { tag: string | null; size?: "sm" | "md"; withLabel?: boolean }) => JSX.Element
client: no

### AdminBreadcrumbs.tsx, AdminSearchBar.tsx, AppearanceMenu.tsx, CharacterActions.tsx, ChronicleFeed.tsx, ComingSoon.tsx, CommandPalette.tsx, DramaGrid.tsx, Footer.tsx, Header.tsx, HorizontalScroll.tsx, LibraryBar.tsx, MainMenu.tsx, MenuLink.tsx, MobileSearchButton.tsx, SearchBar.tsx, SmartLink.tsx, ThemeProvider.tsx, UserMenu.tsx, WipLink.tsx
Вспомогательные компоненты.
client: varies

## components/drama/
### CardStatusToolbar.tsx
Панель быстрых статусов (Segmented Control) для карточки каталога.
export CardStatusToolbar: (props: { dramaId: number; currentStatus?: string }) => JSX.Element
client: yes

### CryTagSelector.tsx
Селектор эмоции (3 кнопки в столбик).
export CryTagSelector: (props: { dramaId: number; initialTag?: string | null }) => JSX.Element
client: yes

### CryTagStats.tsx
Статистика эмоций (прогресс-бары с процентами).
export CryTagStats: (props: { stats: { cryTag: string; count: number }[] }) => JSX.Element
client: yes

### MoreItemsPopover.tsx
Поповер для скрытых элементов (каналы, студии, озвучка).
export MoreItemsPopover: (props: { hiddenItems: string[]; title?: string }) => JSX.Element
client: yes

### RatingWidget.tsx
Обертка над `Rating` для отправки оценки в БД.
export RatingWidget: (props: { dramaId: number; initialRating?: number | null }) => JSX.Element
client: yes

### TagsPopover.tsx
Поповер с жанрами, темами и настроениями (матрешка).
export TagsPopover: (props: { genres, themes, moods, hiddenCount }) => JSX.Element
client: yes

## components/people/
### FavoriteActorButton.tsx
Кнопка "В избранное" (с оптимистичным обновлением).
export FavoriteActorButton: (props: { personId: number; initialIsFavorite: boolean }) => JSX.Element
client: yes

### SocialLinks.tsx
Соцсети актера (иконки + тултипы + поповер для скрытых).
export SocialLinks: (props: { links: SocialLink[] }) => JSX.Element
client: yes

## lib/
### pluralize.ts
Склонение русских слов.
export plural: (n: number, one: string, few: string, many: string) => string
Не дублировать: писать "серия/серии/серий" вручную.

### cry-tags.ts
Словарь эмоций (иконки, цвета, переводы).
export CRY_TAGS: Record<CryTag, ...>
export isCryTag: (value: unknown) => value is CryTag
export cryTagLabel: (tag: string | null | undefined) => string

### drama-status.ts
Статусы дневника (Смотрю, В планах и т.д.).
export DRAMA_STATUSES: Record<DramaStatus, { label: string; Icon: LucideIcon }>
export getStatusLabel: (status: string | null | undefined) => string

### status-utils.ts
Уровни заполненности карточки (green/yellow/red).
export getDramaStatusLevel: (params: {...}) => "green" | "yellow" | "red"
export getPersonStatusLevel: (params: {...}) => "green" | "yellow" | "red"
export getCharacterStatusLevel: (params: {...}) => "green" | "yellow" | "red"

### language-utils.ts
Определение языка текста.
export detectLanguage: (text: string) => string

### drama-utils.ts
Нормализация названий.
export normalizeTitle: (title: string) => string

### prisma.ts
Singleton для PrismaClient.
export prisma: PrismaClient

### auth.ts
Проверка прав (заглушка через CURRENT_USER_ID).
export getCurrentUser: () => Promise<User | null>
export requireAdmin: () => Promise<User>
export requireModerator: () => Promise<User>

### current-user.ts
ID текущего пользователя (заглушка).
export CURRENT_USER_ID: 1

### check-drama-status.ts, check-person-status.ts, check-character-status.ts
Проверка статуса заполненности (через status-utils).
export getDramaStatus, getPersonStatus, getCharacterStatus

### search-queries.ts
Хелперы для поиска (getDramaSearchWhere, getPersonSearchWhere, getCharacterSearchWhere).
export getDramaSearchWhere, getPersonSearchWhere, getCharacterSearchWhere

### social-icons.ts
Словарь иконок соцсетей.
export SOCIAL_ICONS: Record<string, React.ComponentType>
export getSocialIcon: (platform: string) => React.ComponentType

### action-labels.ts
Переводы экшенов для Хроники.
export getActionLabel: (action: string) => string

### use-lock-body-scroll.ts
Блокировка скролла при открытых модалках.
export useLockBodyScroll: (active?: boolean) => void

## Server Actions
### app/dramas/[id]/actions.ts (~600 строк)
Управление дневником и данными дорамы.
Экшены: updateEntry, updateDrama, updateGenres, addCredit, removeCredit, updateCredit, quickSetStatus, updateTitles, addSoundtrack, removeSoundtrack, incrementProgress, removeEntry, rateDrama, saveCryTag, updateMoods, updateThemes.
Особенности: логирование в AdminLog, проверка oldStatus -> newStatus (зеленение), revalidatePath.

### app/admin/actions.ts
CRUD дорам, аналитика.
Экшены: createDrama, deleteDrama, fixRandomDrama, getAdminOverviewData, checkApiStatus.
Особенности: защита от дублей (по названию И альтернативным именам).

### app/admin/people/actions.ts
CRUD актеров.
Экшены: createPerson, updatePerson, deletePerson, updatePersonAliases.
Особенности: защита от дублей (по имени И алиасам).

### app/admin/characters/actions.ts
CRUD персонажей.
Экшены: createCharacter, updateCharacter, deleteCharacter, addCharacterRelation, deleteCharacterRelation, updateCharacterAliases.

### app/people/[id]/actions.ts
Избранные актеры.
Экшены: toggleFavoriteActor.