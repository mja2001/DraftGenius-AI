import { cn } from "@/lib/utils";
import { useDraft } from "@/lib/draft-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Swords,
  Shield,
  Zap,
  Clock,
  Target,
} from "lucide-react";
import type { CompositionAnalysis, TeamSide } from "@shared/schema";

interface StatBarProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: "blue" | "red" | "gold" | "default";
}

function StatBar({ label, value, icon, color = "default" }: StatBarProps) {
  const colorClasses = {
    blue: "bg-blue-team",
    red: "bg-red-team",
    gold: "bg-gold",
    default: "bg-primary",
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" indicatorClassName={colorClasses[color]} />
    </div>
  );
}

interface TeamAnalysisProps {
  analysis: CompositionAnalysis | null;
  team: TeamSide;
}

function TeamAnalysis({ analysis, team }: TeamAnalysisProps) {
  const isBlue = team === "blue";
  const color = isBlue ? "blue" : "red";

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <BarChart3 className="w-8 h-8 text-muted-foreground/30 mb-2" />
        <p className="text-xs text-muted-foreground">Pick champions to see analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Power Curve */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Power Curve
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-md bg-muted/30">
            <div className={cn("text-lg font-bold", analysis.earlyGame > 60 ? "text-status-online" : "text-foreground")}>
              {analysis.earlyGame}
            </div>
            <div className="text-[10px] text-muted-foreground">Early</div>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/30">
            <div className={cn("text-lg font-bold", analysis.midGame > 60 ? "text-status-online" : "text-foreground")}>
              {analysis.midGame}
            </div>
            <div className="text-[10px] text-muted-foreground">Mid</div>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/30">
            <div className={cn("text-lg font-bold", analysis.lateGame > 60 ? "text-status-online" : "text-foreground")}>
              {analysis.lateGame}
            </div>
            <div className="text-[10px] text-muted-foreground">Late</div>
          </div>
        </div>
      </div>

      {/* Composition Stats */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Target className="w-3 h-3" />
          Composition Stats
        </h4>
        <div className="space-y-2">
          <StatBar label="Tankiness" value={analysis.tankiness} icon={<Shield className="w-3 h-3" />} color={color} />
          <StatBar label="Damage" value={analysis.damage} icon={<Swords className="w-3 h-3" />} color={color} />
          <StatBar label="Crowd Control" value={analysis.cc} icon={<Zap className="w-3 h-3" />} color={color} />
          <StatBar label="Teamfight" value={analysis.teamfight} color={color} />
          <StatBar label="Engage" value={analysis.engage} color={color} />
        </div>
      </div>

      {/* Warnings & Strengths */}
      {(analysis.warnings.length > 0 || analysis.strengths.length > 0) && (
        <div className="space-y-2">
          {analysis.warnings.map((warning, i) => (
            <div
              key={`warn-${i}`}
              className="flex items-start gap-2 p-2 rounded-md bg-red-team/10 border border-red-team/20"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-team shrink-0 mt-0.5" />
              <span className="text-xs text-foreground">{warning}</span>
            </div>
          ))}
          {analysis.strengths.map((strength, i) => (
            <div
              key={`str-${i}`}
              className="flex items-start gap-2 p-2 rounded-md bg-status-online/10 border border-status-online/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-status-online shrink-0 mt-0.5" />
              <span className="text-xs text-foreground">{strength}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnalyticsPanel() {
  const { blueAnalysis, redAnalysis, winProbability } = useDraft();

  return (
    <Card className="h-full flex flex-col" data-testid="analytics-panel">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-base font-gaming">
          <BarChart3 className="w-5 h-5 text-primary" />
          Draft Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-6">
            {/* Win Probability */}
            {winProbability && (
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  Win Probability
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-gaming text-blue-team text-glow-blue">
                      Blue: {winProbability.blueWinProbability}%
                    </span>
                    <span className="text-sm font-gaming text-red-team text-glow-red">
                      Red: {winProbability.redWinProbability}%
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-team transition-all duration-300"
                      style={{ width: `${winProbability.blueWinProbability}%` }}
                    />
                    <div
                      className="absolute inset-y-0 right-0 bg-red-team transition-all duration-300"
                      style={{ width: `${winProbability.redWinProbability}%` }}
                    />
                  </div>
                  {winProbability.factors.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {winProbability.factors.slice(0, 3).map((factor, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px]">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] px-1 py-0",
                              factor.favoredTeam === "blue"
                                ? "border-blue-team text-blue-team"
                                : "border-red-team text-red-team"
                            )}
                          >
                            +{factor.impact.toFixed(1)}
                          </Badge>
                          <span className="text-muted-foreground">{factor.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Blue Team Analysis */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-team" />
                <span className="text-sm font-gaming text-blue-team">Blue Side</span>
              </h4>
              <TeamAnalysis analysis={blueAnalysis} team="blue" />
            </div>

            <Separator />

            {/* Red Team Analysis */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-team" />
                <span className="text-sm font-gaming text-red-team">Red Side</span>
              </h4>
              <TeamAnalysis analysis={redAnalysis} team="red" />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
