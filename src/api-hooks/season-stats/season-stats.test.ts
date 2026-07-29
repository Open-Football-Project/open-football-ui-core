import { renderHook, waitFor } from "@testing-library/react";
import { useSeasonStats } from "./season-stats";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { mockTeamsStatistics } from "../../mock-data";

describe("useH2hStats", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchSeasonStats: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockTeamsStatistics);

    const { result } = renderHook(() =>
      useSeasonStats(mockApiService, 1, 2, 3)
    );

    expect(result.current.loadingSeasonStats).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockTeamsStatistics);

    const { result } = renderHook(() =>
      useSeasonStats(mockApiService, 1, 2, 3)
    );

    await waitFor(() => {
      expect(result.current.loadingSeasonStats).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.isSeasonStatsAvailable).toBe(true);
    expect(result.current.seasonStats).toEqual(mockTeamsStatistics);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useSeasonStats(mockApiService, 5, 7, 3)
    );

    await waitFor(() => {
      expect(result.current.loadingSeasonStats).toBe(false);
    });

    expect(result.current.isSeasonStatsAvailable).toBe(false);
    expect(result.current.seasonStats).toBeUndefined();
  });

  it("should refetch when team or league IDs change", async () => {
    fetchMock.mockResolvedValue(mockTeamsStatistics);

    const { result, rerender } = renderHook(
      ({ homeId, awayId, leagueId }) =>
        useSeasonStats(mockApiService, homeId, awayId, leagueId),
      {
        initialProps: { homeId: 1, awayId: 2, leagueId: 3 },
      }
    );

    await waitFor(() => {
      expect(result.current.seasonStats).toEqual(mockTeamsStatistics);
    });

    rerender({ homeId: 9, awayId: 10, leagueId: 4 });

    await waitFor(() => {
      expect(result.current.seasonStats).toEqual(mockTeamsStatistics);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
