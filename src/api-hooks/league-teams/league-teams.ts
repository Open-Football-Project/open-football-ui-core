import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { BasicTeamInfo } from "../../types";

export const useLeagueTeams = (apiService: ApiService, leagueId: number) => {
  const [leaguesTeams, setLeagueTeams] = useState<BasicTeamInfo[]>([]);
  const [loadingLeaguesTeams, setLoadingLeaguesTeams] = useState(true);

  const isLeaguesTeamsAvailable =
    !loadingLeaguesTeams && leaguesTeams.length > 0;

  const { leagueService } = apiService;

  useEffect(() => {
    setLoadingLeaguesTeams(true);
    leagueService
      .fetchLeagueTeams(leagueId)
      .then((it) => setLeagueTeams(it))
      .catch(() => setLeagueTeams([]))
      .finally(() => setLoadingLeaguesTeams(false));
  }, [leagueId]);

  return {
    leaguesTeams,
    loadingLeaguesTeams,
    isLeaguesTeamsAvailable,
  };
};
