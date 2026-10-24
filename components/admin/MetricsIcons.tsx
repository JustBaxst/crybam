import { Film, Tag, FileText } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

type Actor = { person: { name: string } };
type Genre = { genre: { name: string } };

export function MetricsIcons({ 
  credits, 
  genres, 
  hasSynopsis 
}: { 
  credits: Actor[]; 
  genres: Genre[]; 
  hasSynopsis: boolean;
}) {
  // Логика для актеров
  const actorCount = credits.length;
  const actorColor = 
    actorCount === 0 ? "text-muted/30" : 
    actorCount <= 2 ? "text-muted" : 
    actorCount <= 10 ? "text-yellow-500" : "text-green-500";
  
  const actorNames = credits.slice(0, 8).map(c => c.person.name);
  const actorRest = actorCount > 8 ? `\n...и еще ${actorCount - 8}` : "";
  const actorTooltip = actorCount === 0 
    ? "Нет актеров" 
    : `Актеров (${actorCount}):\n${actorNames.join("\n")}${actorRest}`;

  // Логика для жанров
  const genreCount = genres.length;
  const genreColor = 
    genreCount === 0 ? "text-muted/30" : 
    genreCount <= 2 ? "text-muted" : "text-green-500";
  
  const genreNames = genres.slice(0, 5).map(g => g.genre.name);
  const genreRest = genreCount > 5 ? `\n...и еще ${genreCount - 5}` : "";
  const genreTooltip = genreCount === 0 
    ? "Нет жанров" 
    : `Жанры (${genreCount}):\n${genreNames.join("\n")}${genreRest}`;

  // Логика для описания
  const descColor = hasSynopsis ? "text-green-500" : "text-muted/30";
  const descTooltip = hasSynopsis ? "Описание есть" : "Нет описания";

  return (
    <div className="flex items-center gap-3">
      <Tooltip content={<span className="whitespace-pre-wrap">{actorTooltip}</span>}>
        <span className={`flex items-center gap-1 text-xs ${actorColor}`}>
          <Film className="w-3.5 h-3.5" /> {actorCount}
        </span>
      </Tooltip>
      
      <Tooltip content={<span className="whitespace-pre-wrap">{genreTooltip}</span>}>
        <span className={`flex items-center gap-1 text-xs ${genreColor}`}>
          <Tag className="w-3.5 h-3.5" /> {genreCount}
        </span>
      </Tooltip>
      
      <Tooltip content={descTooltip}>
        <FileText className={`w-3.5 h-3.5 ${descColor}`} />
      </Tooltip>
    </div>
  );
}