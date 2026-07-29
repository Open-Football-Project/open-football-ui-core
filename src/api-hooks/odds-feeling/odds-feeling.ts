import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { OddsWinnerFeeling } from "../../types";

export const useOddsFeeling = (apiService: ApiService, fixtureId: number) => {
  const [oddsFeeling, setOddsFeeling] = useState<
    OddsWinnerFeeling | undefined
  >();
  const [loadingOddsFeeling, setLoadingOddsFeeling] = useState(true);

  const isOddsFeelingAvailable =
    !loadingOddsFeeling && oddsFeeling !== undefined;

  const { oddsService } = apiService;

  useEffect(() => {
    setLoadingOddsFeeling(true);
    oddsService
      .fetchOddWinnerFeeling(fixtureId)
      .then((it) => setOddsFeeling(it))
      .catch(() => setOddsFeeling(undefined))
      .finally(() => setLoadingOddsFeeling(false));
  }, [fixtureId]);

  return { oddsFeeling, loadingOddsFeeling, isOddsFeelingAvailable };
};
