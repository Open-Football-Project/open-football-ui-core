import { renderHook, waitFor } from "@testing-library/react";
import { useMatchStats } from "./match-stats";
import { vi, describe, beforeEach, expect, it } from "vitest";

import { mockTeamsStatistics } from "../../mock-data";

describe("useMatchStats", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    matchesService: {
      fetchMatchStats: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockTeamsStatistics);

    const { result } = renderHook(() =>
      useMatchStats(mockApiService, 2323, 19)
    );

    expect(result.current.loadingMatchStats).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockTeamsStatistics);

    const { result } = renderHook(() =>
      useMatchStats(mockApiService, 2323, 11)
    );

    await waitFor(() => {
      expect(result.current.loadingMatchStats).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.matchStats).toEqual(mockTeamsStatistics);
    expect(result.current.isStatsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useMatchStats(mockApiService, 5544, 11)
    );

    await waitFor(() => {
      expect(result.current.loadingMatchStats).toBe(false);
    });

    expect(result.current.isStatsAvailable).toBe(false);
  });

  it("should refetch when minutes change", async () => {
    fetchMock.mockResolvedValue(mockTeamsStatistics);

    const { result, rerender } = renderHook(
      ({ fixtureId, minutes }) =>
        useMatchStats(mockApiService, fixtureId, minutes),
      {
        initialProps: { fixtureId: 23223, minutes: 11 },
      }
    );

    await waitFor(() => {
      expect(result.current.matchStats).toEqual(mockTeamsStatistics);
    });

    rerender({ fixtureId: 5544, minutes: 15 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
