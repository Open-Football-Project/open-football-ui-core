import { useEffect, useState } from "react";
import { TFunction } from "i18next";
import { ApiService } from "../../api-service";
import { TeamPlayer, TeamDetails } from "../../types";
import { useTeamLeagues } from "../team-leagues/team-leagues";
import { useTeamLinks } from "../../spacial-hooks/team-links/team-links";

export const useTeamDetail = (
  apiService: ApiService,
  teamId: number,
  t: TFunction<"translation", undefined>
) => {
  const [teamDetails, setTeamDetails] = useState<TeamDetails | undefined>(
    undefined
  );
  const [teamPlayers, setTeamPlayers] = useState<TeamPlayer[]>([]);

  const [loadingTeamDetails, setLoadingTeamDetails] = useState(true);

  const isTeamPlayersAvailable = !loadingTeamDetails && teamPlayers.length > 0;
  const isTeamDetailsAvailable =
    !loadingTeamDetails && teamDetails !== undefined;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingTeamDetails(true);

    Promise.all([
      teamsService.fetchTeamDetails(teamId),
      teamsService.fetchTeamSquad(teamId),
    ])
      .then(([teamDetails, playerList]) => {
        setTeamDetails(teamDetails);
        setTeamPlayers(playerList);
      })
      .catch(() => {
        setTeamDetails(undefined);
        setTeamPlayers([]);
      })
      .finally(() => setLoadingTeamDetails(false));
  }, [teamId]);

  const { isTeamLeaguesAvailable, teamLeagues, loadingTeamLeagues } =
    useTeamLeagues(apiService, Number(teamId));

  const { teamlinks, canDisplayTeamPlayerGame } = useTeamLinks(
    teamId,
    loadingTeamDetails,
    isTeamLeaguesAvailable,
    teamLeagues,
    t
  );

  return {
    loadingTeamDetails,
    teamDetails,
    teamPlayers,
    isTeamDetailsAvailable,
    isTeamPlayersAvailable,
    isTeamLeaguesAvailable,
    teamLeagues,
    loadingTeamLeagues,
    teamlinks,
    canDisplayTeamPlayerGame,
  };
};
