import { useEffect, useState } from "react";
import { ChartsSourceFactory, useChartsEvents } from "../../spacial-hooks";
import { sanitizeLiveChartPoints } from "../../utils";

export const useChartsPageStatus = (
  apiHost: string,
  useApiMock: number,
  fixtureId?: string,
  source?: ChartsSourceFactory,
) => {
  const chartsEvents = useChartsEvents(apiHost, useApiMock, source);

  const selectedFixtureId = fixtureId ? Number(fixtureId) : undefined;

  const getSelectedFixtureId = () => {
    if (selectedFixtureId) return selectedFixtureId;
    return chartsEvents.length > 0 ? chartsEvents[0].fixtureId : undefined;
  };

  const [effectiveFixtureId, setEffectiveFixtureId] = useState<number | undefined>(
    getSelectedFixtureId(),
  );

  useEffect(() => {
    if (
      chartsEvents.length > 0 &&
      (effectiveFixtureId === undefined ||
        !chartsEvents.some((e) => e.fixtureId === effectiveFixtureId))
    ) {
      setEffectiveFixtureId(chartsEvents[0].fixtureId);
    }
  }, [chartsEvents, effectiveFixtureId]);

  const selectedChartEvent = chartsEvents.find(
    (e) => e.fixtureId === effectiveFixtureId,
  );

  return {
    chartMatches: chartsEvents,
    effectiveFixtureId,
    setEffectiveFixtureId,
    loadingChartMatches: false,
    isChartNotAvailable: chartsEvents.length === 0,
    homeTeamName: selectedChartEvent?.homeTeamName,
    awayTeamName: selectedChartEvent?.awayTeamName,
    momentumPoints: sanitizeLiveChartPoints(selectedChartEvent?.indicators.momentum ?? []),
    controlPoints: sanitizeLiveChartPoints(selectedChartEvent?.indicators.control ?? []),
    goalThreatPoints: sanitizeLiveChartPoints(selectedChartEvent?.indicators.goal_threat ?? []),
  };
};
