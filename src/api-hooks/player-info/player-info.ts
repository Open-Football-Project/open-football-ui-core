import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { PlayerMainInfo } from "../../types";

export const usePlayerInfo = (apiService: ApiService, playerId: number) => {
  const [playerInfo, setPlayerInfo] = useState<PlayerMainInfo | undefined>();

  const [loadingPlayerInfo, setLoadingPlayerInfo] = useState(true);

  const isPlayerInfoAvailable = !loadingPlayerInfo && playerInfo !== undefined;

  const { playerService } = apiService;

  useEffect(() => {
    setLoadingPlayerInfo(true);
    playerService
      .fetchPlayerInfo(playerId)
      .then((it) => setPlayerInfo(it))
      .catch(() => setPlayerInfo(undefined))
      .finally(() => setLoadingPlayerInfo(false));
  }, [playerId]);

  return {
    isPlayerInfoAvailable,
    playerInfo,
    loadingPlayerInfo,
  };
};
