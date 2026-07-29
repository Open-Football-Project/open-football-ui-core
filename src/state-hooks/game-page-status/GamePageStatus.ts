import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";

import {
  useGuessTheTeam,
  useLeagueTeams,
  useGuessThePlayer,
} from "../../api-hooks";

interface GamingLeague {
  title: string;
  id: string;
}

export const gamingLeagues: GamingLeague[] = [
  { title: "Champions Lg.", id: "2" },
  { title: "Europa Lg.", id: "3" },
  { title: "Libertadores", id: "13" },
  { title: "Club World Cup", id: "15" },
  { title: "World Cup", id: "1" },
  { title: "La Liga", id: "140" },
  { title: "Serie A", id: "135" },
  { title: "Liga Prof. Argentina", id: "128" },
  { title: "Premier Lg.", id: "39" },
  { title: "Bundesliga", id: "78" },
  { title: "Ligue 1", id: "61" },
];

export const GAME_TEAM = "TEAM_GAME";
export const GAME_PLAYER = "PLAYER_GAME";

export const useGamePageStatus = (apiService: ApiService) => {
  const [gameType, setGameType] = useState(GAME_TEAM);
  const [leagueId, setLeagueId] = useState(gamingLeagues[0].id);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);

  const {
    guessTheTeam,
    loadingGuessTheTeam,
    isGuessTheTeamAvailable,
    getNewGame: newTeamQuiz,
  } = useGuessTheTeam(apiService, Number(leagueId));

  const { leaguesTeams, loadingLeaguesTeams, isLeaguesTeamsAvailable } =
    useLeagueTeams(apiService, Number(leagueId));

  useEffect(() => {
    if (gameType === GAME_PLAYER && leaguesTeams.length > 0) {
      setTeamId(leaguesTeams[0].teamId.toString());
    }
  }, [leagueId, gameType, leaguesTeams]);

  const {
    guessThePlayer,
    loadingGuessThePlayer,
    isGuessThePlayerAvailable,
    getNewGame: newPlayerQuiz,
  } = useGuessThePlayer(apiService, teamId !== undefined ? Number(teamId) : -1);

  return {
    gameType,
    setGameType,
    leagueId,
    setLeagueId,
    loadingGuessTheTeam,
    isGuessTheTeamAvailable,
    guessTheTeam,
    newTeamQuiz,
    gamingLeagues,
    isLeaguesTeamsAvailable,
    leaguesTeams,
    loadingLeaguesTeams,
    teamId,
    setTeamId,
    guessThePlayer,
    loadingGuessThePlayer,
    isGuessThePlayerAvailable,
    newPlayerQuiz,
  };
};
