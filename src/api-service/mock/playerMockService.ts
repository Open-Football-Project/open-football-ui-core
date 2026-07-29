import { PlayerService } from "../implementation";
import { FixtureTodayPlayers, PlayerHistory, PlayerMainInfo } from "../../types";
import {
  mockPlayerHistory,
  playerMainInfoMock,
  todayPlayersFixtureIdsMock,
  todayPlayersMock,
} from "../../mock-data";

export const playerService: PlayerService = {
  fetchPlayerHistory: async (playerId: number): Promise<PlayerHistory> => {
    console.log(playerId);
    return Promise.resolve(mockPlayerHistory);
  },
  fetchPlayerInfo: async (playerId: number): Promise<PlayerMainInfo> => {
    console.log(playerId);
    return Promise.resolve(playerMainInfoMock);
  },
  fetchTodayPlayers: async (): Promise<FixtureTodayPlayers[]> => {
    return Promise.resolve(todayPlayersMock);
  },
  fetchTodayPlayersFixtureIds: async (): Promise<number[]> => {
    return Promise.resolve(todayPlayersFixtureIdsMock);
  },
};
