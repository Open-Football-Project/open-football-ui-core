import { useEffect, useState } from "react";
import { LiveMatch, Poll } from "../../types";
import { ApiService } from "../../api-service";

import {
  useAvailablePolls,
  useMatchLineups,
  useMatchOdds,
  useMatchStats,
} from "../../api-hooks";

export const useLiveMatchesStatus = (
  apiService: ApiService,
  matches: LiveMatch[],
  fixtureId?: number
) => {
  const totalMatches = matches.length;

  const getSelectedMatch = () => {
    if (fixtureId) return fixtureId;
    return totalMatches > 0 ? matches[0].id : null;
  };

  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(
    getSelectedMatch()
  );

  useEffect(() => {
    if (
      matches.length > 0 &&
      (selectedMatchId === null ||
        !matches.some((m) => m.id === selectedMatchId))
    ) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  const polls: Poll[] = selectedMatch?.polls ?? [];
  const { availablePolls, isAvailablePollsOn } = useAvailablePolls(
    apiService,
    Number(selectedMatchId)
  );

  const matchTotalMinutes = () => {
    return (selectedMatch?.elapsedTime ?? 0) + (selectedMatch?.extraTime ?? 0);
  };

  const { isStatsAvailable, matchStats } = useMatchStats(
    apiService,
    Number(selectedMatchId),
    matchTotalMinutes()
  );

  const { isLineupsAvailable, matchLineups } = useMatchLineups(
    apiService,
    Number(selectedMatchId)
  );

  const { loadingOdds, odds, isOddsAvailable } = useMatchOdds(
    apiService,
    Number(selectedMatchId)
  );

  return {
    totalMatches,
    selectedMatchId,
    setSelectedMatchId,
    selectedMatch,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    polls,
    isAvailablePollsOn,
    availablePolls,
    loadingOdds,
    odds,
    isOddsAvailable,
  };
};
