import { RankingService } from "../implementation";
import { LeagueRankingPlayer } from "../../types";
import { mockLeagueRankingPlayers } from "../../mock-data";

export const rankingService: RankingService = {
  fetchRanking: async (
    key: string,
    leagueId: number
  ): Promise<LeagueRankingPlayer[]> => {
    console.log(key);
    console.log(leagueId);
    return Promise.resolve(mockLeagueRankingPlayers);
  },
};
