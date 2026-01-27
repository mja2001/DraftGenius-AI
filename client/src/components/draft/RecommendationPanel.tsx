import { cn } from "@/lib/utils";
import { useDraft } from "@/lib/draft-context";
import { getChampionById } from "@/lib/champions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Ban, UserPlus, Zap, ArrowRight } from "lucide-react";

export function RecommendationPanel() {
  const { recommendations, selectChampion, getCurrentTurnInfo, draftState } = useDraft();
  const turnInfo = getCurrentTurnInfo();

  if (draftState.phase === "complete" || !turnInfo) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-gaming">
            <Sparkles className="w-5 h-5 text-gold" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {draftState.phase === "complete"
                ? "Draft complete! Review the analytics."
                : "Waiting for draft to begin..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isBanning = turnInfo.type === "ban";
  const team = turnInfo.team;

  return (
    <Card className="h-full flex flex-col" data-testid="recommendation-panel">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-base font-gaming">
          <Sparkles className="w-5 h-5 text-gold" />
          AI Recommendations
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              team === "blue"
                ? "border-blue-team text-blue-team"
                : "border-red-team text-red-team"
            )}
          >
            {team === "blue" ? "Blue" : "Red"} Side
          </Badge>
          <Badge
            variant="secondary"
            className="gap-1"
          >
            {isBanning ? (
              <>
                <Ban className="w-3 h-3" />
                Ban Phase
              </>
            ) : (
              <>
                <UserPlus className="w-3 h-3" />
                Pick Phase
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-2">
            {recommendations.map((rec, index) => {
              const champion = getChampionById(rec.championId);
              if (!champion) return null;

              return (
                <div
                  key={rec.championId}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-md border transition-all",
                    "bg-card hover-elevate active-elevate-2 cursor-pointer",
                    index === 0 && "border-gold/50 glow-gold"
                  )}
                  onClick={() => selectChampion(rec.championId)}
                  data-testid={`recommendation-${rec.championId}`}
                >
                  {/* Rank */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0",
                      index === 0
                        ? "bg-gold text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Champion portrait */}
                  <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border shrink-0">
                    <img
                      src={champion.imageUrl}
                      alt={champion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/48?text=${champion.name[0]}`;
                      }}
                    />
                    {isBanning && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <Ban className="w-5 h-5 text-red-team" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-gaming font-semibold text-sm text-foreground">
                        {champion.name}
                      </span>
                      {champion.tier && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1 py-0",
                            champion.tier === "S" && "border-gold text-gold",
                            champion.tier === "A" && "border-blue-team text-blue-team"
                          )}
                        >
                          {champion.tier}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.reasons.slice(0, 2).map((reason, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-muted-foreground flex items-center gap-0.5"
                        >
                          <Zap className="w-2.5 h-2.5 text-gold" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-1 shrink-0">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
