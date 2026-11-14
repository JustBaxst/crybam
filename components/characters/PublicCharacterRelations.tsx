import Link from "next/link";
import { Heart, Users, Swords, Home } from "lucide-react";

type Relation = {
    id: number;
    relationType: string;
    relation: string;
    target: { id: number; name: string };
};

export function PublicCharacterRelations({ relations }: { relations: Relation[] }) {
    if (relations.length === 0) {
        return <p className="text-sm text-muted italic">Связи пока не указаны.</p>;
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "family": return <Home className="w-4 h-4 text-blue-400" />;
            case "romance": return <Heart className="w-4 h-4 text-pink-400" />;
            case "friendship": return <Users className="w-4 h-4 text-green-400" />;
            case "rivalry": return <Swords className="w-4 h-4 text-red-400" />;
            default: return <Users className="w-4 h-4 text-muted" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relations.map((r) => (
                <Link
                    key={r.id}
                    href={`/characters/${r.target.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:border-accent/50 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        {getIcon(r.relationType)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted">
                            Для <span className="text-foreground font-medium group-hover:text-accent transition-colors">{r.target.name}</span> он(а):
                        </p>
                        <p className="text-sm font-semibold text-accent">{r.relation}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}