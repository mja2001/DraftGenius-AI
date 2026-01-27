import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Test GRID API connection
  app.get("/api/grid/test", async (req, res) => {
    try {
      const result = await storage.testGridConnection();
      res.json(result);
    } catch (error) {
      console.error("Error testing GRID connection:", error);
      res.status(500).json({ connected: false, error: String(error) });
    }
  });

  // Get teams from GRID API
  app.get("/api/grid/teams", async (req, res) => {
    try {
      const teams = await storage.getGridTeams();
      res.json({ teams });
    } catch (error) {
      console.error("Error fetching GRID teams:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  // Get all champions
  app.get("/api/champions", async (req, res) => {
    try {
      const role = req.query.role as string | undefined;
      const champions = await storage.getChampions(role);
      res.json(champions);
    } catch (error) {
      console.error("Error fetching champions:", error);
      res.status(500).json({ error: "Failed to fetch champions" });
    }
  });

  // Get single champion by ID
  app.get("/api/champions/:id", async (req, res) => {
    try {
      const champion = await storage.getChampionById(req.params.id);
      if (!champion) {
        return res.status(404).json({ error: "Champion not found" });
      }
      res.json(champion);
    } catch (error) {
      console.error("Error fetching champion:", error);
      res.status(500).json({ error: "Failed to fetch champion" });
    }
  });

  // Get AI recommendations for draft
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { blueBans, redBans, bluePicks, redPicks, activeTeam, phase } = req.body;

      const unavailable = [
        ...blueBans.filter((id: string | null) => id !== null),
        ...redBans.filter((id: string | null) => id !== null),
        ...bluePicks.filter((id: string | null) => id !== null),
        ...redPicks.filter((id: string | null) => id !== null),
      ];

      const allChampions = await storage.getChampions();
      const availableChampions = allChampions.filter(c => !unavailable.includes(c.id));

      const enemyPicks = activeTeam === "blue" ? redPicks : bluePicks;
      const allyPicks = activeTeam === "blue" ? bluePicks : redPicks;

      const enemyChampNames = enemyPicks
        .filter((id: string | null) => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id)?.name || id);

      const allyChampNames = allyPicks
        .filter((id: string | null) => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id)?.name || id);

      const topAvailable = availableChampions
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 20);

      const prompt = phase === "banning" 
        ? `You are a League of Legends draft expert. The ${activeTeam} team needs ban recommendations.

Enemy team has picked: ${enemyChampNames.join(", ") || "none yet"}
Your team has picked: ${allyChampNames.join(", ") || "none yet"}

Available high-priority champions to consider banning:
${topAvailable.map(c => `- ${c.name} (${c.role}, ${c.winRate}% WR, ${c.pickRate}% pick rate, tier ${c.tier})`).join("\n")}

Recommend the top 5 champions to ban with reasons. Focus on:
1. High win rate + pick rate champions that could hurt your team
2. Champions that counter your team's current picks
3. Meta-defining champions

Respond in JSON format:
{
  "recommendations": [
    {"championId": "ChampionId", "score": 85, "reasons": ["reason1", "reason2"]},
    ...
  ]
}`
        : `You are a League of Legends draft expert. The ${activeTeam} team needs pick recommendations.

Enemy team has picked: ${enemyChampNames.join(", ") || "none yet"}
Your team has picked: ${allyChampNames.join(", ") || "none yet"}

Available champions to consider:
${topAvailable.map(c => `- ${c.name} (${c.role}, ${c.winRate}% WR, counters: ${c.counters.slice(0,3).join(",")}, synergies: ${c.synergies.slice(0,3).join(",")})`).join("\n")}

Recommend the top 5 champions to pick with reasons. Focus on:
1. Champions that counter enemy picks
2. Champions that synergize with your team
3. Fill missing roles in your composition
4. Strong meta picks

Respond in JSON format:
{
  "recommendations": [
    {"championId": "ChampionId", "score": 85, "reasons": ["reason1", "reason2"]},
    ...
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      
      const validatedRecs = (parsed.recommendations || [])
        .filter((rec: any) => availableChampions.some(c => c.id === rec.championId))
        .slice(0, 5)
        .map((rec: any) => ({
          ...rec,
          type: phase === "banning" ? "ban" : "pick",
        }));

      res.json({ recommendations: validatedRecs });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Get composition analysis
  app.post("/api/analysis", async (req, res) => {
    try {
      const { bluePicks, redPicks } = req.body;
      const allChampions = await storage.getChampions();

      const analyzeTeam = (picks: (string | null)[]) => {
        const champions = picks
          .filter((id): id is string => id !== null)
          .map(id => allChampions.find(c => c.id === id))
          .filter((c): c is NonNullable<typeof c> => c !== undefined);

        if (champions.length === 0) {
          return {
            earlyGame: 50, midGame: 50, lateGame: 50,
            teamfight: 50, splitPush: 50, engage: 50, poke: 50,
            tankiness: 50, damage: 50, cc: 50,
            warnings: [], strengths: [],
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

        if (tankiness < 40 && champions.length >= 3) warnings.push("Low frontline");
        if (cc < 35 && champions.length >= 3) warnings.push("Limited CC");
        if (engage < 30 && champions.length >= 4) warnings.push("No reliable engage");
        if (damage < 50 && champions.length >= 3) warnings.push("Low damage output");

        if (teamfight > 70) strengths.push("Strong teamfight");
        if (earlyGame > 70) strengths.push("Powerful early game");
        if (lateGame > 75) strengths.push("Excellent scaling");
        if (splitPush > 60) strengths.push("Good split-push");

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
      };

      const blueAnalysis = analyzeTeam(bluePicks);
      const redAnalysis = analyzeTeam(redPicks);

      res.json({ blueAnalysis, redAnalysis });
    } catch (error) {
      console.error("Error analyzing composition:", error);
      res.status(500).json({ error: "Failed to analyze composition" });
    }
  });

  // Get win probability
  app.post("/api/win-probability", async (req, res) => {
    try {
      const { bluePicks, redPicks, blueAnalysis, redAnalysis } = req.body;
      const allChampions = await storage.getChampions();

      const blueChamps = bluePicks
        .filter((id: string | null): id is string => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id))
        .filter((c: any): c is NonNullable<typeof c> => c !== undefined);

      const redChamps = redPicks
        .filter((id: string | null): id is string => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id))
        .filter((c: any): c is NonNullable<typeof c> => c !== undefined);

      if (blueChamps.length === 0 && redChamps.length === 0) {
        return res.json({ blueWinProbability: 50, redWinProbability: 50, factors: [] });
      }

      const factors: { description: string; impact: number; favoredTeam: "blue" | "red" }[] = [];
      let blueScore = 50;

      // Win rate comparison
      const blueAvgWR = blueChamps.length > 0 ? blueChamps.reduce((s: number, c: any) => s + c.winRate, 0) / blueChamps.length : 50;
      const redAvgWR = redChamps.length > 0 ? redChamps.reduce((s: number, c: any) => s + c.winRate, 0) / redChamps.length : 50;
      const wrDiff = blueAvgWR - redAvgWR;
      if (Math.abs(wrDiff) > 0.5) {
        blueScore += wrDiff * 0.8;
        factors.push({
          description: "Champion win rates",
          impact: Math.abs(wrDiff * 0.8),
          favoredTeam: wrDiff > 0 ? "blue" : "red",
        });
      }

      // Counter matchups
      let blueCounters = 0;
      let redCounters = 0;
      blueChamps.forEach((bc: any) => {
        redChamps.forEach((rc: any) => {
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

      blueScore = Math.max(20, Math.min(80, blueScore));

      res.json({
        blueWinProbability: Math.round(blueScore),
        redWinProbability: Math.round(100 - blueScore),
        factors,
      });
    } catch (error) {
      console.error("Error calculating win probability:", error);
      res.status(500).json({ error: "Failed to calculate win probability" });
    }
  });

  // Comprehensive AI draft analysis
  app.post("/api/draft-analysis", async (req, res) => {
    try {
      const { bluePicks, redPicks, blueBans, redBans, phase, activeTeam } = req.body;
      const allChampions = await storage.getChampions();

      const getChampName = (id: string | null) => {
        if (!id) return null;
        return allChampions.find(c => c.id === id)?.name || id;
      };

      const bluePickNames = bluePicks.filter((p: string | null) => p).map(getChampName);
      const redPickNames = redPicks.filter((p: string | null) => p).map(getChampName);
      const blueBanNames = blueBans.filter((b: string | null) => b).map(getChampName);
      const redBanNames = redBans.filter((b: string | null) => b).map(getChampName);

      const blueChamps = bluePicks
        .filter((id: string | null): id is string => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id))
        .filter((c: any): c is NonNullable<typeof c> => c !== undefined);

      const redChamps = redPicks
        .filter((id: string | null): id is string => id !== null)
        .map((id: string) => allChampions.find(c => c.id === id))
        .filter((c: any): c is NonNullable<typeof c> => c !== undefined);

      const unavailable = [
        ...blueBans.filter((id: string | null) => id !== null),
        ...redBans.filter((id: string | null) => id !== null),
        ...bluePicks.filter((id: string | null) => id !== null),
        ...redPicks.filter((id: string | null) => id !== null),
      ];

      const availableChampions = allChampions
        .filter(c => !unavailable.includes(c.id))
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 15);

      const prompt = `You are an expert League of Legends analyst. Analyze this draft state and provide detailed insights.

CURRENT DRAFT STATE:
- Phase: ${phase} (${phase === "ban1" ? "First ban phase" : phase === "pick1" ? "First pick phase" : phase === "ban2" ? "Second ban phase" : "Second pick phase"})
- Active team: ${activeTeam} side

BLUE SIDE:
- Picks: ${bluePickNames.length > 0 ? bluePickNames.join(", ") : "None yet"}
- Bans: ${blueBanNames.length > 0 ? blueBanNames.join(", ") : "None yet"}

RED SIDE:
- Picks: ${redPickNames.length > 0 ? redPickNames.join(", ") : "None yet"}
- Bans: ${redBanNames.length > 0 ? redBanNames.join(", ") : "None yet"}

AVAILABLE HIGH-PRIORITY CHAMPIONS:
${availableChampions.map(c => `- ${c.name} (${c.role}, ${c.winRate}% WR, tags: ${c.tags.join(", ")})`).join("\n")}

Provide a comprehensive analysis in the following JSON format:
{
  "topRecommendations": [
    {"champion": "ChampionName", "championId": "ChampionId", "score": 85, "reasoning": "Detailed explanation of why this pick/ban is strong"}
  ],
  "compositionAnalysis": {
    "blueTeam": {
      "damageType": "description of damage split (AD/AP/mixed)",
      "engagePotential": "description of engage tools",
      "scaling": "early/mid/late game power",
      "synergies": ["list of champion synergies"]
    },
    "redTeam": {
      "damageType": "description",
      "engagePotential": "description",
      "scaling": "description",
      "synergies": ["list"]
    }
  },
  "winProbability": {
    "blueWinChance": 52,
    "redWinChance": 48,
    "keyFactors": ["factor1", "factor2", "factor3"]
  },
  "draftWeaknesses": {
    "blueTeam": ["weakness1", "weakness2"],
    "redTeam": ["weakness1", "weakness2"]
  },
  "strategicAdvice": "2-3 sentences of overall strategic advice for the active team"
}

Provide exactly 3 recommendations. Be specific and analytical.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const content = response.choices[0]?.message?.content || "{}";
      const analysis = JSON.parse(content);

      res.json({
        success: true,
        draftState: {
          bluePicks: bluePickNames,
          redPicks: redPickNames,
          blueBans: blueBanNames,
          redBans: redBanNames,
          phase,
          activeTeam,
        },
        analysis,
      });
    } catch (error) {
      console.error("Error generating draft analysis:", error);
      res.status(500).json({ error: "Failed to generate draft analysis" });
    }
  });

  return httpServer;
}
