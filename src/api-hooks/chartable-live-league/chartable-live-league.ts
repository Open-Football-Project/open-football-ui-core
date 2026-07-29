import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";

export const useChartableLiveLeague = (
  apiService: ApiService,
  leagueId?: number
) => {
  const [loadingActiveLeagueIds, setLoadingActiveLeagueIds] = useState(true);
  const [activeLeagueIds, setActiveLeagueIds] = useState<number[]>([]);

  const { chartsService } = apiService;

  useEffect(() => {
    setLoadingActiveLeagueIds(true);

    chartsService
      .fetchActiveLeagueIds()
      .then((data) => {
        setActiveLeagueIds(data);
      })
      .catch(() => {
        setActiveLeagueIds([]);
      })
      .finally(() => {
        setLoadingActiveLeagueIds(false);
      });
  }, [chartsService]);

  const isChartableLiveLeague =
    leagueId !== undefined && activeLeagueIds.includes(leagueId);

  return {
    isChartableLiveLeague,
    loadingActiveLeagueIds,
  };
};
