import { useCallback, useMemo, useState } from "react";
import { LeagueFixture } from "../../types";
import { LEAGUE_CUP_ROUNDS } from "../../values";
import { normalizeLeagueRound } from "../../utils/useful/useful";
import { buildRoundsInOrder } from "../../utils/league-fixture/general/league-fixture-general-utils";
import {
  BracketPicks,
  buildBracketFromPicks,
  extractUniqueTeams,
} from "../../utils/league-fixture/bracket-picks/bracket-picks";
import { BracketNode } from "../../utils/league-fixture/general/league-fixture-general-utils";

export const useBracketGame = (fixtures: LeagueFixture, _leagueName: string) => {
  const [picks, setPicks] = useState<BracketPicks>({});

  const { leafRound, roundKeys, totalLeafSlots } = useMemo(() => {
    const orderedRounds = buildRoundsInOrder(fixtures.rounds);
    if (!orderedRounds.length) return { leafRound: null, roundKeys: [] as string[], totalLeafSlots: 0 };

    const leafKey = normalizeLeagueRound(orderedRounds[0].name);
    const leafIdx = LEAGUE_CUP_ROUNDS.indexOf(leafKey);
    if (leafIdx === -1) return { leafRound: null, roundKeys: [] as string[], totalLeafSlots: 0 };

    const finalIdx = LEAGUE_CUP_ROUNDS.indexOf("final");
    const keys = LEAGUE_CUP_ROUNDS.slice(leafIdx, finalIdx + 1);
    const leafSlots = Math.pow(2, finalIdx - leafIdx);

    return { leafRound: leafKey, roundKeys: keys, totalLeafSlots: leafSlots };
  }, [fixtures]);

  const teams = useMemo(() => extractUniqueTeams(fixtures), [fixtures]);

  const setPick = useCallback((slotId: string, team: string) => {
    setPicks((prev) => ({ ...prev, [slotId]: team }));
  }, []);

  const clearPick = useCallback((slotId: string) => {
    setPicks((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  const buildTree = useCallback((): BracketNode | null => {
    if (!leafRound) return null;
    return buildBracketFromPicks(picks, leafRound);
  }, [picks, leafRound]);

  return { picks, setPick, clearPick, buildTree, teams, leafRound, roundKeys, totalLeafSlots };
};
