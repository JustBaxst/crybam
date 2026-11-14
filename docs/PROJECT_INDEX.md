# PROJECT_INDEX.md

## components/ui/
### button.tsx
Базовый компонент кнопки.
export Button: (props: ButtonProps) => JSX.Element
client: no
### dropdown-menu.tsx
Обертка над Radix UI. Не импортировать Radix напрямую!
export DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
client: yes
### searchable-select.tsx
Выпадающий список с поиском (для фильтров).
export SearchableSelect: (props: {...}) => JSX.Element
client: yes

## components/
### CatalogCard.tsx
Карточка дорамы в каталоге. Bento, hover-оверлей, пилюли.
export CatalogCard: (props: CatalogCardProps) => JSX.Element
client: yes
### CatalogToolbar.tsx
Панель фильтров и сортировки для каталога.
export CatalogToolbar: (props: {...}) => JSX.Element
client: yes

## lib/
### pluralize.ts
Склонение русских слов.
export plural: (n: number, one: string, few: string, many: string) => string
### cry-tags.ts
Словарь эмоций (иконки, цвета).
export CRY_TAGS: Record<CryTag, ...>
export isCryTag: (value: unknown) => value is CryTag
### drama-status.ts
Статусы дневника.
export DRAMA_STATUSES: Record<DramaStatus, ...>
export getStatusLabel: (status: string) => string

## Server Actions (Кратко)
- app/dramas/[id]/actions.ts: Обновление дневника, статусов, кредитов.
- app/admin/actions.ts: Создание/удаление дорам, аналитика.
- app/admin/people/actions.ts: CRUD актеров (с защитой от дублей).