import { useEffect, useState } from "react";
import { ApiService, ChartsService } from "../../api-service";

const fetchHasIndicatorPoints = (
  chartsService: ChartsService,
  fixtureId: number
): Promise<boolean> =>
  chartsService
    .fetchFixtureIndicators(fixtureId)
    .then((indicators) =>
      Object.values(indicators).some((points) => points.length > 0)
    )
    .catch(() => false);

const fetchIsLiveOddsAvailable = (
  chartsService: ChartsService,
  fixtureId: number
): Promise<boolean> =>
  chartsService
    .fetchOddsFixtures()
    .then((fixtures) =>
      fixtures.some((fixture) => fixture.fixtureId === fixtureId)
    )
    .catch(() => false);

export const useCharteableMatchNow = (
  apiService: ApiService,
  fixtureId: number
) => {
  const [loadingCharteableMatchNow, setLoadingCharteableMatchNow] =
    useState(true);
  const [isCharteableMatchNow, setIsCharteableMatchNow] = useState(false);

  const { chartsService } = apiService;

  useEffect(() => {
    setLoadingCharteableMatchNow(true);

    Promise.all([
      fetchHasIndicatorPoints(chartsService, fixtureId),
      fetchIsLiveOddsAvailable(chartsService, fixtureId),
    ])
      .then(([hasPoints, isLiveOdds]) => {
        setIsCharteableMatchNow(hasPoints || isLiveOdds);
      })
      .finally(() => {
        setLoadingCharteableMatchNow(false);
      });
  }, [chartsService, fixtureId]);

  return {
    isCharteableMatchNow,
    loadingCharteableMatchNow,
  };
};
