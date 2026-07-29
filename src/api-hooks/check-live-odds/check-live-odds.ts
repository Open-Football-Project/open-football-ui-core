import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";

export const useCheckLiveOdds = (apiService: ApiService, fixtureId: number) => {
  const [loadingLiveOdds, setLoadingLiveOdds] = useState(true);
  const [isLiveOddsAvailable, setIsLiveOddsAvailable] = useState(false);

  const { chartsService } = apiService;

  useEffect(() => {
    setLoadingLiveOdds(true);

    chartsService
      .fetchOddsFixtures()
      .then((fixtures) => {
        setIsLiveOddsAvailable(
          fixtures.some((fixture) => fixture.fixtureId === fixtureId)
        );
      })
      .catch(() => {
        setIsLiveOddsAvailable(false);
      })
      .finally(() => {
        setLoadingLiveOdds(false);
      });
  }, [chartsService, fixtureId]);

  return {
    isLiveOddsAvailable,
    loadingLiveOdds,
  };
};
