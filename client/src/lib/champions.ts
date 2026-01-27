import type { Champion, ChampionRole, ChampionTag } from "@shared/schema";

const createChampion = (
  id: string,
  name: string,
  role: ChampionRole,
  winRate: number,
  pickRate: number,
  banRate: number,
  tags: ChampionTag[],
  counters: string[],
  synergies: string[],
  tier?: "S" | "A" | "B" | "C" | "D"
): Champion => ({
  id,
  name,
  role,
  imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${id}.png`,
  winRate,
  pickRate,
  banRate,
  tags,
  counters,
  synergies,
  tier: tier || "B",
});

export const CHAMPIONS: Champion[] = [
  // TOP LANERS
  createChampion("Aatrox", "Aatrox", "top", 51.2, 8.5, 12.3, ["fighter", "sustain", "engage"], ["Fiora", "Irelia", "Vayne"], ["Orianna", "Lulu", "Thresh"], "A"),
  createChampion("Camille", "Camille", "top", 50.8, 6.2, 8.1, ["fighter", "split-push", "burst"], ["Jax", "Renekton", "Darius"], ["LeeSin", "Orianna", "Rakan"], "A"),
  createChampion("Darius", "Darius", "top", 50.5, 7.8, 10.2, ["fighter", "early-game", "tank"], ["Quinn", "Vayne", "Teemo"], ["Yuumi", "Lulu", "Thresh"], "B"),
  createChampion("Fiora", "Fiora", "top", 51.5, 5.8, 7.5, ["fighter", "split-push", "scaling"], ["Malphite", "Poppy", "Quinn"], ["Shen", "Galio", "TwistedFate"], "A"),
  createChampion("Gnar", "Gnar", "top", 49.8, 4.5, 3.2, ["tank", "engage", "cc"], ["Irelia", "Camille", "Yasuo"], ["Orianna", "Jarvan IV", "Syndra"], "B"),
  createChampion("Gwen", "Gwen", "top", 48.5, 3.2, 4.1, ["fighter", "scaling", "split-push"], ["Mordekaiser", "Sett", "Renekton"], ["Orianna", "Lulu", "Nami"], "C"),
  createChampion("Irelia", "Irelia", "top", 49.2, 7.5, 9.8, ["fighter", "burst", "early-game"], ["Trundle", "Volibear", "Sett"], ["Orianna", "Lulu", "Yuumi"], "B"),
  createChampion("Jax", "Jax", "top", 51.8, 8.2, 11.5, ["fighter", "scaling", "split-push"], ["Malphite", "Teemo", "Akali"], ["Lulu", "Yuumi", "Orianna"], "S"),
  createChampion("Jayce", "Jayce", "top", 48.2, 4.1, 2.8, ["poke", "early-game", "burst"], ["Irelia", "Wukong", "Malphite"], ["Orianna", "Karma", "Lulu"], "C"),
  createChampion("Kennen", "Kennen", "top", 50.1, 3.8, 2.5, ["mage", "engage", "cc"], ["Irelia", "Yasuo", "Sylas"], ["Jarvan IV", "Orianna", "Rell"], "B"),
  createChampion("KSante", "K'Sante", "top", 47.8, 5.5, 8.2, ["tank", "engage", "cc"], ["Fiora", "Vayne", "Gwen"], ["Orianna", "Azir", "Viego"], "B"),
  createChampion("Malphite", "Malphite", "top", 52.5, 6.8, 5.2, ["tank", "engage", "cc"], ["Sylas", "Mordekaiser", "Darius"], ["Yasuo", "Orianna", "MissFortune"], "A"),
  createChampion("Mordekaiser", "Mordekaiser", "top", 51.2, 5.2, 4.5, ["fighter", "sustain", "scaling"], ["Fiora", "Vayne", "Olaf"], ["Yuumi", "Lulu", "Orianna"], "B"),
  createChampion("Ornn", "Ornn", "top", 50.8, 4.5, 3.8, ["tank", "engage", "cc", "scaling"], ["Fiora", "Vayne", "Mordekaiser"], ["Orianna", "Jinx", "Aphelios"], "A"),
  createChampion("Renekton", "Renekton", "top", 49.5, 5.8, 4.2, ["fighter", "early-game", "engage"], ["Quinn", "Vayne", "Lucian"], ["Nidalee", "Elise", "LeeSin"], "B"),
  createChampion("Riven", "Riven", "top", 50.2, 5.5, 4.8, ["fighter", "burst", "cc"], ["Renekton", "Poppy", "Quinn"], ["Lulu", "Yuumi", "Orianna"], "B"),
  createChampion("Sett", "Sett", "top", 50.8, 6.2, 5.5, ["fighter", "tank", "engage"], ["Quinn", "Vayne", "Lucian"], ["Orianna", "Lulu", "Thresh"], "B"),
  createChampion("Shen", "Shen", "top", 51.5, 4.8, 3.5, ["tank", "engage", "support"], ["Mordekaiser", "Illaoi", "Yorick"], ["Orianna", "Jinx", "Aphelios"], "A"),

  // JUNGLERS
  createChampion("Elise", "Elise", "jungle", 50.2, 4.5, 3.8, ["assassin", "early-game", "cc"], ["Udyr", "Rammus", "Diana"], ["Orianna", "Renekton", "Jayce"], "B"),
  createChampion("Evelynn", "Evelynn", "jungle", 50.8, 5.2, 6.5, ["assassin", "burst", "scaling"], ["LeeSin", "Elise", "Rengar"], ["Orianna", "Twisted Fate", "Galio"], "B"),
  createChampion("Gragas", "Gragas", "jungle", 49.5, 4.8, 4.2, ["tank", "engage", "cc"], ["Graves", "Kindred", "Nidalee"], ["Yasuo", "Orianna", "Azir"], "B"),
  createChampion("Graves", "Graves", "jungle", 50.5, 6.8, 5.2, ["marksman", "burst", "early-game"], ["Rammus", "Malphite", "Sejuani"], ["Orianna", "Lulu", "Karma"], "A"),
  createChampion("Hecarim", "Hecarim", "jungle", 51.2, 7.5, 8.8, ["fighter", "engage", "burst"], ["Rammus", "Poppy", "Kindred"], ["Orianna", "Karma", "Lulu"], "A"),
  createChampion("JarvanIV", "Jarvan IV", "jungle", 50.8, 6.2, 4.5, ["fighter", "engage", "cc"], ["Graves", "Kindred", "Nidalee"], ["Orianna", "Syndra", "MissFortune"], "A"),
  createChampion("Karthus", "Karthus", "jungle", 51.5, 4.2, 5.8, ["mage", "scaling", "poke"], ["LeeSin", "Elise", "Nidalee"], ["Orianna", "Azir", "Jinx"], "A"),
  createChampion("KhaZix", "Kha'Zix", "jungle", 50.2, 7.8, 6.5, ["assassin", "burst", "early-game"], ["Rammus", "Sejuani", "Warwick"], ["Orianna", "Lulu", "Karma"], "B"),
  createChampion("Kindred", "Kindred", "jungle", 50.5, 5.5, 4.8, ["marksman", "scaling", "burst"], ["Rammus", "Sejuani", "Elise"], ["Orianna", "Lulu", "Taric"], "B"),
  createChampion("LeeSin", "Lee Sin", "jungle", 48.8, 12.5, 8.2, ["fighter", "early-game", "engage"], ["Rammus", "Sejuani", "Warwick"], ["Orianna", "Azir", "Viktor"], "B"),
  createChampion("Lillia", "Lillia", "jungle", 51.8, 5.8, 7.2, ["mage", "scaling", "cc"], ["LeeSin", "Elise", "Rengar"], ["Orianna", "Azir", "Jinx"], "A"),
  createChampion("Nidalee", "Nidalee", "jungle", 48.5, 4.2, 3.5, ["assassin", "poke", "early-game"], ["Rammus", "Sejuani", "Udyr"], ["Renekton", "Jayce", "Orianna"], "C"),
  createChampion("Nocturne", "Nocturne", "jungle", 51.2, 5.5, 4.2, ["assassin", "engage", "burst"], ["Rammus", "Sejuani", "Lissandra"], ["Orianna", "Lulu", "Karma"], "B"),
  createChampion("Rek'Sai", "Rek'Sai", "jungle", 50.5, 4.8, 3.8, ["fighter", "early-game", "engage"], ["Warwick", "Udyr", "Trundle"], ["Orianna", "Syndra", "Azir"], "B"),
  createChampion("Sejuani", "Sejuani", "jungle", 51.5, 4.5, 3.2, ["tank", "engage", "cc"], ["Olaf", "Trundle", "Kindred"], ["Orianna", "Azir", "Aphelios"], "A"),
  createChampion("Viego", "Viego", "jungle", 49.8, 8.2, 9.5, ["fighter", "burst", "scaling"], ["Rammus", "Sejuani", "Elise"], ["Orianna", "Lulu", "Renata"], "B"),
  createChampion("Vi", "Vi", "jungle", 51.8, 6.5, 5.8, ["fighter", "engage", "cc"], ["Graves", "Kindred", "Morgana"], ["Orianna", "Syndra", "Jinx"], "A"),
  createChampion("Wukong", "Wukong", "jungle", 51.2, 5.8, 4.5, ["fighter", "engage", "cc"], ["Rammus", "Sejuani", "Malphite"], ["Orianna", "Yasuo", "Jinx"], "A"),

  // MID LANERS
  createChampion("Ahri", "Ahri", "mid", 51.5, 9.8, 6.2, ["mage", "burst", "cc"], ["Kassadin", "Fizz", "Yasuo"], ["LeeSin", "JarvanIV", "Hecarim"], "A"),
  createChampion("Akali", "Akali", "mid", 48.5, 7.2, 12.5, ["assassin", "burst", "split-push"], ["Galio", "Lissandra", "Malzahar"], ["LeeSin", "Elise", "Nidalee"], "B"),
  createChampion("Anivia", "Anivia", "mid", 52.8, 3.5, 2.2, ["mage", "scaling", "cc"], ["Kassadin", "Fizz", "LeBlanc"], ["JarvanIV", "Sejuani", "Hecarim"], "A"),
  createChampion("Annie", "Annie", "mid", 52.2, 3.2, 1.8, ["mage", "burst", "engage"], ["Xerath", "Lux", "Syndra"], ["LeeSin", "Hecarim", "Wukong"], "B"),
  createChampion("Aurelion Sol", "Aurelion Sol", "mid", 51.8, 4.5, 5.2, ["mage", "scaling", "poke"], ["Fizz", "Zed", "Yasuo"], ["JarvanIV", "Sejuani", "Vi"], "A"),
  createChampion("Azir", "Azir", "mid", 47.8, 5.8, 4.5, ["mage", "scaling", "poke"], ["Xerath", "Syndra", "LeBlanc"], ["Sejuani", "Wukong", "Hecarim"], "B"),
  createChampion("Cassiopeia", "Cassiopeia", "mid", 51.2, 3.8, 2.5, ["mage", "scaling", "sustain"], ["Xerath", "Syndra", "Viktor"], ["Sejuani", "Hecarim", "Vi"], "A"),
  createChampion("Corki", "Corki", "mid", 49.5, 4.2, 2.8, ["marksman", "poke", "scaling"], ["Kassadin", "Fizz", "Akali"], ["Sejuani", "Vi", "JarvanIV"], "B"),
  createChampion("Diana", "Diana", "mid", 50.8, 5.5, 4.2, ["assassin", "burst", "engage"], ["Galio", "Lissandra", "Malzahar"], ["Yasuo", "Sejuani", "Wukong"], "B"),
  createChampion("Fizz", "Fizz", "mid", 50.2, 5.8, 7.5, ["assassin", "burst", "scaling"], ["Galio", "Lissandra", "Malzahar"], ["JarvanIV", "Hecarim", "Vi"], "B"),
  createChampion("Galio", "Galio", "mid", 50.8, 4.5, 3.2, ["tank", "engage", "cc"], ["Cassiopeia", "Viktor", "Syndra"], ["LeeSin", "Elise", "Nidalee"], "B"),
  createChampion("Kassadin", "Kassadin", "mid", 51.5, 4.8, 6.5, ["assassin", "scaling", "burst"], ["Talon", "Zed", "Pantheon"], ["Sejuani", "JarvanIV", "Vi"], "A"),
  createChampion("Katarina", "Katarina", "mid", 50.5, 6.2, 8.8, ["assassin", "burst", "cc"], ["Galio", "Diana", "Kassadin"], ["LeeSin", "Elise", "JarvanIV"], "B"),
  createChampion("LeBlanc", "LeBlanc", "mid", 48.8, 6.5, 5.2, ["assassin", "burst", "poke"], ["Galio", "Lissandra", "Malzahar"], ["LeeSin", "Elise", "Nidalee"], "B"),
  createChampion("Lissandra", "Lissandra", "mid", 51.2, 3.5, 2.2, ["mage", "engage", "cc"], ["Cassiopeia", "Viktor", "Orianna"], ["LeeSin", "Hecarim", "Wukong"], "B"),
  createChampion("Orianna", "Orianna", "mid", 50.5, 7.8, 3.8, ["mage", "cc", "poke"], ["Fizz", "Zed", "Yasuo"], ["JarvanIV", "Hecarim", "Wukong"], "A"),
  createChampion("Ryze", "Ryze", "mid", 47.5, 3.2, 2.8, ["mage", "scaling", "cc"], ["Xerath", "Syndra", "Cassiopeia"], ["JarvanIV", "Sejuani", "Vi"], "C"),
  createChampion("Syndra", "Syndra", "mid", 49.8, 5.5, 4.8, ["mage", "burst", "cc"], ["Fizz", "Zed", "Yasuo"], ["LeeSin", "Elise", "JarvanIV"], "B"),
  createChampion("Sylas", "Sylas", "mid", 49.5, 7.2, 6.8, ["fighter", "burst", "sustain"], ["Cassiopeia", "Anivia", "Malzahar"], ["LeeSin", "Elise", "JarvanIV"], "B"),
  createChampion("TwistedFate", "Twisted Fate", "mid", 50.2, 5.2, 3.5, ["mage", "cc", "poke"], ["Fizz", "Zed", "Yasuo"], ["Elise", "LeeSin", "Hecarim"], "B"),
  createChampion("Vex", "Vex", "mid", 51.5, 4.8, 5.2, ["mage", "burst", "engage"], ["Xerath", "Syndra", "Lux"], ["JarvanIV", "Hecarim", "Wukong"], "A"),
  createChampion("Viktor", "Viktor", "mid", 50.8, 5.8, 4.2, ["mage", "scaling", "poke"], ["Fizz", "Zed", "Yasuo"], ["JarvanIV", "Sejuani", "Vi"], "A"),
  createChampion("Yasuo", "Yasuo", "mid", 49.5, 10.5, 11.2, ["fighter", "scaling", "cc"], ["Renekton", "Pantheon", "Rammus"], ["Malphite", "Diana", "Gragas"], "B"),
  createChampion("Yone", "Yone", "mid", 49.8, 9.8, 10.5, ["fighter", "scaling", "burst"], ["Renekton", "Pantheon", "Rammus"], ["Diana", "Gragas", "Sejuani"], "B"),
  createChampion("Zed", "Zed", "mid", 49.2, 8.5, 9.8, ["assassin", "burst", "split-push"], ["Lissandra", "Galio", "Malzahar"], ["LeeSin", "Elise", "JarvanIV"], "B"),
  createChampion("Zoe", "Zoe", "mid", 50.5, 4.2, 3.8, ["mage", "burst", "poke"], ["Fizz", "Yasuo", "Kassadin"], ["JarvanIV", "Vi", "Hecarim"], "B"),

  // ADCs
  createChampion("Aphelios", "Aphelios", "adc", 48.5, 6.8, 5.5, ["marksman", "scaling", "burst"], ["Draven", "Caitlyn", "MissFortune"], ["Thresh", "Lulu", "Renata"], "B"),
  createChampion("Ashe", "Ashe", "adc", 51.8, 8.5, 4.2, ["marksman", "cc", "poke"], ["Samira", "Draven", "Lucian"], ["Thresh", "Leona", "Nautilus"], "A"),
  createChampion("Caitlyn", "Caitlyn", "adc", 50.5, 10.2, 6.8, ["marksman", "poke", "early-game"], ["Samira", "Draven", "Vayne"], ["Lux", "Morgana", "Karma"], "A"),
  createChampion("Draven", "Draven", "adc", 50.2, 5.5, 4.8, ["marksman", "early-game", "burst"], ["Caitlyn", "Ezreal", "Sivir"], ["Thresh", "Leona", "Nautilus"], "B"),
  createChampion("Ezreal", "Ezreal", "adc", 49.8, 15.5, 3.2, ["marksman", "poke", "scaling"], ["Draven", "MissFortune", "Lucian"], ["Karma", "Yuumi", "Lulu"], "B"),
  createChampion("Jhin", "Jhin", "adc", 51.2, 12.8, 5.5, ["marksman", "poke", "cc"], ["Samira", "Vayne", "Draven"], ["Thresh", "Leona", "Xerath"], "A"),
  createChampion("Jinx", "Jinx", "adc", 51.5, 11.5, 6.2, ["marksman", "scaling", "cc"], ["Draven", "Lucian", "Samira"], ["Thresh", "Lulu", "Nautilus"], "A"),
  createChampion("KaiSa", "Kai'Sa", "adc", 49.5, 13.2, 7.8, ["marksman", "burst", "scaling"], ["Draven", "MissFortune", "Lucian"], ["Nautilus", "Thresh", "Leona"], "B"),
  createChampion("Kalista", "Kalista", "adc", 48.8, 4.5, 5.2, ["marksman", "early-game", "cc"], ["Caitlyn", "Ashe", "MissFortune"], ["Thresh", "Renata", "Nautilus"], "C"),
  createChampion("Lucian", "Lucian", "adc", 49.2, 8.8, 4.5, ["marksman", "early-game", "burst"], ["Caitlyn", "Jinx", "Kog'Maw"], ["Nami", "Braum", "Thresh"], "B"),
  createChampion("MissFortune", "Miss Fortune", "adc", 51.8, 9.5, 5.8, ["marksman", "poke", "cc"], ["Samira", "Vayne", "Draven"], ["Leona", "Nautilus", "Amumu"], "A"),
  createChampion("Samira", "Samira", "adc", 49.8, 7.5, 9.2, ["marksman", "burst", "engage"], ["Caitlyn", "Ashe", "Jhin"], ["Rell", "Nautilus", "Leona"], "B"),
  createChampion("Sivir", "Sivir", "adc", 50.5, 5.8, 3.2, ["marksman", "poke", "scaling"], ["Draven", "Samira", "Lucian"], ["Karma", "Lulu", "Yuumi"], "B"),
  createChampion("Tristana", "Tristana", "adc", 50.8, 6.2, 4.5, ["marksman", "burst", "scaling"], ["Draven", "Lucian", "MissFortune"], ["Leona", "Nautilus", "Thresh"], "B"),
  createChampion("Twitch", "Twitch", "adc", 51.2, 4.8, 3.5, ["marksman", "scaling", "burst"], ["Draven", "Lucian", "MissFortune"], ["Lulu", "Yuumi", "Karma"], "B"),
  createChampion("Vayne", "Vayne", "adc", 50.5, 9.2, 8.5, ["marksman", "scaling", "burst"], ["Draven", "Caitlyn", "MissFortune"], ["Lulu", "Thresh", "Nami"], "B"),
  createChampion("Xayah", "Xayah", "adc", 49.8, 5.5, 4.2, ["marksman", "cc", "scaling"], ["Draven", "Caitlyn", "MissFortune"], ["Rakan", "Lulu", "Thresh"], "B"),
  createChampion("Zeri", "Zeri", "adc", 47.5, 3.8, 5.8, ["marksman", "scaling", "burst"], ["Draven", "Lucian", "MissFortune"], ["Lulu", "Yuumi", "Karma"], "C"),

  // SUPPORTS
  createChampion("Alistar", "Alistar", "support", 50.8, 4.5, 3.2, ["tank", "engage", "cc"], ["Morgana", "Janna", "Zyra"], ["Kalista", "Samira", "Yasuo"], "B"),
  createChampion("Bard", "Bard", "support", 51.5, 5.2, 3.8, ["support", "cc", "poke"], ["Leona", "Nautilus", "Blitzcrank"], ["Caitlyn", "Jhin", "Ashe"], "A"),
  createChampion("Blitzcrank", "Blitzcrank", "support", 51.2, 6.8, 8.5, ["tank", "engage", "cc"], ["Morgana", "Sivir", "Ezreal"], ["Samira", "Draven", "Lucian"], "A"),
  createChampion("Braum", "Braum", "support", 50.5, 4.2, 2.8, ["tank", "engage", "cc"], ["Zyra", "Brand", "Vel'Koz"], ["Lucian", "Kalista", "Samira"], "B"),
  createChampion("Janna", "Janna", "support", 52.5, 5.8, 3.2, ["support", "cc", "poke"], ["Blitzcrank", "Leona", "Nautilus"], ["Jinx", "Kog'Maw", "Twitch"], "A"),
  createChampion("Karma", "Karma", "support", 49.8, 6.5, 3.5, ["mage", "poke", "support"], ["Blitzcrank", "Leona", "Nautilus"], ["Caitlyn", "Ezreal", "Sivir"], "B"),
  createChampion("Leona", "Leona", "support", 51.5, 8.2, 6.5, ["tank", "engage", "cc"], ["Morgana", "Janna", "Zyra"], ["Samira", "MissFortune", "Draven"], "A"),
  createChampion("Lulu", "Lulu", "support", 51.8, 9.5, 7.2, ["support", "cc", "poke"], ["Blitzcrank", "Leona", "Nautilus"], ["Jinx", "Kog'Maw", "Twitch"], "S"),
  createChampion("Milio", "Milio", "support", 52.2, 7.8, 8.5, ["support", "cc", "sustain"], ["Blitzcrank", "Leona", "Nautilus"], ["Jinx", "Kog'Maw", "Aphelios"], "S"),
  createChampion("Morgana", "Morgana", "support", 51.2, 7.5, 5.8, ["mage", "cc", "support"], ["Zyra", "Brand", "Xerath"], ["Caitlyn", "Jhin", "Jinx"], "A"),
  createChampion("Nami", "Nami", "support", 51.5, 8.8, 4.5, ["support", "cc", "sustain"], ["Blitzcrank", "Leona", "Nautilus"], ["Lucian", "Jhin", "Draven"], "A"),
  createChampion("Nautilus", "Nautilus", "support", 50.8, 9.2, 9.8, ["tank", "engage", "cc"], ["Morgana", "Janna", "Zyra"], ["Samira", "MissFortune", "Draven"], "A"),
  createChampion("Pyke", "Pyke", "support", 49.5, 6.5, 7.8, ["assassin", "engage", "cc"], ["Morgana", "Janna", "Lulu"], ["Draven", "Samira", "Lucian"], "B"),
  createChampion("Rakan", "Rakan", "support", 50.5, 5.8, 4.2, ["support", "engage", "cc"], ["Morgana", "Janna", "Alistar"], ["Xayah", "Samira", "Kalista"], "B"),
  createChampion("Rell", "Rell", "support", 50.8, 3.5, 2.5, ["tank", "engage", "cc"], ["Morgana", "Janna", "Zyra"], ["Samira", "MissFortune", "Yasuo"], "B"),
  createChampion("Renata", "Renata Glasc", "support", 50.2, 4.8, 3.8, ["support", "cc", "sustain"], ["Blitzcrank", "Leona", "Nautilus"], ["Jinx", "Aphelios", "Kog'Maw"], "B"),
  createChampion("Senna", "Senna", "support", 50.5, 8.2, 5.5, ["marksman", "support", "poke"], ["Blitzcrank", "Leona", "Nautilus"], ["Caitlyn", "Jhin", "Ashe"], "B"),
  createChampion("Thresh", "Thresh", "support", 49.8, 11.5, 6.2, ["tank", "engage", "cc"], ["Morgana", "Janna", "Zyra"], ["Samira", "Draven", "Lucian"], "A"),
  createChampion("Yuumi", "Yuumi", "support", 48.5, 5.2, 12.5, ["support", "sustain", "poke"], ["Blitzcrank", "Leona", "Nautilus"], ["Jinx", "Twitch", "Kog'Maw"], "C"),
  createChampion("Zyra", "Zyra", "support", 51.8, 4.5, 2.8, ["mage", "poke", "cc"], ["Blitzcrank", "Leona", "Nautilus"], ["Caitlyn", "Jhin", "Ashe"], "A"),
];

export const getChampionById = (id: string): Champion | undefined => {
  return CHAMPIONS.find(c => c.id === id);
};

export const getChampionsByRole = (role: ChampionRole): Champion[] => {
  return CHAMPIONS.filter(c => c.role === role);
};

export const getAvailableChampions = (
  bannedIds: string[],
  pickedIds: string[]
): Champion[] => {
  const unavailable = new Set([...bannedIds, ...pickedIds]);
  return CHAMPIONS.filter(c => !unavailable.has(c.id));
};

export const getRoleIcon = (role: ChampionRole): string => {
  const icons: Record<ChampionRole, string> = {
    top: "🗡️",
    jungle: "🌲",
    mid: "⚡",
    adc: "🏹",
    support: "🛡️",
  };
  return icons[role];
};
