import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CHAMPIONS } from "@/lib/champions";
import { useDraft } from "@/lib/draft-context";
import { ChampionCard } from "./ChampionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChampionRole } from "@shared/schema";
import { Search, Shield, Swords, Target, Sparkles, TrendingUp, X } from "lucide-react";

const roleFilters: { role: ChampionRole | "all"; label: string; icon: React.ReactNode }[] = [
  { role: "all", label: "All", icon: null },
  { role: "top", label: "Top", icon: <Swords className="w-4 h-4" /> },
  { role: "jungle", label: "Jungle", icon: <Target className="w-4 h-4" /> },
  { role: "mid", label: "Mid", icon: <Sparkles className="w-4 h-4" /> },
  { role: "adc", label: "ADC", icon: <TrendingUp className="w-4 h-4" /> },
  { role: "support", label: "Support", icon: <Shield className="w-4 h-4" /> },
];

export function ChampionSelector() {
  const { selectChampion, getUnavailableChampions, recommendations, getCurrentTurnInfo, draftState } = useDraft();
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<ChampionRole | "all">("all");

  const unavailable = useMemo(() => new Set(getUnavailableChampions()), [getUnavailableChampions]);
  const recommendedIds = useMemo(() => new Set(recommendations.map(r => r.championId)), [recommendations]);

  const filteredChampions = useMemo(() => {
    return CHAMPIONS.filter((champ) => {
      if (unavailable.has(champ.id)) return false;
      if (selectedRole !== "all" && champ.role !== selectedRole) return false;
      if (search && !champ.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      // Recommended champions first
      const aRec = recommendedIds.has(a.id) ? 1 : 0;
      const bRec = recommendedIds.has(b.id) ? 1 : 0;
      if (bRec !== aRec) return bRec - aRec;
      // Then by tier
      const tierOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 };
      const aTier = tierOrder[a.tier || "B"];
      const bTier = tierOrder[b.tier || "B"];
      if (aTier !== bTier) return aTier - bTier;
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [selectedRole, search, unavailable, recommendedIds]);

  const turnInfo = getCurrentTurnInfo();
  const isComplete = draftState.phase === "complete";

  return (
    <div
      data-testid="champion-selector"
      className="flex flex-col h-full border border-border rounded-lg bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-gaming font-bold text-lg text-foreground">
            Champions
          </h3>
          <span className="text-xs text-muted-foreground">
            {filteredChampions.length} available
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search champions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 bg-muted/50"
            data-testid="champion-search"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div className="flex gap-1 flex-wrap">
          {roleFilters.map(({ role, label, icon }) => (
            <Button
              key={role}
              size="sm"
              variant={selectedRole === role ? "default" : "ghost"}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "gap-1.5 text-xs",
                selectedRole === role && "bg-primary text-primary-foreground"
              )}
              data-testid={`role-filter-${role}`}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Champion Grid */}
      <ScrollArea className="flex-1 p-3">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Sparkles className="w-12 h-12 text-gold mb-4" />
            <h4 className="font-gaming font-bold text-lg text-foreground mb-2">
              Draft Complete
            </h4>
            <p className="text-sm text-muted-foreground">
              Both teams have finished their draft. Check the analytics panel for composition analysis.
            </p>
          </div>
        ) : filteredChampions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">No champions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2">
            {filteredChampions.map((champion) => (
              <ChampionCard
                key={champion.id}
                champion={champion}
                onClick={() => selectChampion(champion.id)}
                disabled={!turnInfo}
                isRecommended={recommendedIds.has(champion.id)}
                showStats
                size="md"
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
