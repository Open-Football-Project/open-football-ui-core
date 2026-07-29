import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { TwoTeamsStatistics } from "../../types";

export const useMatchStats = (
  apiService: ApiService,
  fixtureId: number,
  matchMinutes: number
) => {
  const [matchStats, setMatchStats] = useState<TwoTeamsStatistics | undefined>(
    undefined
  );
  const [loadingMatchStats, setLoadingMatchStats] = useState(true);

  const { matchesService } = apiService;

  const teamAStats = matchStats?.teamA?.statistics ?? [];
  const teamBStats = matchStats?.teamB?.statistics ?? [];

  const isStatsAvailable =
    !loadingMatchStats &&
    matchStats !== undefined &&
    teamAStats.length > 0 &&
    teamBStats.length > 0;

  useEffect(() => {
    setLoadingMatchStats(true);

    matchesService
      .fetchMatchStats(fixtureId)
      .then((res) => {
        setMatchStats(res);
      })
      .catch(() => {
        setMatchStats(undefined);
      })
      .finally(() => setLoadingMatchStats(false));
  }, [fixtureId, matchMinutes]);

  return {
    loadingMatchStats,
    matchStats,
    isStatsAvailable,
  };
};
