import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { MatchDetails } from "../../types";
import { useMatchStats } from "../match-stats/match-stats";
import { useMatchLineups } from "../match-lineups/match-lineups";
import { useMatchOdds } from "../match-odds/match-odds";
import { useMatchEvents } from "../match-events/match-events";

export const useMatchDetail = (apiService: ApiService, matchId: number) => {
  const [matchDetail, setMatchDetails] = useState<MatchDetails | undefined>(
    undefined
  );
  const [loadingMatchDetail, setLoadingMatchDetails] = useState(true);

  const isMatcheDetailAvalable =
    !loadingMatchDetail && matchDetail !== undefined;

  const { matchesService } = apiService;

  useEffect(() => {
    setLoadingMatchDetails(true);
    matchesService
      .fetchMatchDetails(matchId)
      .then((details) => {
        setMatchDetails(details);
        setLoadingMatchDetails(false);
      })
      .catch(() => {
        setLoadingMatchDetails(false);
        setMatchDetails(undefined);
      });
  }, [matchId]);

  const { isStatsAvailable, matchStats } = useMatchStats(
    apiService,
    matchId,
    90
  );

  const { isLineupsAvailable, matchLineups } = useMatchLineups(
    apiService,
    matchId
  );

  const { loadingOdds, odds, isOddsAvailable } = useMatchOdds(
    apiService,
    matchId
  );

  const { loadingEvents, events, isEventsAvailable } = useMatchEvents(
    apiService,
    matchId
  );

  return {
    loadingMatchDetail,
    matchDetail,
    isMatcheDetailAvalable,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    loadingOdds,
    odds,
    isOddsAvailable,
    loadingEvents,
    events,
    isEventsAvailable,
  };
};
