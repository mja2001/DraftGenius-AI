import type { Champion, ChampionRole, ChampionTag } from "@shared/schema";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface SeriesNode {
  id: string;
  startTimeScheduled: string;
  teams: Array<{
    baseInfo: {
      id: string;
      name: string;
    } | null;
  }>;
}

interface SeriesEdge {
  node: SeriesNode;
}

interface AllSeriesData {
  allSeries: {
    edges: SeriesEdge[];
  };
}

interface PlayerData {
  id: string;
  name: string;
  character?: { name: string };
  kills: number;
  deaths: number;
  killAssistsGiven: number;
  netWorth: number;
}

interface TeamGameData {
  id: string;
  won: boolean;
  kills: number;
  deaths: number;
  players: PlayerData[];
}

interface GameData {
  id: string;
  teams: TeamGameData[];
}

interface SeriesState {
  id: string;
  started: boolean;
  finished: boolean;
  teams: Array<{ id: string; name: string; won: boolean }>;
  games: GameData[];
}

interface SeriesStateData {
  seriesState: SeriesState | null;
}

export class GridClient {
  private apiKey: string;
  private centralDataUrl = "https://api-op.grid.gg/central-data/graphql";
  private seriesStateUrl = "https://api-op.grid.gg/live-data-feed/series-state/graphql";
  private headers: HeadersInit;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.headers = {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  private async executeQuery<T>(
    url: string,
    query: string,
    variables?: Record<string, unknown>
  ): Promise<GraphQLResponse<T> | null> {
    try {
      const payload: { query: string; variables?: Record<string, unknown> } = { query };
      if (variables) {
        payload.variables = variables;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return await response.json() as GraphQLResponse<T>;
      } else {
        console.error(`GRID API Error: Status ${response.status}`);
        const text = await response.text();
        console.error(`Response: ${text}`);
        return null;
      }
    } catch (error) {
      console.error(`GRID API Error:`, error);
      return null;
    }
  }

  async testConnection(): Promise<boolean> {
    const query = `
      query {
        allSeries(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await this.executeQuery<AllSeriesData>(this.centralDataUrl, query);
    return result !== null && result.data !== undefined;
  }

  async getTeams(limit: number = 50): Promise<string[]> {
    const query = `
      query GetSeries($limit: Int!) {
        allSeries(first: $limit) {
          edges {
            node {
              teams {
                baseInfo {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.executeQuery<AllSeriesData>(this.centralDataUrl, query, { limit });
    const teams = new Set<string>();

    if (result?.data?.allSeries?.edges) {
      for (const edge of result.data.allSeries.edges) {
        for (const team of edge.node.teams) {
          if (team?.baseInfo?.name) {
            teams.add(team.baseInfo.name);
          }
        }
      }
    }

    return Array.from(teams).sort();
  }

  async getTeamSeriesIds(teamName: string, limit: number = 20): Promise<string[]> {
    const query = `
      query GetSeries($limit: Int!) {
        allSeries(first: $limit) {
          edges {
            node {
              id
              startTimeScheduled
              teams {
                baseInfo {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `;

    const result = await this.executeQuery<AllSeriesData>(this.centralDataUrl, query, { limit: limit * 5 });
    const seriesIds: string[] = [];

    if (result?.data?.allSeries?.edges) {
      for (const edge of result.data.allSeries.edges) {
        for (const team of edge.node.teams) {
          if (team?.baseInfo?.name?.toLowerCase().includes(teamName.toLowerCase())) {
            seriesIds.push(edge.node.id);
            break;
          }
        }
        if (seriesIds.length >= limit) break;
      }
    }

    return seriesIds;
  }

  async getSeriesState(seriesId: string): Promise<SeriesState | null> {
    const query = `
      query SeriesState($seriesId: ID!) {
        seriesState(id: $seriesId) {
          id
          started
          finished
          teams {
            id
            name
            won
          }
          games {
            id
            teams {
              id
              won
              kills
              deaths
              players {
                id
                name
                character {
                  name
                }
                kills
                deaths
                killAssistsGiven
                netWorth
              }
            }
          }
        }
      }
    `;

    const result = await this.executeQuery<SeriesStateData>(this.seriesStateUrl, query, { seriesId });
    return result?.data?.seriesState || null;
  }

  async getChampionStatistics(): Promise<Map<string, ChampionStats>> {
    const championStats = new Map<string, ChampionStats>();
    
    try {
      const seriesIds = await this.getRecentSeriesIds(50);
      
      for (const seriesId of seriesIds.slice(0, 20)) {
        const state = await this.getSeriesState(seriesId);
        if (!state?.games) continue;

        for (const game of state.games) {
          for (const team of game.teams) {
            const isWinner = team.won;
            
            for (const player of team.players) {
              const champName = player.character?.name;
              if (!champName) continue;

              const existing = championStats.get(champName) || {
                picks: 0,
                wins: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
              };

              existing.picks++;
              if (isWinner) existing.wins++;
              existing.kills += player.kills;
              existing.deaths += player.deaths;
              existing.assists += player.killAssistsGiven;

              championStats.set(champName, existing);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching champion statistics:", error);
    }

    return championStats;
  }

  private async getRecentSeriesIds(limit: number): Promise<string[]> {
    const query = `
      query GetSeries($limit: Int!) {
        allSeries(first: $limit) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await this.executeQuery<AllSeriesData>(this.centralDataUrl, query, { limit });
    
    if (result?.data?.allSeries?.edges) {
      return result.data.allSeries.edges.map(edge => edge.node.id);
    }
    
    return [];
  }
}

interface ChampionStats {
  picks: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
}

export function createGridClient(): GridClient | null {
  const apiKey = process.env.GRID_API_KEY;
  if (!apiKey) {
    console.warn("GRID_API_KEY not set, using mock data");
    return null;
  }
  return new GridClient(apiKey);
}
