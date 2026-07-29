import { BracketNode, Tie } from "../general/league-fixture-general-utils";
import { LeagueFixture } from "../../../types";
import { LEAGUE_CUP_ROUNDS } from "../../../values";
import { normalizeLeagueRound } from "../../useful/useful";


export type BracketPicks = Record<string, string | null>;

type QueueItem = {
  roundIdx: number;
  matchIndex: number;
  parent: BracketNode | null;
  side: "left" | "right" | null;
};

export function buildBracketFromPicks(picks: BracketPicks, leafRound: string): BracketNode {
  const finalIdx = LEAGUE_CUP_ROUNDS.indexOf("final");
  const leafIdx = LEAGUE_CUP_ROUNDS.indexOf(leafRound);

  let root: BracketNode = { roundKey: "final", tie: null, missingData: false };
  const queue: QueueItem[] = [{ roundIdx: finalIdx, matchIndex: 0, parent: null, side: null }];

  while (queue.length > 0) {
    const { roundIdx, matchIndex, parent, side } = queue.shift()!;
    const roundKey = LEAGUE_CUP_ROUNDS[roundIdx];

    const t1 = picks[`${roundKey}-${matchIndex}-t1`] ?? undefined;
    const t2 = picks[`${roundKey}-${matchIndex}-t2`] ?? undefined;
    const hasPick = t1 !== undefined || t2 !== undefined;
    const tie: Tie | null = hasPick ? { t1: t1 ?? "", t2: t2 ?? "", legs: [], aggregate: null } : null;

    const node: BracketNode = { roundKey, tie, missingData: false };

    if (parent === null) root = node;
    else if (side === "left") parent.left = node;
    else parent.right = node;

    if (roundIdx > leafIdx) {
      queue.push({ roundIdx: roundIdx - 1, matchIndex: matchIndex * 2, parent: node, side: "left" });
      queue.push({ roundIdx: roundIdx - 1, matchIndex: matchIndex * 2 + 1, parent: node, side: "right" });
    }
  }

  return root;
}

export function extractUniqueTeams(fixtures: LeagueFixture): string[] {
  const teams = new Set<string>();
  for (const round of fixtures.rounds) {
    if (!LEAGUE_CUP_ROUNDS.includes(normalizeLeagueRound(round.name))) continue;
    for (const day of round.days) {
      for (const match of day.matches) {
        if (match.homeTeamName) teams.add(match.homeTeamName);
        if (match.awayTeamName) teams.add(match.awayTeamName);
      }
    }
  }
  return [...teams].sort();
}
