import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";

export const useTopGuysAvailable = (apiService: ApiService, fixtureId: number) => {
  const [loadingTopGuysAvailable, setLoadingTopGuysAvailable] = useState(true);
  const [isTopGuysAvailable, setIsTopGuysAvailable] = useState(false);

  const { playerService } = apiService;

  useEffect(() => {
    setLoadingTopGuysAvailable(true);

    playerService
      .fetchTodayPlayersFixtureIds()
      .then((fixtureIds) => {
        setIsTopGuysAvailable(fixtureIds.includes(fixtureId));
      })
      .catch(() => setIsTopGuysAvailable(false))
      .finally(() => setLoadingTopGuysAvailable(false));
  }, [playerService, fixtureId]);

  return {
    isTopGuysAvailable,
    loadingTopGuysAvailable,
  };
};
