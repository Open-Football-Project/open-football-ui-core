import { useEffect, useState } from "react";
import { LastFiveMatchesEvents } from "../../types";
import { ApiService } from "../../api-service";

export const useLastFiveMatchesEvents = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number
) => {
  const [homeEventsSummary, setHomeEventsSummary] = useState<
    LastFiveMatchesEvents | undefined
  >(undefined);
  const [loadingHomeEvents, setLoadingHomeEvents] = useState(false);

  const isHomeEventsAvailable =
    !loadingHomeEvents && homeEventsSummary !== undefined;

  const [awayEventsSummary, setAwayEventsSummary] = useState<
    LastFiveMatchesEvents | undefined
  >(undefined);
  const [loadingAwayEvents, setLoadingAwayEvents] = useState(false);

  const isAwayEventsAvailable =
    !loadingAwayEvents && awayEventsSummary !== undefined;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingHomeEvents(true);
    setLoadingAwayEvents(true);

    teamsService
      .fetchLastFiveMatchesEvents(homeTeamId)
      .then((data: LastFiveMatchesEvents) => setHomeEventsSummary(data))
      .catch(() => setHomeEventsSummary(undefined))
      .finally(() => setLoadingHomeEvents(false));

    teamsService
      .fetchLastFiveMatchesEvents(awayTeamId)
      .then((data: LastFiveMatchesEvents) => setAwayEventsSummary(data))
      .catch(() => setAwayEventsSummary(undefined))
      .finally(() => setLoadingAwayEvents(false));
  }, [homeTeamId, awayTeamId]);

  return {
    loadingHomeEvents,
    homeEventsSummary,
    loadingAwayEvents,
    awayEventsSummary,
    isAwayEventsAvailable,
    isHomeEventsAvailable,
  };
};
