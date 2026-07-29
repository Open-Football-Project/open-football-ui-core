import { GuessThePlayerGameData, GuessTheTeamGameData } from "../../../types";
import { getApiFetch } from "../../api-service";

export interface GameService {
  fetchGuessThePlayer: (teamId: number) => Promise<GuessThePlayerGameData>;
  fetchGuessTheTeam: (leagueId: number) => Promise<GuessTheTeamGameData>;
}

export const gameService: GameService = {
  fetchGuessThePlayer: async (
    teamId: number
  ): Promise<GuessThePlayerGameData> => {
    const response = await getApiFetch().get<GuessThePlayerGameData>(
      `/api/game/${teamId}/player`
    );
    return response.data;
  },

  fetchGuessTheTeam: async (
    leagueId: number
  ): Promise<GuessTheTeamGameData> => {
    const response = await getApiFetch().get<GuessTheTeamGameData>(
      `/api/game/${leagueId}/team`
    );
    return response.data;
  },
};
