import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { LeagueBasicInfo } from "../../types";

export const useTeamLeagues = (apiService: ApiService, teamId: number) => {
  const [teamLeagues, setTeamLeagues] = useState<LeagueBasicInfo[]>([]);
  const [loadingTeamLeagues, setLoadingTeamLeagues] = useState(true);

  const isTeamLeaguesAvailable = !loadingTeamLeagues && teamLeagues.length > 0;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingTeamLeagues(true);
    teamsService
      .fetchTeamLeagues(teamId)
      .then((it) => setTeamLeagues(it))
      .catch(() => setTeamLeagues([]))
      .finally(() => setLoadingTeamLeagues(false));
  }, [teamId]);

  return {
    teamLeagues,
    loadingTeamLeagues,
    isTeamLeaguesAvailable,
  };
};
