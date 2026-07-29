import { useState, useEffect } from "react";
import { LiveChartableMatch } from "../../types";
import { ApiService } from "../../api-service";

export const useChartMatches = (apiService: ApiService) => {
  const [loadingChartMatches, setLoadingChartMatches] = useState(true);
  const [chartMatches, setChartMatches] = useState<LiveChartableMatch[]>([]);

  const isChartNotAvailable =
    loadingChartMatches === false && chartMatches.length === 0;

  const { chartsService } = apiService;

  useEffect(() => {
    setLoadingChartMatches(true);

    chartsService
      .fetchChartMatches()
      .then((data) => {
        setChartMatches(data);
      })
      .catch(() => {
        setChartMatches([]);
      })
      .finally(() => {
        setLoadingChartMatches(false);
      });
  }, [chartsService]);

  return {
    chartMatches,
    loadingChartMatches,
    isChartNotAvailable,
  };
};
