import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { chartsService } from "./chartsService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("chartsService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("fetchChartMatches calls correct endpoint and returns the matches list", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await chartsService.fetchChartMatches();

    expect(mockGet).toHaveBeenCalledWith("/api/charts/matches");
    expect(result).toEqual([]);
  });

  it("fetchActiveLeagueIds calls correct endpoint and returns the league ids list", async () => {
    mockGet.mockResolvedValueOnce({ data: [39, 140] });

    const result = await chartsService.fetchActiveLeagueIds();

    expect(mockGet).toHaveBeenCalledWith("/api/charts/leagues");
    expect(result).toEqual([39, 140]);
  });

  it("fetchFixtureIndicators calls correct endpoint and returns the indicators map", async () => {
    mockGet.mockResolvedValueOnce({ data: { momentum: [] } });

    const result = await chartsService.fetchFixtureIndicators(42);

    expect(mockGet).toHaveBeenCalledWith("/api/charts/all/42");
    expect(result).toEqual({ momentum: [] });
  });

  it("fetchOddsFixtures calls correct endpoint and returns the odds-tracked fixtures list", async () => {
    const matches = [{ fixtureId: 1539007, homeTeamName: "Netherlands", awayTeamName: "Sweden" }];
    mockGet.mockResolvedValueOnce({ data: matches });

    const result = await chartsService.fetchOddsFixtures();

    expect(mockGet).toHaveBeenCalledWith("/api/charts/odds/fixtures");
    expect(result).toEqual(matches);
  });

  it("fetchBetMarkets calls correct endpoint and returns the chunked bet markets", async () => {
    const groups = [[{ id: 59, name: "fulltime_result", history: {} }]];
    mockGet.mockResolvedValueOnce({ data: groups });

    const result = await chartsService.fetchBetMarkets(1539007);

    expect(mockGet).toHaveBeenCalledWith("/api/charts/markets/1539007");
    expect(result).toEqual(groups);
  });
});
