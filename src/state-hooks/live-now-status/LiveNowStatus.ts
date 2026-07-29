import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { LiveLeagueMatches } from "../../types";
import { useLiveMatches } from "../../spacial-hooks";

export const useLiveNowStatus = (
  apiHost: string,
  apiMock: number,
  fixtureId?: string,
  source?: (url: string) => EventSource
) => {
  const matchesResponse = useLiveMatches(apiHost, apiMock, source);
  const matchId = fixtureId ? Number(fixtureId) : undefined;

  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>();
  const [leagues, setLeagues] = useState<LiveLeagueMatches[]>([]);

  const hasInitializedFromFixture = useRef(false);

  const countries = useMemo(
    () => Array.from(new Set(matchesResponse.map((it) => it.country))),
    [matchesResponse]
  );

  const leaguesInSelectedCountry = useCallback(
    (country: string) =>
      matchesResponse.find((it) => it.country === country)?.leagueMatches ?? [],
    [matchesResponse]
  );

  const setSelectedMatchCountryAndLeague = useCallback(() => {
    const leagueContainingMatch = matchesResponse
      .flatMap((c) =>
        c.leagueMatches.map((league) => ({
          country: c.country,
          league,
          match: league.matches.find((m) => m.id === matchId),
        }))
      )
      .find((x) => x.match);

    if (leagueContainingMatch) {
      const { country, league } = leagueContainingMatch;
      setSelectedCountry(country);
      setSelectedLeagueId(league.leagueId);
      setLeagues(leaguesInSelectedCountry(country));
    }
  }, [matchesResponse, matchId, leaguesInSelectedCountry]);

  const setDefaultCountryAndLeague = useCallback(() => {
    const initialCountry = selectedCountry ?? matchesResponse[0]?.country;
    if (!initialCountry) return;

    const leagues = leaguesInSelectedCountry(initialCountry);
    setSelectedCountry(initialCountry);
    setLeagues(leagues);

    if (
      !selectedLeagueId ||
      !leagues.some((l) => l.leagueId === selectedLeagueId)
    ) {
      setSelectedLeagueId(leagues[0]?.leagueId);
    }
  }, [
    matchesResponse,
    selectedCountry,
    selectedLeagueId,
    leaguesInSelectedCountry,
  ]);

  useEffect(() => {
    if (matchesResponse.length === 0) {
      setSelectedCountry(undefined);
      setSelectedLeagueId(undefined);
      setLeagues([]);
      hasInitializedFromFixture.current = false;
      return;
    }

    if (matchId && !hasInitializedFromFixture.current) {
      setSelectedMatchCountryAndLeague();
      hasInitializedFromFixture.current = true;
    } else if (!matchId && !hasInitializedFromFixture.current) {
      setDefaultCountryAndLeague();
      hasInitializedFromFixture.current = true;
    }
  }, [
    matchesResponse,
    matchId,
    setSelectedMatchCountryAndLeague,
    setDefaultCountryAndLeague,
  ]);

  useEffect(() => {
    if (!selectedCountry) return;
    const leaguesForCountry = leaguesInSelectedCountry(selectedCountry);
    setLeagues(leaguesForCountry);

    if (
      !selectedLeagueId ||
      !leaguesForCountry.some((l) => l.leagueId === selectedLeagueId)
    ) {
      setSelectedLeagueId(leaguesForCountry[0]?.leagueId);
    }
  }, [selectedCountry, leaguesInSelectedCountry, selectedLeagueId]);

  useEffect(() => {
    hasInitializedFromFixture.current = false;
  }, [fixtureId]);

  const selectedLeague = leagues.find(
    (league) => league.leagueId === selectedLeagueId
  );
  const selectedLeagueMatches = selectedLeague?.matches ?? [];

  return {
    selectedCountry,
    setSelectedCountry,
    selectedLeagueId,
    setSelectedLeagueId,
    countries,
    leagues,
    selectedLeague,
    selectedLeagueMatches,
  };
};
