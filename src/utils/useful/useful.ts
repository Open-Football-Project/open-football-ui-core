import { TeamStatistic } from "../../types";
import { MAIN_LEAGUE_IDS } from "../../values";

export const anyMainLeagueId = (leagueIds: number[]): boolean =>
  leagueIds.some((id) => MAIN_LEAGUE_IDS.includes(id));

type ReplaceRule = [RegExp, string];

const applyReplacements = (value: string, rules: ReplaceRule[]) =>
  rules.reduce((acc, [pattern, replacement]) => {
    return acc.replace(pattern, replacement);
  }, value);

const LEAGUE_NAME_RULES: ReplaceRule[] = [
  [/conmebol/gi, ""],
  [/uefa/gi, ""],
  [/fifa/gi, ""],
  [/qualification/gi, "Q."],
  [/profesional/gi, "Prof."],
  [/primera/gi, "Prim."],
  [/league/gi, "Lg."],
  [/world cup -/gi, "WC"],
  [/apertura/gi, "Ape."],
  [/clausura/gi, "Cla."],
  [/segunda/gi, "Seg."],
  [/ - /gi, " "],
  [/metropolitana/gi, "Metro"],
  [/clasificación mundial/gi, "Clas. CM"],
];

export const cleanLeagueName = (leagueName: string) =>
  applyReplacements(leagueName, LEAGUE_NAME_RULES).trim();

const LEAGUE_GROUP_RULES: ReplaceRule[] = [
  [/conmebol libertadores/gi, ""],
  [/conmebol sudamericana/gi, ""],
  [/primera division/gi, ""],
  [/championship/gi, ""],
  [/reserves/gi, ""],
  [/qualification/gi, "Q."],
  [/profesional/gi, "Prof."],
  [/primera/gi, "Prim."],
  [/league/gi, "Lg."],
  [/apertura/gi, "Ape"],
  [/clausura/gi, "Cla"],
  [/segunda/gi, "Seg"],
  [/intermedio/gi, "Int"],
  [/premiera/gi, ""],
  [/torneo federal/gi, ""],
  [/ranking of third-placed teams?/gi, "Third Placed"],
  [/third-placed/gi, "Third Placed"],
];

export const cleanUpLeagueGrp = (value: string) =>
  applyReplacements(value, LEAGUE_GROUP_RULES).trim();

export const normalizeLeagueRound = (leagueRoundName: string) =>
  leagueRoundName
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .replace(/__+/g, "_");

export const normalizeStatName = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

export const getTeamStatistic = (
  stats: TeamStatistic[],
  name: string,
): number =>
  stats.find((s) => normalizeStatName(s.name) === normalizeStatName(name))
    ?.value ?? 0;

export enum IndicatorStats {
  SHOTS_ON_GOAL = "shots_on_goal",
  SHOTS_OFF_GOAL = "shots_off_goal",
  SHOTS_INSIDEBOX = "shots_insidebox",
  CORNER_KICKS = "corner_kicks",
  BALL_POSSESSION = "ball_possession",
  PASSES_PERCENTAGE = "passes_%",
  EXPECTED_GOALS = "expected_goals",
}

export enum MatchEventType {
  GOAL = "goal",
  CARD = "card",
  VAR = "var",
}

export enum MatchEventDetail {
  YELLOW = "yellow",
  RED = "red",
  SUBSTITUTION = "substitution",
  MISSED = "missed",
  PENALTY = "penalty",
}
