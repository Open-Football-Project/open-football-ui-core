import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { FixtureTodayPlayers } from "../../types";

export const useTodayPlayers = (apiService: ApiService) => {
  const [todayPlayersFixtures, setTodayPlayersFixtures] = useState<FixtureTodayPlayers[]>([]);

  const [loadingTodayPlayers, setLoadingTodayPlayers] = useState(true);

  const isTodayPlayersAvailable =
    !loadingTodayPlayers &&
    todayPlayersFixtures.length > 0;

  const { playerService } = apiService;

  useEffect(() => {
    setLoadingTodayPlayers(true);
    playerService
      .fetchTodayPlayers()
      .then((it) => setTodayPlayersFixtures(it))
      .catch(() => setTodayPlayersFixtures([]))
      .finally(() => setLoadingTodayPlayers(false));
  }, [playerService]);

  return {
    isTodayPlayersAvailable,
    todayPlayersFixtures,
    loadingTodayPlayers,
  };
};
