import { useEffect, useState } from "react";
import { ChartsOddsSourceFactory, useOddsFixturesEvents } from "../../spacial-hooks";

export const useCharteableOddsStatus = (
  apiHost: string,
  useApiMock: number,
  fixtureId?: string,
  source?: ChartsOddsSourceFactory
) => {
  const oddsMatches = useOddsFixturesEvents(apiHost, useApiMock, source);

  const selectedFixtureId = fixtureId ? Number(fixtureId) : undefined;

  const getSelectedFixtureId = () => {
    if (selectedFixtureId) return selectedFixtureId;
    return oddsMatches.length > 0 ? oddsMatches[0].fixtureId : undefined;
  };

  const [effectiveFixtureId, setEffectiveFixtureId] = useState<
    number | undefined
  >(getSelectedFixtureId());

  const [oddsEventReceivedAt, setOddsEventReceivedAt] = useState<number>(
    Date.now()
  );

  useEffect(() => {
    setOddsEventReceivedAt(Date.now());

    if (
      oddsMatches.length > 0 &&
      (effectiveFixtureId === undefined ||
        !oddsMatches.some((match) => match.fixtureId === effectiveFixtureId))
    ) {
      setEffectiveFixtureId(oddsMatches[0].fixtureId);
    }
  }, [oddsMatches]);

  const selectedMatch = oddsMatches.find(
    (match) => match.fixtureId === effectiveFixtureId
  );

  return {
    oddsMatches,
    effectiveFixtureId,
    setEffectiveFixtureId,
    isOddsNotAvailable: oddsMatches.length === 0,
    homeTeamName: selectedMatch?.homeTeamName,
    awayTeamName: selectedMatch?.awayTeamName,
    oddsEventReceivedAt,
  };
};
