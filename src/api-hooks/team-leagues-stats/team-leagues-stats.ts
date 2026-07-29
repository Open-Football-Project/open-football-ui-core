import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { TeamPositionsAndPoints } from "../../types";

export const useTeamLeaguesStats = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number,
  leagueId: number
) => {
  const [ranksAndPoints, setRanksAndPoints] = useState<
    TeamPositionsAndPoints | undefined
  >();
  const [loadingRanksAndPoints, setLoadingRanksAndPoints] = useState(true);

  const isRankingAndPointsAvailable =
    !loadingRanksAndPoints &&
    ranksAndPoints !== undefined &&
    ranksAndPoints.awayTeam.length > 0 &&
    ranksAndPoints.homeTeam.length > 0;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingRanksAndPoints(true);
    teamsService
      .fetchTeamLeagueStats(homeTeamId, awayTeamId, leagueId)
      .then((it) => setRanksAndPoints(it))
      .catch(() => setRanksAndPoints(undefined))
      .finally(() => setLoadingRanksAndPoints(false));
  }, [homeTeamId, awayTeamId, leagueId]);

  return { ranksAndPoints, loadingRanksAndPoints, isRankingAndPointsAvailable };
};
