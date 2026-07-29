import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { TwoTeamsStatistics } from "../../types";

export const useSeasonStats = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number,
  leagueId: number
) => {
  const [seasonStats, setSeasonStats] = useState<
    TwoTeamsStatistics | undefined
  >(undefined);
  const [loadingSeasonStats, setLoadingSeasonStats] = useState(true);

  const teamAStats = seasonStats?.teamA?.statistics ?? [];
  const teamBStats = seasonStats?.teamB?.statistics ?? [];

  const isSeasonStatsAvailable =
    !loadingSeasonStats &&
    seasonStats !== undefined &&
    teamAStats.length > 0 &&
    teamBStats.length > 0;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingSeasonStats(true);

    teamsService
      .fetchSeasonStats(homeTeamId, awayTeamId, leagueId)
      .then((result) => setSeasonStats(result))
      .catch(() => setSeasonStats(undefined))
      .finally(() => setLoadingSeasonStats(false));
  }, [homeTeamId, awayTeamId, leagueId]);

  return {
    loadingSeasonStats,
    seasonStats,
    isSeasonStatsAvailable,
  };
};
