
export interface LiveChartPoint {
  minute: number;
  value: number;
  capturedAt: string;
}

export interface BetOddsPoint {
  minute: number;
  odd: string;
  capturedAt: string;
}

export interface LiveChartableMatch {
  fixtureId: number;
  homeTeamName: string;
  awayTeamName: string;
}

export type ChartIndicatorsMap = Record<string, LiveChartPoint[]>;

export interface FixtureChartsResponse {
  fixtureId: number;
  homeTeamName: string;
  awayTeamName: string;
  indicators: ChartIndicatorsMap;
}

export interface BetMarketInfo {
  id: number;
  name: string;
  history: Record<string, BetOddsPoint[]>;
}
