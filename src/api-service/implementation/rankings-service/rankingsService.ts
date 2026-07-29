import { getApiFetch } from "../../api-service";

import { LeagueRankingPlayer } from "../../../types";

export const rankingKey = {
  redCard: "RED_CARD",
  yellowCard: "YELLOW_CARD",
  scorers: "SCORERS",
  assists: "ASSISTS",
};

export interface RankingService {
  fetchRanking: (
    key: string,
    leagueId: number
  ) => Promise<LeagueRankingPlayer[]>;
}

export const rankingService: RankingService = {
  fetchRanking: async (
    key: string,
    leagueId: number
  ): Promise<LeagueRankingPlayer[]> => {
    const response = await getApiFetch().get<LeagueRankingPlayer[]>(
      `/api/ranking/league?key=${key}&leagueId=${leagueId}`
    );
    return response.data;
  },
};
