import {
  BetMarketInfo,
  BetOddsPoint,
  FixtureChartsResponse,
  LiveChartableMatch,
  LiveChartPoint,
} from "../types";

export const mockMomentumPoints: LiveChartPoint[] = [
  { minute: 2, value: 0, capturedAt: "2026-06-24T19:02:06.730257039Z" },
  { minute: 4, value: 0, capturedAt: "2026-06-24T19:05:06.642340383Z" },
  { minute: 8, value: 100, capturedAt: "2026-06-24T19:08:06.714221719Z" },
  { minute: 10, value: 100, capturedAt: "2026-06-24T19:11:06.644207198Z" },
  { minute: 14, value: 75, capturedAt: "2026-06-24T19:14:06.642291468Z" },
  { minute: 16, value: 75, capturedAt: "2026-06-24T19:17:06.727438140Z" },
  { minute: 20, value: 75, capturedAt: "2026-06-24T19:20:06.642872794Z" },
  { minute: 23, value: 33, capturedAt: "2026-06-24T19:23:06.718336874Z" },
  { minute: 26, value: 33, capturedAt: "2026-06-24T19:26:06.643005886Z" },
  { minute: 29, value: 100, capturedAt: "2026-06-24T19:29:06.740119971Z" },
  { minute: 32, value: 100, capturedAt: "2026-06-24T19:32:06.645153559Z" },
  { minute: 35, value: 100, capturedAt: "2026-06-24T19:35:06.719512437Z" },
  { minute: 38, value: 100, capturedAt: "2026-06-24T19:38:06.642155209Z" },
  { minute: 40, value: 100, capturedAt: "2026-06-24T19:41:06.751119642Z" },
  { minute: 43, value: 100, capturedAt: "2026-06-24T19:44:06.642110406Z" },
  { minute: 45, value: 33, capturedAt: "2026-06-24T19:47:06.724530839Z" },
  { minute: 45, value: 17, capturedAt: "2026-06-24T19:50:06.640623011Z" },
  { minute: 45, value: -6, capturedAt: "2026-06-24T19:53:06.705465340Z" },
  { minute: 45, value: -38, capturedAt: "2026-06-24T19:56:06.646087457Z" },
  { minute: 45, value: -38, capturedAt: "2026-06-24T19:59:06.717082783Z" },
  { minute: 45, value: -60, capturedAt: "2026-06-24T20:02:06.644984508Z" },
  { minute: 45, value: -60, capturedAt: "2026-06-24T20:05:06.791131857Z" },
  { minute: 46, value: 0, capturedAt: "2026-06-24T20:08:06.642270442Z" },
  { minute: 48, value: -100, capturedAt: "2026-06-24T20:11:06.711800599Z" },
  { minute: 52, value: -100, capturedAt: "2026-06-24T20:14:06.645773051Z" },
  { minute: 54, value: -100, capturedAt: "2026-06-24T20:17:06.735379356Z" },
  { minute: 58, value: -100, capturedAt: "2026-06-24T20:20:06.642296566Z" },
  { minute: 60, value: -100, capturedAt: "2026-06-24T20:23:06.642232419Z" },
  { minute: 64, value: -100, capturedAt: "2026-06-24T20:26:06.683242919Z" },
  { minute: 66, value: -100, capturedAt: "2026-06-24T20:29:06.642294223Z" },
  { minute: 70, value: -100, capturedAt: "2026-06-24T20:32:06.677495340Z" },
  { minute: 72, value: -100, capturedAt: "2026-06-24T20:35:06.758813978Z" },
  { minute: 75, value: -100, capturedAt: "2026-06-24T20:38:06.642064751Z" },
  { minute: 79, value: -100, capturedAt: "2026-06-24T20:41:06.681541486Z" },
  { minute: 82, value: -33, capturedAt: "2026-06-24T20:44:06.644529497Z" },
  { minute: 84, value: 71, capturedAt: "2026-06-24T20:47:06.679219575Z" },
  { minute: 88, value: 100, capturedAt: "2026-06-24T20:50:06.642397181Z" },
  { minute: 90, value: 85, capturedAt: "2026-06-24T20:53:06.676014285Z" },
  { minute: 90, value: 85, capturedAt: "2026-06-24T20:56:06.673980619Z" },
  { minute: 90, value: 83, capturedAt: "2026-06-24T20:59:06.640948660Z" },
];

export const mockFixtureChartsResponse: FixtureChartsResponse = {
  fixtureId: 1539009,
  homeTeamName: "Bosnia & Herzegovina",
  awayTeamName: "Qatar",
  indicators: {
    momentum: mockMomentumPoints,
  },
};

export const mockAllChartFixtures: FixtureChartsResponse[] = [
  mockFixtureChartsResponse,
  {
    fixtureId: 102,
    homeTeamName: "Manchester City",
    awayTeamName: "Chelsea",
    indicators: {
      momentum: [{ minute: 20, value: 5, capturedAt: "2026-06-24T15:20:00Z" }],
    },
  },
];

export const mockLiveChartableMatches: LiveChartableMatch[] = [
  { fixtureId: 101, homeTeamName: "Manchester United", awayTeamName: "Liverpool" },
  { fixtureId: 102, homeTeamName: "Manchester City", awayTeamName: "Chelsea" },
];

export const mockActiveLeagueIds: number[] = [39, 128, 140];

export const mockOddsChartableMatches: LiveChartableMatch[] = [
  { fixtureId: 1539007, homeTeamName: "Netherlands", awayTeamName: "Sweden" },
];

const fulltimeResultHistory: Record<string, BetOddsPoint[]> = {
  Home: [
    { minute: 23, odd: "1.758", capturedAt: "2026-06-22T10:00:00Z" },
    { minute: 28, odd: "1.702", capturedAt: "2026-06-22T10:05:00Z" },
  ],
  Draw: [
    { minute: 23, odd: "3.5", capturedAt: "2026-06-22T10:00:00Z" },
    { minute: 28, odd: "3.6", capturedAt: "2026-06-22T10:05:00Z" },
  ],
  Away: [
    { minute: 23, odd: "4.5", capturedAt: "2026-06-22T10:00:00Z" },
    { minute: 28, odd: "4.33", capturedAt: "2026-06-22T10:05:00Z" },
  ],
};

const matchCornersHistory: Record<string, BetOddsPoint[]> = {
  "Over 10.5": [{ minute: 23, odd: "2.0", capturedAt: "2026-06-22T10:00:00Z" }],
  "Under 10.5": [{ minute: 23, odd: "1.8", capturedAt: "2026-06-22T10:00:00Z" }],
};

const totalCornersHistory: Record<string, BetOddsPoint[]> = {
  "Over 9.5": [{ minute: 23, odd: "1.9", capturedAt: "2026-06-22T10:00:00Z" }],
  "Under 9.5": [{ minute: 23, odd: "1.85", capturedAt: "2026-06-22T10:00:00Z" }],
};

const overUnderLineHistory: Record<string, BetOddsPoint[]> = {
  "Over 2.5": [{ minute: 23, odd: "1.8", capturedAt: "2026-06-22T10:00:00Z" }],
  "Under 2.5": [{ minute: 23, odd: "1.95", capturedAt: "2026-06-22T10:00:00Z" }],
};

export const mockBetMarketGroups: BetMarketInfo[][] = [
  [
    { id: 59, name: "fulltime_result", history: fulltimeResultHistory },
    { id: 20, name: "match_corners", history: matchCornersHistory },
    { id: 37, name: "total_corners", history: totalCornersHistory },
  ],
  [{ id: 36, name: "over_under_line", history: overUnderLineHistory }],
];
