import { getApiFetch } from "../../api-service";
import { FixtureTodayPlayers, PlayerHistory, PlayerMainInfo } from "../../../types";

export interface PlayerService {
  fetchPlayerHistory: (playerId: number) => Promise<PlayerHistory>;
  fetchPlayerInfo: (playerId: number) => Promise<PlayerMainInfo>;
  fetchTodayPlayers: () => Promise<FixtureTodayPlayers[]>;
  fetchTodayPlayersFixtureIds: () => Promise<number[]>;
}

export const playerService: PlayerService = {
  fetchPlayerHistory: async (playerId: number): Promise<PlayerHistory> => {
    const response = await getApiFetch().get<PlayerHistory>(
      `/api/player/history/${playerId}`
    );
    return response.data;
  },

  fetchPlayerInfo: async (playerId: number): Promise<PlayerMainInfo> => {
    const response = await getApiFetch().get<PlayerMainInfo>(
      `/api/player/${playerId}`
    );
    return response.data;
  },

  fetchTodayPlayers: async (): Promise<FixtureTodayPlayers[]> => {
    const response = await getApiFetch().get<FixtureTodayPlayers[]>(
      "/api/player/today-players"
    );
    return response.data;
  },

  fetchTodayPlayersFixtureIds: async (): Promise<number[]> => {
    const response = await getApiFetch().get<number[]>(
      "/api/player/today-players/fixtures"
    );
    return response.data;
  },
};
