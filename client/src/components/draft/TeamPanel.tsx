import { cn } from "@/lib/utils";
import type { TeamSide } from "@shared/schema";
import { DraftSlot } from "./DraftSlot";
import { useDraft } from "@/lib/draft-context";

interface TeamPanelProps {
  team: TeamSide;
}

export function TeamPanel({ team }: TeamPanelProps) {
  const { draftState, getCurrentTurnInfo } = useDraft();
  const isBlue = team === "blue";
  const turnInfo = getCurrentTurnInfo();

  const bans = isBlue ? draftState.blueBans : draftState.redBans;
  const picks = isBlue ? draftState.bluePicks : draftState.redPicks;

  const isTeamActive = turnInfo?.team === team;

  return (
    <div
      data-testid={`team-panel-${team}`}
      className={cn(
        "flex flex-col gap-4 p-4 rounded-lg border",
        isBlue
          ? "border-blue-team/30 bg-blue-team/5"
          : "border-red-team/30 bg-red-team/5"
      )}
    >
      {/* Team Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            isBlue ? "bg-blue-team glow-blue" : "bg-red-team glow-red"
          )}
        />
        <h2
          className={cn(
            "font-gaming font-bold text-xl uppercase tracking-wider",
            isBlue ? "text-blue-team text-glow-blue" : "text-red-team text-glow-red"
          )}
        >
          {isBlue ? "Blue Side" : "Red Side"}
        </h2>
        {isTeamActive && (
          <span className="ml-auto text-xs font-medium text-gold animate-pulse uppercase">
            {turnInfo?.type === "ban" ? "Banning" : "Picking"}
          </span>
        )}
      </div>

      {/* Bans Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Bans
        </h3>
        <div className="flex gap-2 flex-wrap">
          {bans.map((championId, index) => {
            const isActiveSlot =
              isTeamActive &&
              turnInfo?.type === "ban" &&
              turnInfo?.index === index &&
              championId === null;
            return (
              <DraftSlot
                key={`ban-${index}`}
                championId={championId}
                team={team}
                type="ban"
                isActive={isActiveSlot}
                slotIndex={index}
              />
            );
          })}
        </div>
      </div>

      {/* Picks Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Team Composition
        </h3>
        <div className="flex flex-col gap-2">
          {picks.map((championId, index) => {
            const isActiveSlot =
              isTeamActive &&
              turnInfo?.type === "pick" &&
              turnInfo?.index === index &&
              championId === null;
            return (
              <DraftSlot
                key={`pick-${index}`}
                championId={championId}
                team={team}
                type="pick"
                isActive={isActiveSlot}
                slotIndex={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
