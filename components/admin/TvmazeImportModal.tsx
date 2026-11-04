"use client";

import { useState } from "react";
import { X, Search, Star, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Обновленные фейковые данные (совпадают с полями формы)
const MOCK_RESULTS = [
    {
        id: 1,
        title: "Hotel del Luna",
        year: 2019,
        country: "Южная Корея",
        posterUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/203/508227.jpg",
        synopsis: "Чан Ман Воль — хозяйка отеля для призраков. Она красива, но жестока и капризна. Однажды в отель попадает Кю Чан Сон — молодой и талантливый менеджер, который становится её помощником.",
        episodes: 16,
        seasons: 1,
        episodeDuration: 80,
        airStatus: "released",
    },
    {
        id: 2,
        title: "My Mister",
        year: 2018,
        country: "Южная Корея",
        posterUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/152/380403.jpg",
        synopsis: "История о двух людях, которые находят утешение друг в друге. Пак Дон Хун — уставший от жизни мужчина, а Ли Чжи Ан — молодая девушка, борющаяся с бедностью.",
        episodes: 16,
        seasons: 1,
        episodeDuration: 70,
        airStatus: "released",
    },
    {
        id: 3,
        title: "Crash Landing on You",
        year: 2019,
        country: "Южная Корея",
        posterUrl: "https://static.tvmaze.com/uploads/images/medium_portrait/232/581016.jpg",
        synopsis: "Южнокорейская наследница бизнес-империи случайно попадает в Северную Корею во время парапланеризма и встречает офицера, который решает её спрятать.",
        episodes: 16,
        seasons: 1,
        episodeDuration: 85,
        airStatus: "released",
    },
];

export function TvmazeImportModal({
    onClose,
    onSelect,
}: {
    onClose: () => void;
    onSelect: (data: any) => void;
}) {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<typeof MOCK_RESULTS>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!query.trim()) return;
        setIsSearching(true);
        setHasSearched(true);

        // Имитация задержки сети (потом заменим на реальный fetch)
        setTimeout(() => {
            setResults(MOCK_RESULTS); // Пока показываем фейковые результаты
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl">

                {/* Шапка */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <span className="text-accent">📺</span> Импорт из TVmaze
                        </h2>
                        <p className="text-xs text-muted mt-0.5">
                            Найдите дораму, чтобы автоматически заполнить данные
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Поиск */}
                <div className="p-6 border-b border-border shrink-0">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                type="text"
                                placeholder="Введите название дорамы (например, Hotel del Luna)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
                            {isSearching ? "Поиск..." : "Найти"}
                        </Button>
                    </div>
                </div>

                {/* Результаты */}
                <div className="p-6 overflow-y-auto flex-1">
                    {!hasSearched ? (
                        <div className="text-center py-10 text-muted">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Введите название и нажмите «Найти»</p>
                        </div>
                    ) : isSearching ? (
                        <div className="text-center py-10 text-muted">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p>Ищем в базе TVmaze...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-10 text-muted">
                            <p>По запросу «{query}» ничего не найдено</p>
                            <p className="text-xs mt-1">Попробуйте другое название или английский вариант</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {results.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 hover:border-accent/50 transition-colors group"
                                >
                                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-accent-soft/40 shrink-0">
                                        {item.posterUrl ? (
                                            <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-semibold leading-tight line-clamp-2">{item.title}</h3>

                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-muted">
                                            {item.year && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {item.year}
                                                </span>
                                            )}
                                            {item.country && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {item.country}
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-3 w-full text-xs h-7"
                                            onClick={() => {
                                                // Убираем название и синопсис, так как они на английском
                                                const { title, synopsis, ...dataToFill } = item;
                                                onSelect(dataToFill);
                                            }}
                                        >
                                            Заполнить данные
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Футер */}
                <div className="px-6 py-3 border-t border-border bg-surface/50 rounded-b-2xl shrink-0">
                    <p className="text-[11px] text-muted/60 text-center">
                        Данные предоставлены сервисом TVmaze. Пожалуйста, проверяйте информацию перед сохранением.
                    </p>
                </div>
            </div>
        </div>
    );
}