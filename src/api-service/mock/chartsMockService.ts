import {
  BetMarketInfo,
  ChartIndicatorsMap,
  LiveChartableMatch,
} from "../../types";
import {
  mockLiveChartableMatches,
  mockActiveLeagueIds,
  mockFixtureChartsResponse,
  mockOddsChartableMatches,
  mockBetMarketGroups,
} from "../../mock-data";
import { ChartsService } from "../implementation";

export const chartsService: ChartsService = {
  fetchChartMatches: async (): Promise<LiveChartableMatch[]> => {
    return Promise.resolve(mockLiveChartableMatches);
  },

  fetchActiveLeagueIds: async (): Promise<number[]> => {
    return Promise.resolve(mockActiveLeagueIds);
  },

  fetchFixtureIndicators: async (): Promise<ChartIndicatorsMap> => {
    return Promise.resolve(mockFixtureChartsResponse.indicators);
  },

  fetchOddsFixtures: async (): Promise<LiveChartableMatch[]> => {
    return Promise.resolve(mockOddsChartableMatches);
  },

  fetchBetMarkets: async (): Promise<BetMarketInfo[][]> => {
    return Promise.resolve(mockBetMarketGroups);
  },
};
