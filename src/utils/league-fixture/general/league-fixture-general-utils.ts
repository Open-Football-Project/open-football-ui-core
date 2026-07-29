import { LeagueFixtureRound, LeagueFixturesMatch } from "../../../types";
import { LEAGUE_CUP_ROUNDS } from "../../../values";
import { normalizeLeagueRound } from "../../useful/useful";

export interface LegScore {
  t1Score: number | null;
  t2Score: number | null;
  isFinished: boolean;
}

export interface Tie {
  t1: string;
  t1logo?: string;
  t2: string;
  t2logo?: string;
  legs: LegScore[];
  aggregate: { t1Score: number; t2Score: number } | null;
}

export interface BracketNode {
  roundKey: string;
  tie: Tie | null;
  missingData: boolean;
  left?: BracketNode;
  right?: BracketNode;
}

export const matchesToTie = (matches: LeagueFixturesMatch[]): Tie => {
  const [first] = matches;
  const { homeTeamId: t1Id, homeTeamName: t1, homeTeamLogo: t1logo, awayTeamName: t2, awayTeamLogo: t2logo } = first;

  const legs: LegScore[] = matches.map((match) => {
    const t1IsHome = match.homeTeamId === t1Id;
    return {
      t1Score: (t1IsHome ? match.homeTeamScore : match.awayTeamScore) ?? null,
      t2Score: (t1IsHome ? match.awayTeamScore : match.homeTeamScore) ?? null,
      isFinished: match.isFinished,
    };
  });

  const isDecided = legs.every((leg) => leg.isFinished && leg.t1Score !== null && leg.t2Score !== null);
  const aggregate = isDecided
    ? {
        t1Score: legs.reduce((sum, leg) => sum + (leg.t1Score ?? 0), 0),
        t2Score: legs.reduce((sum, leg) => sum + (leg.t2Score ?? 0), 0),
      }
    : null;

  return { t1, t1logo, t2, t2logo, legs, aggregate };
}

export const roundsTiesMap =(rounds: LeagueFixtureRound[]): Map<string, Tie[]> =>{
  const result = new Map<string, Tie[]>();
  for (const r of rounds) {
    const ties = groupByTie(flatKnockoutMatches(r)).map(matchesToTie);
    result.set(normalizeLeagueRound(r.name), ties);
  }
  return result;
}

export const findTieContainingTeam = (ties: Tie[], searchTeam: string): Tie | null => {
  const idx = ties.findIndex((t) => t.t1 === searchTeam || t.t2 === searchTeam);
  return idx !== -1 ? ties.splice(idx, 1)[0] : null;
}


export const flatKnockoutMatches = (round: LeagueFixtureRound) =>
  round.days.flatMap((day) => day.matches);

export const buildRoundsInOrder = (rounds: LeagueFixtureRound[]) =>
  rounds
    .map((round) => ({ round, key: normalizeLeagueRound(round.name) }))
    .filter((it) => LEAGUE_CUP_ROUNDS.includes(it.key))
    .sort(
      (a, b) =>
        LEAGUE_CUP_ROUNDS.indexOf(a.key) - LEAGUE_CUP_ROUNDS.indexOf(b.key)
    )
    .map((it) => it.round);

export const groupByTie = (matches: LeagueFixturesMatch[]) => {
  const groups: LeagueFixturesMatch[][] = [];

  matches.forEach((match) => {
    const group = groups.find((g) =>
      g.some(
        (m) =>
          (m.homeTeamId === match.homeTeamId &&
            m.awayTeamId === match.awayTeamId) ||
          (m.homeTeamId === match.awayTeamId &&
            m.awayTeamId === match.homeTeamId)
      )
    );

    if (group) {
      group.push(match);
    } else {
      groups.push([match]);
    }
  });

  return groups.map((g) =>
    g.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
};
