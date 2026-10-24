import { Film, Tag, FileText } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

type Actor = { person: { name: string } };
type Genre = { genre: { name: string } };

export function MetricsIcons({ 
  credits, 
  totalCredits,
  genres, 
  totalGenres,
  hasSynopsis 
}: { 
  credits: Actor[]; 
  totalCredits: number;
  genres: Genre[]; 
  totalGenres: number;
  hasSynopsis: boolean;
}) {
  // Логика для актеров
  const actorColor = 
    totalCredits === 0 ? "text-muted/30" : 
    totalCredits <= 2 ? "text-muted" : 
    totalCredits <= 10 ? "text-yellow-500" : "text-green-500";
  
  const actorNames = credits.map(c => c.person.name);
  const actorRest = totalCredits > credits.length ? `\n...и еще ${totalCredits - credits.length}` : "";
  const actorTooltip = totalCredits === 0 
    ? "Нет актеров" 
    : `Актеров (${totalCredits}):\n${actorNames.join("\n")}${actorRest}`;

  // Логика для жанров
  const genreColor = 
    totalGenres === 0 ? "text-muted/30" : 
    totalGenres <= 2 ? "text-muted" : "text-green-500";
  
  const genreNames = genres.map(g => g.genre.name);
  const genreRest = totalGenres > genres.length ? `\n...и еще ${totalGenres - genres.length}` : "";
  const genreTooltip = totalGenres === 0 
    ? "Нет жанров" 
    : `Жанры (${totalGenres}):\n${genreNames.join("\n")}${genreRest}`;

  // Логика для описания
  const descColor = hasSynopsis ? "text-green-500" : "text-muted/30";
  const descTooltip = hasSynopsis ? "Описание есть" : "Нет описания";

  return (
    <div className="flex items-center gap-3">
      <Tooltip content={<span className="whitespace-pre-wrap">{actorTooltip}</span>}>
        <span className={`flex items-center gap-1 text-xs ${actorColor}`}>
          <Film className="w-3.5 h-3.5" /> {totalCredits}
        </span>
      </Tooltip>
      
      <Tooltip content={<span className="whitespace-pre-wrap">{genreTooltip}</span>}>
        <span className={`flex items-center gap-1 text-xs ${genreColor}`}>
          <Tag className="w-3.5 h-3.5" /> {totalGenres}
        </span>
      </Tooltip>
      
      <Tooltip content={descTooltip}>
        <FileText className={`w-3.5 h-3.5 ${descColor}`} />
      </Tooltip>
    </div>
  );
}