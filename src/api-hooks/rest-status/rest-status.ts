import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { TeamsRestStatus } from "../../types";

export const useRestStatus = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number,
  fixtureDate: string
) => {
  const [restStatus, setRestStatus] = useState<TeamsRestStatus | undefined>();
  const [loadingRestStatus, setLoadingRestStatus] = useState(true);

  const isRestStatusAvailable = !loadingRestStatus && restStatus !== undefined;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingRestStatus(true);
    teamsService
      .fetchTeamsRestStatus(homeTeamId, awayTeamId, fixtureDate)
      .then((it) => setRestStatus(it))
      .catch(() => setRestStatus(undefined))
      .finally(() => setLoadingRestStatus(false));
  }, [homeTeamId, awayTeamId, fixtureDate]);

  return { restStatus, loadingRestStatus, isRestStatusAvailable, fixtureDate };
};
