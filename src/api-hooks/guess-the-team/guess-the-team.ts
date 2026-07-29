import { useEffect, useState } from "react";

import { GuessTheTeamGameData } from "../../types";
import { ApiService } from "../../api-service";

export const useGuessTheTeam = (apiService: ApiService, leagueId: number) => {
  const [guessTheTeam, setGuessTheTeam] = useState<
    GuessTheTeamGameData | undefined
  >();
  const [loadingGuessTheTeam, setLoadingGuessTheTeam] = useState(true);

  const [newGame, setNewGame] = useState(false);

  const isGuessTheTeamAvailable =
    !loadingGuessTheTeam &&
    guessTheTeam !== undefined &&
    guessTheTeam.isAvailable === true;

  const { gameService } = apiService;

  const getNewGame = () => {
    setNewGame((prev) => !prev);
  };

  useEffect(() => {
    setLoadingGuessTheTeam(true);
    gameService
      .fetchGuessTheTeam(leagueId)
      .then((it) => setGuessTheTeam(it))
      .catch(() => setGuessTheTeam(undefined))
      .finally(() => setLoadingGuessTheTeam(false));
  }, [leagueId, newGame]);

  return {
    guessTheTeam,
    loadingGuessTheTeam,
    isGuessTheTeamAvailable,
    getNewGame,
  };
};
