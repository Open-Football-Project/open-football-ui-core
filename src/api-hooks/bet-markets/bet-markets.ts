import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { BetMarketInfo } from "../../types";

export const useBetMarkets = (
  apiService: ApiService,
  fixtureId?: number,
  refreshTrigger?: unknown
) => {
  const [betMarketGroups, setBetMarketGroups] = useState<BetMarketInfo[][]>(
    []
  );
  const [loadingBetMarkets, setLoadingBetMarkets] = useState(false);

  const { chartsService } = apiService;

  const isBetMarketsAvailable = !loadingBetMarkets && betMarketGroups.length > 0
  
  useEffect(() => {
    if (fixtureId === undefined) {
      setBetMarketGroups([]);
      return;
    }

    setLoadingBetMarkets(true);

    chartsService
      .fetchBetMarkets(fixtureId)
      .then(setBetMarketGroups)
      .catch(() => {
        setBetMarketGroups([]);
      })
      .finally(() => {
        setLoadingBetMarkets(false);
      });
  }, [chartsService, fixtureId, refreshTrigger]);

  return {
    betMarketGroups,
    loadingBetMarkets,
    isBetMarketsAvailable,
  };
};
