import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { PlayerHistory } from "../../types";

export const usePlayerHistory = (apiService: ApiService, playerId: number) => {
  const [playerHistory, setPlayerHistory] = useState<
    PlayerHistory | undefined
  >();

  const [loadingPlayerHistory, setLoadingPlayerHistory] = useState(true);

  const isPlayerHistoryAvailable =
    !loadingPlayerHistory && playerHistory !== undefined;

  const { playerService } = apiService;

  useEffect(() => {
    setLoadingPlayerHistory(true);
    playerService
      .fetchPlayerHistory(playerId)
      .then((it) => setPlayerHistory(it))
      .catch(() => setPlayerHistory(undefined))
      .finally(() => setLoadingPlayerHistory(false));
  }, [playerId]);

  return {
    isPlayerHistoryAvailable,
    playerHistory,
    loadingPlayerHistory,
  };
};
