import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { TeamsScorePerformance } from "../../types";

export const useTeamsScorePerformance = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number,
  leagueId: number
) => {
  const [teamsPerformance, setTeamsPerformance] = useState<
    TeamsScorePerformance | undefined
  >();
  const [loadingTeamsPerformance, setLoadingTeamsPerformance] = useState(true);

  const isPerformanceAvailable =
    !loadingTeamsPerformance && teamsPerformance !== undefined;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingTeamsPerformance(true);
    teamsService
      .fetchTeamsScorePerformance(homeTeamId, awayTeamId, leagueId)
      .then((it) => setTeamsPerformance(it))
      .catch(() => setTeamsPerformance(undefined))
      .finally(() => setLoadingTeamsPerformance(false));
  }, [homeTeamId, awayTeamId, leagueId]);

  return { teamsPerformance, loadingTeamsPerformance, isPerformanceAvailable };
};
