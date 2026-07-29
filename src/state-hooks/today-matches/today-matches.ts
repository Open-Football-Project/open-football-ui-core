import { useMemo } from "react";
import { ApiService } from "../../api-service";
import { useMatches } from "../../api-hooks";
import { getLocalISODate } from "../../utils";
import { DayMatches } from "../../types";

export const useTodayMatches = (
  apiService: ApiService,
  allowedLeagueIds: Map<number, number>,
) => {
  const currentHour = new Date().getHours();
  const { loadingMatches, matches } = useMatches(
    apiService,
    getLocalISODate(),
    currentHour,
  );

  const leagueMatches: DayMatches[] = useMemo(() => {
    return matches
      .flatMap((country) => country.matchesByLeague)
      .filter((league) => allowedLeagueIds.has(league.leagueId))
      .sort(
        (a, b) =>
          (allowedLeagueIds.get(b.leagueId) ?? 0) -
          (allowedLeagueIds.get(a.leagueId) ?? 0),
      );
  }, [matches, allowedLeagueIds]);

  const isLeagueMatchesAvailable = !loadingMatches && leagueMatches.length > 0;

  return {
    loadingMatches,
    leagueMatches,
    isLeagueMatchesAvailable,
  };
};
