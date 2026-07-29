import { useEffect, useState } from "react";

import { GuessThePlayerGameData } from "../../types";
import { ApiService } from "../../api-service";

export const useGuessThePlayer = (apiService: ApiService, teamId: number) => {
  const [guessThePlayer, setGuessThePlayer] = useState<
    GuessThePlayerGameData | undefined
  >();
  const [loadingGuessThePlayer, setLoadingGuessThePlayer] = useState(true);

  const [newGame, setNewGame] = useState(false);

  const isGuessThePlayerAvailable =
    !loadingGuessThePlayer &&
    guessThePlayer !== undefined &&
    guessThePlayer.isAvailable === true;

  const { gameService } = apiService;

  const getNewGame = () => {
    setNewGame((prev) => !prev);
  };

  useEffect(() => {
    setLoadingGuessThePlayer(true);
    gameService
      .fetchGuessThePlayer(teamId)
      .then((it) => setGuessThePlayer(it))
      .catch(() => setGuessThePlayer(undefined))
      .finally(() => setLoadingGuessThePlayer(false));
  }, [teamId, newGame]);

  return {
    guessThePlayer,
    loadingGuessThePlayer,
    isGuessThePlayerAvailable,
    getNewGame,
  };
};
