import { useState, useEffect } from "react";
import { LeaguesGroups } from "../../types";
import { ApiService } from "../../api-service";

export const useAllLeagues = (apiService: ApiService) => {
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [leaguesGroups, setLeaguesGroups] = useState<LeaguesGroups | undefined>(
    undefined
  );

  const isAnyLeagueAvailable =
    !loadingLeagues &&
    leaguesGroups !== undefined &&
    (leaguesGroups.countryLeagues.length > 0 ||
      leaguesGroups.internationals.length > 0);

  const { leagueService } = apiService;

  useEffect(() => {
    setLoadingLeagues(true);

    leagueService
      .fetchLeaguesGroups()
      .then((data) => {
        setLeaguesGroups(data);
      })
      .catch(() => {
        setLeaguesGroups(undefined);
      })
      .finally(() => {
        setLoadingLeagues(false);
      });
  }, [leagueService]);

  return {
    leaguesGroups,
    isAnyLeagueAvailable,
    loadingLeagues,
  };
};
