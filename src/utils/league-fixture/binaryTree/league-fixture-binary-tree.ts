import { useMemo } from "react";
import { LeagueFixture } from "../../../types";
import { BracketNode, buildRoundsInOrder, findTieContainingTeam, roundsTiesMap, Tie } from "../general/league-fixture-general-utils";
import { normalizeLeagueRound } from "../../useful/useful";
import { LEAGUE_CUP_ROUNDS } from "../../../values";

export type Side = "left" | "right";

export type QueueItem = {
  roundIdx: number;
  searchTeam: string | null;
  parent: BracketNode | null;
  side: Side | null;
};

/**
 * Builds a knockout bracket binary tree top-down from the Final (root).
 * Uses BFS so each level is fully resolved before descending.
 *
 * Tree shape:  Final → SF → QF → R16 → R32 (leaf limit)
 */
export function useLeagueFixtureBinaryTree(fixtures: LeagueFixture): BracketNode | null {
  return useMemo(() => {
    const orderedRounds = buildRoundsInOrder(fixtures.rounds);
    if (!orderedRounds.length) return null;

    const leafKey = normalizeLeagueRound(orderedRounds[0].name);
    const leafIdx = LEAGUE_CUP_ROUNDS.indexOf(leafKey);
    if (leafIdx === -1) return null;

    const pool = roundsTiesMap(orderedRounds);

    const finalIdx = LEAGUE_CUP_ROUNDS.indexOf("final");
    for (const [roundKey, ties] of pool) {
      const roundIdx = LEAGUE_CUP_ROUNDS.indexOf(roundKey);
      const expected = Math.pow(2, finalIdx - roundIdx);
      if (ties.length > expected) return null;
    }

    let root: BracketNode | null = null;
    const queue: QueueItem[] = [
      { roundIdx: LEAGUE_CUP_ROUNDS.indexOf("final"), searchTeam: null, parent: null, side: null },
    ];

    while (queue.length > 0) {
      const { roundIdx, searchTeam, parent, side } = queue.shift()!;

      const roundKey = LEAGUE_CUP_ROUNDS[roundIdx];
      const ties = pool.get(roundKey) ?? [];

      let tie: Tie | null = null;
      let missingData = false;

      if (searchTeam !== null) {
        tie = findTieContainingTeam(ties, searchTeam);
        if (!tie) missingData = true;
      } else {
        tie = ties.shift() ?? null;
      }

      const node: BracketNode = { roundKey, tie, missingData };

      if (parent === null)        root         = node;
      else if (side === "left")   parent.left  = node;
      else                        parent.right = node;

      if (roundIdx > leafIdx) {
        queue.push({ roundIdx: roundIdx - 1, searchTeam: tie?.t1 ?? null, parent: node, side: "left"  });
        queue.push({ roundIdx: roundIdx - 1, searchTeam: tie?.t2 ?? null, parent: node, side: "right" });
      }
    }

    return root;
  }, [fixtures]);
}
