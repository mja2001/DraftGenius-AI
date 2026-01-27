import { cn } from "@/lib/utils";
import type { TeamSide, ChampionRole } from "@shared/schema";
import { getChampionById } from "@/lib/champions";
import { Ban, User } from "lucide-react";

interface DraftSlotProps {
  championId: string | null;
  team: TeamSide;
  type: "ban" | "pick";
  isActive: boolean;
  role?: ChampionRole;
  slotIndex: number;
}

const roleLabels: Record<ChampionRole, string> = {
  top: "TOP",
  jungle: "JNG",
  mid: "MID",
  adc: "ADC",
  support: "SUP",
};

export function DraftSlot({
  championId,
  team,
  type,
  isActive,
  role,
  slotIndex,
}: DraftSlotProps) {
  const champion = championId ? getChampionById(championId) : null;
  const isBan = type === "ban";
  const isBlue = team === "blue";

  return (
    <div
      data-testid={`draft-slot-${team}-${type}-${slotIndex}`}
      className={cn(
        "relative flex items-center gap-3 p-2 rounded-md transition-all duration-200",
        isBan ? "h-12" : "h-16",
        isActive && "pulse-border border-2",
        !isActive && "border border-border/50",
        isBlue ? "bg-gradient-blue" : "bg-gradient-red",
        champion && !isBan && (isBlue ? "glow-blue" : "glow-red")
      )}
    >
      {/* Champion portrait or empty slot */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-md overflow-hidden shrink-0",
          isBan ? "w-8 h-8" : "w-12 h-12",
          !champion && "bg-muted/50 border border-dashed border-muted-foreground/30"
        )}
      >
        {champion ? (
          <>
            <img
              src={champion.imageUrl}
              alt={champion.name}
              className={cn(
                "w-full h-full object-cover",
                isBan && "grayscale opacity-60"
              )}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/48?text=${champion.name[0]}`;
              }}
            />
            {isBan && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-team" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground/50">
            {isBan ? (
              <Ban className={cn("w-4 h-4", isActive && "text-gold animate-pulse")} />
            ) : (
              <User className={cn("w-5 h-5", isActive && "text-gold animate-pulse")} />
            )}
          </div>
        )}
      </div>

      {/* Champion name and role */}
      <div className="flex flex-col min-w-0 flex-1">
        {champion ? (
          <>
            <span
              className={cn(
                "font-gaming font-semibold truncate text-sm",
                isBan ? "text-muted-foreground line-through" : "text-foreground"
              )}
            >
              {champion.name}
            </span>
            {!isBan && (
              <span className="text-xs text-muted-foreground uppercase">
                {roleLabels[champion.role]}
              </span>
            )}
          </>
        ) : (
          <span className={cn(
            "text-sm text-muted-foreground/50 italic",
            isActive && "text-gold"
          )}>
            {isActive ? "Selecting..." : isBan ? "Ban" : `Pick ${slotIndex + 1}`}
          </span>
        )}
      </div>

      {/* Active indicator */}
      {isActive && (
        <div
          className={cn(
            "absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse",
            isBlue ? "bg-blue-team" : "bg-red-team"
          )}
        />
      )}
    </div>
  );
}
