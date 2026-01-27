import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import type { DraftState, TeamSide, Champion, Recommendation, CompositionAnalysis, WinProbability } from "@shared/schema";
import { DRAFT_ORDER } from "@shared/schema";
import { CHAMPIONS, getChampionById } from "./champions";

interface DraftContextType {
  draftState: DraftState;
  selectChampion: (championId: string) => void;
  resetDraft: () => void;
  toggleTimer: () => void;
  recommendations: Recommendation[];
  blueAnalysis: CompositionAnalysis | null;
  redAnalysis: CompositionAnalysis | null;
  winProbability: WinProbability | null;
  isLoading: boolean;
  getCurrentTurnInfo: () => { team: TeamSide; type: "ban" | "pick"; index: number } | null;
  getUnavailableChampions: () => string[];
}

const initialDraftState: DraftState = {
  phase: "banning",
  currentTurn: 0,
  blueBans: [null, null, null, null, null],
  redBans: [null, null, null, null, null],
  bluePicks: [null, null, null, null, null],
  redPicks: [null, null, null, null, null],
  timer: 30,
  activeTeam: "blue",
  isTimerRunning: false,
};

const DraftContext = createContext<DraftContextType | null>(null);

export function useDraft() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraft must be used within a DraftProvider");
  }
  return context;
}

