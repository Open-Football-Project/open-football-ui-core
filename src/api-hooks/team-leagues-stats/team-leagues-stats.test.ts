import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { useTeamLeaguesStats } from "./team-leagues-stats";
import { mockTeamPositionsAndPoints } from "../../mock-data";

describe("useTeamLeaguesStats", () => {
  const mockFetchTeamLeagueStats = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchTeamLeagueStats: mockFetchTeamLeagueStats,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with loading=true", () => {
    mockFetchTeamLeagueStats.mockResolvedValueOnce(mockTeamPositionsAndPoints);

    const { result } = renderHook(() =>
      useTeamLeaguesStats(mockApiService, 1, 2, 10)
    );

    expect(result.current.loadingRanksAndPoints).toBe(true);
  });

  it("sets ranksAndPoints after successful fetch", async () => {
    mockFetchTeamLeagueStats.mockResolvedValueOnce(mockTeamPositionsAndPoints);

    const { result } = renderHook(() =>
      useTeamLeaguesStats(mockApiService, 1, 2, 10)
    );

    await waitFor(() =>
      expect(result.current.loadingRanksAndPoints).toBe(false)
    );

    expect(result.current.ranksAndPoints).toEqual(mockTeamPositionsAndPoints);
    expect(result.current.isRankingAndPointsAvailable).toBe(true);
    expect(mockFetchTeamLeagueStats).toHaveBeenCalledWith(1, 2, 10);
  });

  it("handles API error gracefully", async () => {
    mockFetchTeamLeagueStats.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useTeamLeaguesStats(mockApiService, 5, 7, 20)
    );

    await waitFor(() =>
      expect(result.current.loadingRanksAndPoints).toBe(false)
    );

    expect(result.current.isRankingAndPointsAvailable).toBe(false);
    expect(result.current.ranksAndPoints).toBeUndefined();
  });

  it("refetches when dependencies change", async () => {
    mockFetchTeamLeagueStats.mockResolvedValue(mockTeamPositionsAndPoints);

    const { result, rerender } = renderHook(
      ({ homeId, awayId, league }) =>
        useTeamLeaguesStats(mockApiService, homeId, awayId, league),
      {
        initialProps: { homeId: 1, awayId: 2, league: 10 },
      }
    );

    await waitFor(() =>
      expect(result.current.ranksAndPoints).toEqual(mockTeamPositionsAndPoints)
    );

    rerender({ homeId: 9, awayId: 10, league: 20 });

    await waitFor(() =>
      expect(result.current.ranksAndPoints).toEqual(mockTeamPositionsAndPoints)
    );

    expect(mockFetchTeamLeagueStats).toHaveBeenCalledTimes(2);
  });
});
