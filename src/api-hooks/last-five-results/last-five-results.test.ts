import { renderHook, waitFor } from "@testing-library/react";
import { useLastFiveResults } from "./last-five-results";
import { vi, describe, beforeEach, expect, it } from "vitest";
import { lastFiveData } from "../../mock-data";

describe("useLastFiveResults", () => {
  const mockFetchLastFiveMatches = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchLastFiveMatches: mockFetchLastFiveMatches,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchLastFiveMatches.mockResolvedValueOnce(lastFiveData);

    const { result } = renderHook(() =>
      useLastFiveResults(mockApiService, 1, 2)
    );

    expect(result.current.loadingLastFiveResults).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchLastFiveMatches.mockResolvedValueOnce(lastFiveData);

    const { result } = renderHook(() =>
      useLastFiveResults(mockApiService, 1, 2)
    );

    await waitFor(() =>
      expect(result.current.loadingLastFiveResults).toBe(false)
    );

    expect(mockFetchLastFiveMatches).toHaveBeenCalledWith(1, 2);
    expect(result.current.lastFiveResults).toEqual(lastFiveData);
    expect(result.current.isLastFiveResultsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchLastFiveMatches.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useLastFiveResults(mockApiService, 5, 7)
    );

    await waitFor(() =>
      expect(result.current.loadingLastFiveResults).toBe(false)
    );

    expect(result.current.lastFiveResults).toBeUndefined();
    expect(result.current.isLastFiveResultsAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetchLastFiveMatches.mockResolvedValue(lastFiveData);

    const { result, rerender } = renderHook(
      ({ homeId, awayId }) =>
        useLastFiveResults(mockApiService, homeId, awayId),
      {
        initialProps: { homeId: 1, awayId: 2 },
      }
    );

    await waitFor(() =>
      expect(result.current.lastFiveResults).toEqual(lastFiveData)
    );

    rerender({ homeId: 9, awayId: 10 });

    await waitFor(() =>
      expect(result.current.isLastFiveResultsAvailable).toBe(true)
    );

    expect(mockFetchLastFiveMatches).toHaveBeenNthCalledWith(1, 1, 2);
    expect(mockFetchLastFiveMatches).toHaveBeenNthCalledWith(2, 9, 10);
  });
});
