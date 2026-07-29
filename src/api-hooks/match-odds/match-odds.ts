import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { Bet } from "../../types";

export const useMatchOdds = (apiService: ApiService, fixtureId: number) => {
  const [odds, setOdds] = useState<Bet[]>([]);
  const [loadingOdds, setLoadingOdds] = useState(true);
  const { oddsService } = apiService;

  const isOddsAvailable = !loadingOdds && odds.length > 0;

  useEffect(() => {
    setLoadingOdds(true);

    oddsService
      .fetchOdds(fixtureId)
      .then((res) => {
        setOdds(res);
      })
      .catch(() => {
        setOdds([]);
      })
      .finally(() => setLoadingOdds(false));
  }, [fixtureId]);

  return {
    loadingOdds,
    odds,
    isOddsAvailable,
  };
};