function calculateCompositionAnalysis(picks: (string | null)[]): CompositionAnalysis {
  const champions = picks
    .filter((id): id is string => id !== null)
    .map(id => getChampionById(id))
    .filter((c): c is Champion => c !== undefined);

  if (champions.length === 0) {
    return {
      earlyGame: 50,
      midGame: 50,
      lateGame: 50,
      teamfight: 50,
      splitPush: 50,
      engage: 50,
      poke: 50,
      tankiness: 50,
      damage: 50,
      cc: 50,
      warnings: [],
      strengths: [],
    };
  }

  const tagCounts: Record<string, number> = {};
  champions.forEach(champ => {
    champ.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const avgWinRate = champions.reduce((sum, c) => sum + c.winRate, 0) / champions.length;
  
  const earlyGame = Math.min(100, 40 + (tagCounts["early-game"] || 0) * 15 + (avgWinRate - 50) * 2);
  const lateGame = Math.min(100, 40 + (tagCounts["scaling"] || 0) * 15 + (avgWinRate - 50) * 2);
  const midGame = (earlyGame + lateGame) / 2 + 10;
  
  const tankiness = Math.min(100, 20 + (tagCounts["tank"] || 0) * 20 + (tagCounts["fighter"] || 0) * 8);
  const damage = Math.min(100, 30 + (tagCounts["assassin"] || 0) * 15 + (tagCounts["mage"] || 0) * 12 + (tagCounts["marksman"] || 0) * 15 + (tagCounts["burst"] || 0) * 10);
  const cc = Math.min(100, 20 + (tagCounts["cc"] || 0) * 18 + (tagCounts["engage"] || 0) * 10);
  const engage = Math.min(100, 20 + (tagCounts["engage"] || 0) * 20);
  const poke = Math.min(100, 20 + (tagCounts["poke"] || 0) * 20);
  const splitPush = Math.min(100, 20 + (tagCounts["split-push"] || 0) * 25);
  const teamfight = Math.min(100, 30 + (tagCounts["engage"] || 0) * 15 + (tagCounts["cc"] || 0) * 10 + (tagCounts["tank"] || 0) * 10);

  const warnings: string[] = [];
  const strengths: string[] = [];

  if (tankiness < 40 && champions.length >= 3) warnings.push("Low frontline - team lacks tankiness");
  if (cc < 35 && champions.length >= 3) warnings.push("Limited crowd control");
  if (engage < 30 && champions.length >= 4) warnings.push("No reliable engage tools");
  if (damage < 50 && champions.length >= 3) warnings.push("Damage output may be insufficient");

  if (teamfight > 70) strengths.push("Strong teamfight composition");
  if (earlyGame > 70) strengths.push("Powerful early game");
  if (lateGame > 75) strengths.push("Excellent scaling");
  if (splitPush > 60) strengths.push("Good split-push potential");
  if (poke > 65) strengths.push("Strong poke and siege");

  return {
    earlyGame: Math.round(earlyGame),
    midGame: Math.round(midGame),
    lateGame: Math.round(lateGame),
    teamfight: Math.round(teamfight),
    splitPush: Math.round(splitPush),
    engage: Math.round(engage),
    poke: Math.round(poke),
    tankiness: Math.round(tankiness),
    damage: Math.round(damage),
    cc: Math.round(cc),
    warnings,
    strengths,
  };
}

function calculateWinProbability(
  blueAnalysis: CompositionAnalysis,
  redAnalysis: CompositionAnalysis,
  bluePicks: (string | null)[],
  redPicks: (string | null)[]
): WinProbability {
  const factors: WinProbability["factors"] = [];
  
  const blueChamps = bluePicks.filter((id): id is string => id !== null).map(id => getChampionById(id)).filter((c): c is Champion => c !== undefined);
  const redChamps = redPicks.filter((id): id is string => id !== null).map(id => getChampionById(id)).filter((c): c is Champion => c !== undefined);
  
  if (blueChamps.length === 0 && redChamps.length === 0) {
    return { blueWinProbability: 50, redWinProbability: 50, factors: [] };
  }

  let blueScore = 50;

  // Win rate comparison
  const blueAvgWR = blueChamps.length > 0 ? blueChamps.reduce((s, c) => s + c.winRate, 0) / blueChamps.length : 50;
  const redAvgWR = redChamps.length > 0 ? redChamps.reduce((s, c) => s + c.winRate, 0) / redChamps.length : 50;
  const wrDiff = blueAvgWR - redAvgWR;
  if (Math.abs(wrDiff) > 0.5) {
    blueScore += wrDiff * 0.8;
    factors.push({
      description: "Champion win rates",
      impact: Math.abs(wrDiff * 0.8),
      favoredTeam: wrDiff > 0 ? "blue" : "red",
    });
  }

  // Composition balance
  const blueBalance = (blueAnalysis.tankiness + blueAnalysis.damage + blueAnalysis.cc) / 3;
  const redBalance = (redAnalysis.tankiness + redAnalysis.damage + redAnalysis.cc) / 3;
  const balanceDiff = (blueBalance - redBalance) * 0.1;
  if (Math.abs(balanceDiff) > 1) {
    blueScore += balanceDiff;
    factors.push({
      description: "Team composition balance",
      impact: Math.abs(balanceDiff),
      favoredTeam: balanceDiff > 0 ? "blue" : "red",
    });
  }

  // Counter matchups
  let blueCounters = 0;
  let redCounters = 0;
  blueChamps.forEach(bc => {
    redChamps.forEach(rc => {
      if (bc.counters.includes(rc.id)) blueCounters++;
      if (rc.counters.includes(bc.id)) redCounters++;
    });
  });
  const counterDiff = (blueCounters - redCounters) * 2;
  if (counterDiff !== 0) {
    blueScore += counterDiff;
    factors.push({
      description: "Counter-pick advantage",
      impact: Math.abs(counterDiff),
      favoredTeam: counterDiff > 0 ? "blue" : "red",
    });
  }

  // Teamfight vs Split
  if (blueAnalysis.teamfight > redAnalysis.teamfight + 15) {
    blueScore += 3;
    factors.push({
      description: "Teamfight superiority",
      impact: 3,
      favoredTeam: "blue",
    });
  } else if (redAnalysis.teamfight > blueAnalysis.teamfight + 15) {
    blueScore -= 3;
    factors.push({
      description: "Teamfight superiority",
      impact: 3,
      favoredTeam: "red",
    });
  }

  blueScore = Math.max(20, Math.min(80, blueScore));

  return {
    blueWinProbability: Math.round(blueScore),
    redWinProbability: Math.round(100 - blueScore),
    factors,
  };
}

function generateRecommendations(
  draftState: DraftState,
  currentTurn: { team: TeamSide; type: "ban" | "pick"; index: number } | null
): Recommendation[] {
  if (!currentTurn) return [];

  const unavailable = new Set([
    ...draftState.blueBans.filter((id): id is string => id !== null),
    ...draftState.redBans.filter((id): id is string => id !== null),
    ...draftState.bluePicks.filter((id): id is string => id !== null),
    ...draftState.redPicks.filter((id): id is string => id !== null),
  ]);

  const available = CHAMPIONS.filter(c => !unavailable.has(c.id));
  const { team, type } = currentTurn;

  const enemyPicks = team === "blue" ? draftState.redPicks : draftState.bluePicks;
  const allyPicks = team === "blue" ? draftState.bluePicks : draftState.redPicks;
  
  const enemyChamps = enemyPicks
    .filter((id): id is string => id !== null)
    .map(id => getChampionById(id))
    .filter((c): c is Champion => c !== undefined);

  const allyChamps = allyPicks
    .filter((id): id is string => id !== null)
    .map(id => getChampionById(id))
    .filter((c): c is Champion => c !== undefined);

  const allyRoles = new Set(allyChamps.map(c => c.role));

  if (type === "ban") {
    const scored = available.map(champ => {
      let score = 0;
      const reasons: string[] = [];

      // High meta priority
      score += champ.winRate * 0.5 + champ.pickRate * 0.3;
      if (champ.winRate > 51) reasons.push(`High win rate (${champ.winRate.toFixed(1)}%)`);
      if (champ.pickRate > 8) reasons.push(`Popular pick (${champ.pickRate.toFixed(1)}% pick rate)`);

      // Tier bonus
      if (champ.tier === "S") { score += 15; reasons.push("S-tier champion"); }
      else if (champ.tier === "A") { score += 8; reasons.push("A-tier champion"); }

      // Counters ally picks
      const countersAlly = allyChamps.filter(ally => 
        champ.counters.includes(ally.id) || ally.counters.includes(champ.id)
      );
      if (countersAlly.length > 0) {
        score += countersAlly.length * 10;
        reasons.push(`Counters your ${countersAlly.map(c => c.name).join(", ")}`);
      }

      return { championId: champ.id, score, reasons, type: "ban" as const };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  } else {
    const scored = available.map(champ => {
      let score = 0;
      const reasons: string[] = [];

      // Base stats
      score += champ.winRate * 0.4;
      if (champ.winRate > 51) reasons.push(`Strong win rate (${champ.winRate.toFixed(1)}%)`);

      // Tier bonus
      if (champ.tier === "S") { score += 20; reasons.push("S-tier champion"); }
      else if (champ.tier === "A") { score += 12; reasons.push("A-tier champion"); }

      // Role availability
      if (!allyRoles.has(champ.role)) {
        score += 15;
        reasons.push(`Fills ${champ.role} role`);
      } else {
        score -= 10;
      }

      // Counter enemy picks
      const countersEnemy = enemyChamps.filter(enemy => 
        champ.counters.includes(enemy.id)
      );
      if (countersEnemy.length > 0) {
        score += countersEnemy.length * 12;
        reasons.push(`Counters enemy ${countersEnemy.map(c => c.name).join(", ")}`);
      }

      // Synergy with allies
      const synergiesWithAlly = allyChamps.filter(ally =>
        champ.synergies.includes(ally.id) || ally.synergies.includes(champ.id)
      );
      if (synergiesWithAlly.length > 0) {
        score += synergiesWithAlly.length * 8;
        reasons.push(`Synergizes with ${synergiesWithAlly.map(c => c.name).join(", ")}`);
      }

      // Tag synergies
      if (allyChamps.some(a => a.tags.includes("engage")) && champ.tags.includes("cc")) {
        score += 5;
        reasons.push("Adds follow-up CC");
      }
      if (allyChamps.some(a => a.tags.includes("scaling")) && champ.tags.includes("tank")) {
        score += 5;
        reasons.push("Provides frontline for scaling carries");
      }

      return { championId: champ.id, score, reasons, type: "pick" as const };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draftState, setDraftState] = useState<DraftState>(initialDraftState);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [blueAnalysis, setBlueAnalysis] = useState<CompositionAnalysis | null>(null);
  const [redAnalysis, setRedAnalysis] = useState<CompositionAnalysis | null>(null);
  const [winProbability, setWinProbability] = useState<WinProbability | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentTurnInfo = useCallback(() => {
    if (draftState.currentTurn >= DRAFT_ORDER.length) return null;
    const turn = DRAFT_ORDER[draftState.currentTurn];
    return { team: turn.team as TeamSide, type: turn.type as "ban" | "pick", index: turn.index };
  }, [draftState.currentTurn]);

  const getUnavailableChampions = useCallback(() => {
    return [
      ...draftState.blueBans.filter((id): id is string => id !== null),
      ...draftState.redBans.filter((id): id is string => id !== null),
      ...draftState.bluePicks.filter((id): id is string => id !== null),
      ...draftState.redPicks.filter((id): id is string => id !== null),
    ];
  }, [draftState]);

  const selectChampion = useCallback((championId: string) => {
    const turnInfo = getCurrentTurnInfo();
    if (!turnInfo) return;

    setDraftState(prev => {
      const newState = { ...prev };
      const { team, type, index } = turnInfo;

      if (type === "ban") {
        if (team === "blue") {
          newState.blueBans = [...prev.blueBans];
          newState.blueBans[index] = championId;
        } else {
          newState.redBans = [...prev.redBans];
          newState.redBans[index] = championId;
        }
      } else {
        if (team === "blue") {
          newState.bluePicks = [...prev.bluePicks];
          newState.bluePicks[index] = championId;
        } else {
          newState.redPicks = [...prev.redPicks];
          newState.redPicks[index] = championId;
        }
      }

      newState.currentTurn = prev.currentTurn + 1;
      newState.timer = 30;

      if (newState.currentTurn >= DRAFT_ORDER.length) {
        newState.phase = "complete";
        newState.isTimerRunning = false;
      } else {
        const nextTurn = DRAFT_ORDER[newState.currentTurn];
        newState.activeTeam = nextTurn.team as TeamSide;
        newState.phase = nextTurn.type === "ban" ? "banning" : "picking";
      }

      return newState;
    });
  }, [getCurrentTurnInfo]);

  const resetDraft = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDraftState(initialDraftState);
    setRecommendations([]);
    setBlueAnalysis(null);
    setRedAnalysis(null);
    setWinProbability(null);
  }, []);

  const toggleTimer = useCallback(() => {
    setDraftState(prev => ({
      ...prev,
      isTimerRunning: !prev.isTimerRunning,
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (draftState.isTimerRunning && draftState.phase !== "complete") {
      timerRef.current = setInterval(() => {
        setDraftState(prev => {
          if (prev.timer <= 1) {
            return { ...prev, timer: 30 };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [draftState.isTimerRunning, draftState.phase]);

  // Update recommendations and analysis
  useEffect(() => {
    const updateAnalytics = async () => {
      const turnInfo = getCurrentTurnInfo();
      
      // Use client-side calculations for instant feedback
      const newRecs = generateRecommendations(draftState, turnInfo);
      setRecommendations(newRecs);

      const blueAn = calculateCompositionAnalysis(draftState.bluePicks);
      const redAn = calculateCompositionAnalysis(draftState.redPicks);
      setBlueAnalysis(blueAn);
      setRedAnalysis(redAn);

      const winProb = calculateWinProbability(blueAn, redAn, draftState.bluePicks, draftState.redPicks);
      setWinProbability(winProb);
    };

    updateAnalytics();
  }, [draftState, getCurrentTurnInfo]);

  return (
    <DraftContext.Provider
      value={{
        draftState,
        selectChampion,
        resetDraft,
        toggleTimer,
        recommendations,
        blueAnalysis,
        redAnalysis,
        winProbability,
        isLoading,
        getCurrentTurnInfo,
        getUnavailableChampions,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}
