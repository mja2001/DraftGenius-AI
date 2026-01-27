import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Champion roles
export const ChampionRole = z.enum(["top", "jungle", "mid", "adc", "support"]);
export type ChampionRole = z.infer<typeof ChampionRole>;

// Champion tags for composition analysis
export const ChampionTag = z.enum([
  "tank",
  "fighter",
  "assassin",
  "mage",
  "marksman",
  "support",
  "engage",
  "poke",
  "scaling",
  "early-game",
  "cc",
  "burst",
  "sustain",
  "split-push"
]);
export type ChampionTag = z.infer<typeof ChampionTag>;

// Champion data schema
export const ChampionSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: ChampionRole,
  imageUrl: z.string(),
  winRate: z.number().min(0).max(100),
  pickRate: z.number().min(0).max(100),
  banRate: z.number().min(0).max(100),
  counters: z.array(z.string()),
  synergies: z.array(z.string()),
  tags: z.array(ChampionTag),
  tier: z.enum(["S", "A", "B", "C", "D"]).optional(),
});
export type Champion = z.infer<typeof ChampionSchema>;

// Draft state
export const DraftPhase = z.enum(["banning", "picking", "complete"]);
export type DraftPhase = z.infer<typeof DraftPhase>;

export const TeamSide = z.enum(["blue", "red"]);
export type TeamSide = z.infer<typeof TeamSide>;

// Draft slot
export const DraftSlotSchema = z.object({
  championId: z.string().nullable(),
  role: ChampionRole.nullable(),
  team: TeamSide,
  type: z.enum(["ban", "pick"]),
  order: z.number(),
});
export type DraftSlot = z.infer<typeof DraftSlotSchema>;

// Draft state
export const DraftStateSchema = z.object({
  phase: DraftPhase,
  currentTurn: z.number(),
  blueBans: z.array(z.string().nullable()),
  redBans: z.array(z.string().nullable()),
  bluePicks: z.array(z.string().nullable()),
  redPicks: z.array(z.string().nullable()),
  timer: z.number(),
  activeTeam: TeamSide,
  isTimerRunning: z.boolean(),
});
export type DraftState = z.infer<typeof DraftStateSchema>;

// AI Recommendation
export const RecommendationSchema = z.object({
  championId: z.string(),
  score: z.number(),
  reasons: z.array(z.string()),
  type: z.enum(["ban", "pick"]),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

// Team composition analysis
export const CompositionAnalysisSchema = z.object({
  earlyGame: z.number().min(0).max(100),
  midGame: z.number().min(0).max(100),
  lateGame: z.number().min(0).max(100),
  teamfight: z.number().min(0).max(100),
  splitPush: z.number().min(0).max(100),
  engage: z.number().min(0).max(100),
  poke: z.number().min(0).max(100),
  tankiness: z.number().min(0).max(100),
  damage: z.number().min(0).max(100),
  cc: z.number().min(0).max(100),
  warnings: z.array(z.string()),
  strengths: z.array(z.string()),
});
export type CompositionAnalysis = z.infer<typeof CompositionAnalysisSchema>;

// Win probability
export const WinProbabilitySchema = z.object({
  blueWinProbability: z.number().min(0).max(100),
  redWinProbability: z.number().min(0).max(100),
  factors: z.array(z.object({
    description: z.string(),
    impact: z.number(),
    favoredTeam: TeamSide,
  })),
});
export type WinProbability = z.infer<typeof WinProbabilitySchema>;

// Draft order (standard LoL pro draft)
export const DRAFT_ORDER = [
  { team: "blue", type: "ban", index: 0 },
  { team: "red", type: "ban", index: 0 },
  { team: "blue", type: "ban", index: 1 },
  { team: "red", type: "ban", index: 1 },
  { team: "blue", type: "ban", index: 2 },
  { team: "red", type: "ban", index: 2 },
  { team: "blue", type: "pick", index: 0 },
  { team: "red", type: "pick", index: 0 },
  { team: "red", type: "pick", index: 1 },
  { team: "blue", type: "pick", index: 1 },
  { team: "blue", type: "pick", index: 2 },
  { team: "red", type: "pick", index: 2 },
  { team: "red", type: "ban", index: 3 },
  { team: "blue", type: "ban", index: 3 },
  { team: "red", type: "ban", index: 4 },
  { team: "blue", type: "ban", index: 4 },
  { team: "red", type: "pick", index: 3 },
  { team: "blue", type: "pick", index: 3 },
  { team: "blue", type: "pick", index: 4 },
  { team: "red", type: "pick", index: 4 },
] as const;

export * from "./models/chat";
