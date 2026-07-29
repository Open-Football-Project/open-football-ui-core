import { useEffect, useState } from "react";
import { TeamForm } from "../../types";
import { ApiService } from "../../api-service";

export const useLastFiveResults = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number
) => {
  const [lastFiveResults, setLastFiveResults] = useState<
    TeamForm | undefined
  >();
  const [loadingLastFiveResults, setLoadingLastFiveResults] = useState(true);

  const isLastFiveResultsAvailable =
    !loadingLastFiveResults &&
    lastFiveResults !== undefined &&
    lastFiveResults.awayTeamLastFive.length > 0 &&
    lastFiveResults.homeTeamLastFive.length > 0;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingLastFiveResults(true);
    teamsService
      .fetchLastFiveMatches(homeTeamId, awayTeamId)
      .then((it) => setLastFiveResults(it))
      .catch(() => setLastFiveResults(undefined))
      .finally(() => setLoadingLastFiveResults(false));
  }, [homeTeamId, awayTeamId]);

  return {
    lastFiveResults,
    isLastFiveResultsAvailable,
    loadingLastFiveResults,
  };
};
