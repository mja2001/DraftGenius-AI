import { cn } from "@/lib/utils";
import { useDraft } from "@/lib/draft-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Play, Pause, Timer, Sparkles } from "lucide-react";

export function DraftHeader() {
  const { draftState, resetDraft, toggleTimer, getCurrentTurnInfo } = useDraft();
  const turnInfo = getCurrentTurnInfo();

  const phaseLabel = draftState.phase === "complete"
    ? "Draft Complete"
    : draftState.phase === "banning"
    ? "Ban Phase"
    : "Pick Phase";

  const turnNumber = draftState.currentTurn + 1;
  const totalTurns = 20;

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm"
      data-testid="draft-header"
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="w-8 h-8 text-gold" />
          <div className="absolute inset-0 blur-lg bg-gold/30 -z-10" />
        </div>
        <div>
          <h1 className="font-gaming font-bold text-xl tracking-wide text-foreground">
            DraftGenius
            <span className="text-gold"> AI</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            League of Legends Draft Assistant
          </p>
        </div>
      </div>

      {/* Draft Status */}
      <div className="flex items-center gap-4">
        {/* Phase indicator */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "font-gaming uppercase",
              draftState.phase === "complete" && "border-gold text-gold",
              draftState.phase === "banning" && "border-red-team text-red-team",
              draftState.phase === "picking" && "border-blue-team text-blue-team"
            )}
          >
            {phaseLabel}
          </Badge>
          {turnInfo && (
            <span className="text-xs text-muted-foreground">
              Turn {turnNumber}/{totalTurns}
            </span>
          )}
        </div>

        {/* Timer */}
        {draftState.phase !== "complete" && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-lg font-bold",
                draftState.timer <= 10
                  ? "bg-red-team/20 text-red-team animate-pulse"
                  : "bg-muted text-foreground"
              )}
            >
              <Timer className="w-4 h-4" />
              <span>{String(draftState.timer).padStart(2, "0")}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTimer}
              data-testid="timer-toggle"
            >
              {draftState.isTimerRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {/* Active team indicator */}
        {turnInfo && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase">Active:</span>
            <div
              className={cn(
                "px-2 py-1 rounded text-xs font-gaming font-bold uppercase",
                turnInfo.team === "blue"
                  ? "bg-blue-team/20 text-blue-team border border-blue-team/40"
                  : "bg-red-team/20 text-red-team border border-red-team/40"
              )}
            >
              {turnInfo.team}
            </div>
          </div>
        )}

        {/* Reset button */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetDraft}
          className="gap-1.5"
          data-testid="reset-draft"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </header>
  );
}
