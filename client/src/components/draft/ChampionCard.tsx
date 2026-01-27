import { cn } from "@/lib/utils";
import type { Champion, ChampionRole } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Swords, Target, Sparkles, TrendingUp } from "lucide-react";

interface ChampionCardProps {
  champion: Champion;
  onClick?: () => void;
  disabled?: boolean;
  isRecommended?: boolean;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
}

const roleIcons: Record<ChampionRole, React.ReactNode> = {
  top: <Swords className="w-3 h-3" />,
  jungle: <Target className="w-3 h-3" />,
  mid: <Sparkles className="w-3 h-3" />,
  adc: <TrendingUp className="w-3 h-3" />,
  support: <Shield className="w-3 h-3" />,
};

const tierColors: Record<string, string> = {
  S: "text-gold bg-gold/20 border-gold/40",
  A: "text-blue-team bg-blue-team/20 border-blue-team/40",
  B: "text-muted-foreground bg-muted border-border",
  C: "text-muted-foreground/70 bg-muted/50 border-border/50",
  D: "text-muted-foreground/50 bg-muted/30 border-border/30",
};

export function ChampionCard({
  champion,
  onClick,
  disabled = false,
  isRecommended = false,
  showStats = false,
  size = "md",
}: ChampionCardProps) {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const imageSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          data-testid={`champion-card-${champion.id}`}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 rounded-md p-1.5 transition-all duration-150 champion-card",
            sizeClasses[size],
            disabled
              ? "opacity-30 cursor-not-allowed grayscale"
              : "cursor-pointer hover-elevate active-elevate-2",
            isRecommended && !disabled && "ring-2 ring-gold glow-gold",
            "bg-card border border-card-border"
          )}
        >
          <div
            className={cn(
              "relative rounded-md overflow-hidden border border-border/50",
              imageSizeClasses[size]
            )}
          >
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/48?text=${champion.name[0]}`;
              }}
            />
            {champion.tier && (
              <div
                className={cn(
                  "absolute top-0 right-0 text-[8px] font-bold px-1 rounded-bl",
                  tierColors[champion.tier]
                )}
              >
                {champion.tier}
              </div>
            )}
          </div>
          {size !== "sm" && (
            <span className="text-[10px] font-medium text-foreground truncate max-w-full px-0.5">
              {champion.name.length > 8 ? champion.name.slice(0, 7) + "…" : champion.name}
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-gaming font-bold text-foreground">{champion.name}</span>
            <Badge variant="outline" className="text-xs gap-1">
              {roleIcons[champion.role]}
              {champion.role.toUpperCase()}
            </Badge>
            {champion.tier && (
              <Badge className={cn("text-xs", tierColors[champion.tier])}>
                {champion.tier}-Tier
              </Badge>
            )}
          </div>
          {showStats && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Win Rate</span>
                <span className={cn("font-medium", champion.winRate >= 51 ? "text-status-online" : champion.winRate <= 49 ? "text-red-team" : "text-foreground")}>
                  {champion.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Pick Rate</span>
                <span className="font-medium">{champion.pickRate.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Ban Rate</span>
                <span className="font-medium">{champion.banRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {champion.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
