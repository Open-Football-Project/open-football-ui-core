import {
  BetMarketInfo,
  ChartIndicatorsMap,
  LiveChartableMatch,
} from "../../../types";
import { getApiFetch } from "../../api-service";

export interface ChartsService {
  fetchChartMatches: () => Promise<LiveChartableMatch[]>;
  fetchActiveLeagueIds: () => Promise<number[]>;
  fetchFixtureIndicators: (fixtureId: number) => Promise<ChartIndicatorsMap>;
  fetchOddsFixtures: () => Promise<LiveChartableMatch[]>;
  fetchBetMarkets: (fixtureId: number) => Promise<BetMarketInfo[][]>;
}

export const chartsService: ChartsService = {
  fetchChartMatches: async (): Promise<LiveChartableMatch[]> => {
    const response = await getApiFetch().get<LiveChartableMatch[]>(
      `/api/charts/matches`
    );
    return response.data;
  },

  fetchActiveLeagueIds: async (): Promise<number[]> => {
    const response = await getApiFetch().get<number[]>(`/api/charts/leagues`);
    return response.data;
  },

  fetchFixtureIndicators: async (
    fixtureId: number
  ): Promise<ChartIndicatorsMap> => {
    const response = await getApiFetch().get<ChartIndicatorsMap>(
      `/api/charts/all/${fixtureId}`
    );
    return response.data;
  },

  fetchOddsFixtures: async (): Promise<LiveChartableMatch[]> => {
    const response = await getApiFetch().get<LiveChartableMatch[]>(
      `/api/charts/odds/fixtures`
    );
    return response.data;
  },

  fetchBetMarkets: async (fixtureId: number): Promise<BetMarketInfo[][]> => {
    const response = await getApiFetch().get<BetMarketInfo[][]>(
      `/api/charts/markets/${fixtureId}`
    );
    return response.data;
  },
};
