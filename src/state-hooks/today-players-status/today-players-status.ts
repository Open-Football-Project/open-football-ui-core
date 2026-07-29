import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ApiService } from "../../api-service";
import { useTodayPlayers } from "../../api-hooks";

export const useTodayPlayersStatus = (apiService: ApiService, fixtureId?: string) => {
  const { todayPlayersFixtures, loadingTodayPlayers, isTodayPlayersAvailable } =
    useTodayPlayers(apiService);

  const receivedFixtureId = fixtureId ? Number(fixtureId) : undefined;

  const [selectedLeagueId, setSelectedLeagueId] = useState<number>();
  const [selectedFixtureId, setSelectedFixtureId] = useState<number>();

  const hasInitializedFromFixture = useRef(false);

  const leagues = useMemo(() => {
    const seen = new Map<number, string>();
    todayPlayersFixtures.forEach((fixture) => {
      if (!seen.has(fixture.leagueId)) seen.set(fixture.leagueId, fixture.leagueName);
    });
    return Array.from(seen, ([leagueId, leagueName]) => ({ leagueId, leagueName }));
  }, [todayPlayersFixtures]);

  const fixturesInLeague = useCallback(
    (leagueId: number) => todayPlayersFixtures.filter((fixture) => fixture.leagueId === leagueId),
    [todayPlayersFixtures]
  );

  const setSelectedLeagueAndFixtureFromRoute = useCallback(() => {
    const match = todayPlayersFixtures.find((fixture) => fixture.fixtureId === receivedFixtureId);
    if (!match) return false;

    setSelectedLeagueId(match.leagueId);
    setSelectedFixtureId(match.fixtureId);
    return true;
  }, [todayPlayersFixtures, receivedFixtureId]);

  const setDefaultLeagueAndFixture = useCallback(() => {
    const initialLeagueId = selectedLeagueId ?? todayPlayersFixtures[0]?.leagueId;
    if (initialLeagueId === undefined) return;
    setSelectedLeagueId(initialLeagueId);
    
    const fixtures = fixturesInLeague(initialLeagueId);
    
    if (!selectedFixtureId || !fixtures.some((fixture) => fixture.fixtureId === selectedFixtureId)) {
      setSelectedFixtureId(fixtures[0]?.fixtureId);
    }
  }, [todayPlayersFixtures, selectedLeagueId, selectedFixtureId, fixturesInLeague]);

  useEffect(() => {
    if (todayPlayersFixtures.length === 0) {
      setSelectedLeagueId(undefined);
      setSelectedFixtureId(undefined);
      hasInitializedFromFixture.current = false;
      return;
    }

    if (hasInitializedFromFixture.current) return;

    const resolvedFromRoute = receivedFixtureId ? setSelectedLeagueAndFixtureFromRoute() : false;
    hasInitializedFromFixture.current = true;

    if (!resolvedFromRoute) setDefaultLeagueAndFixture();
  }, [todayPlayersFixtures, receivedFixtureId, setSelectedLeagueAndFixtureFromRoute, setDefaultLeagueAndFixture]);

  useEffect(() => {
    if (selectedLeagueId === undefined) return;
    const fixtures = fixturesInLeague(selectedLeagueId);

    if (!selectedFixtureId || !fixtures.some((fixture) => fixture.fixtureId === selectedFixtureId)) {
      setSelectedFixtureId(fixtures[0]?.fixtureId);
    }
  }, [selectedLeagueId, selectedFixtureId, fixturesInLeague]);

  useEffect(() => {
    hasInitializedFromFixture.current = false;
  }, [fixtureId]);

  const fixturesInSelectedLeague =
    selectedLeagueId !== undefined ? fixturesInLeague(selectedLeagueId) : [];
  const selectedFixture = fixturesInSelectedLeague.find(
    (fixture) => fixture.fixtureId === selectedFixtureId
  );

  return {
    leagues,
    selectedLeagueId,
    setSelectedLeagueId,
    fixturesInSelectedLeague,
    selectedFixtureId,
    setSelectedFixtureId,
    selectedFixture,
    loadingTodayPlayers,
    isTodayPlayersAvailable,
  };
};
