import { GameService } from "../implementation";
import { GuessThePlayerGameData, GuessTheTeamGameData } from "../../types";
import { mockGuessThePlayerGame, mockGuessTheTeamGame } from "../../mock-data";

export const gameService: GameService = {
  fetchGuessThePlayer: async (
    teamId: number
  ): Promise<GuessThePlayerGameData> => {
    console.log(teamId);
    return Promise.resolve(mockGuessThePlayerGame);
  },
  fetchGuessTheTeam: async (
    leagueId: number
  ): Promise<GuessTheTeamGameData> => {
    console.log(leagueId);
    return Promise.resolve(mockGuessTheTeamGame);
  },
};
