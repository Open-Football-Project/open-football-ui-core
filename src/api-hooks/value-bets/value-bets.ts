import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { ValueBetsResponse } from "../../types";

const emptyResponse: ValueBetsResponse = { markets: [] };

export const useValueBets = (apiService: ApiService, fixtureId: number) => {
  const [valueBets, setValueBets] = useState<ValueBetsResponse>(emptyResponse);
  const [loadingValueBets, setLoadingValueBets] = useState(true);
  
  const { oddsService } = apiService;

  const isValueBetsAvailable = !loadingValueBets && valueBets.markets.length > 0;

  useEffect(() => {
    setLoadingValueBets(true);

    oddsService
      .fetchValueBets(fixtureId)
      .then((res) => {
        setValueBets(res);
      })
      .catch(() => {
        setValueBets(emptyResponse);
      })
      .finally(() => setLoadingValueBets(false));
  }, [fixtureId]);

  return {
    loadingValueBets,
    valueBets,
    isValueBetsAvailable,
  };
};
