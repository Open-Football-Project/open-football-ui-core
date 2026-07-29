import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { mockLiveChartableMatches } from "../../mock-data";

import { useChartMatches } from "./chart-matches";

describe("useChartMatches", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    chartsService: {
      fetchChartMatches: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockLiveChartableMatches);

    const { result } = renderHook(() => useChartMatches(mockApiService));

    expect(result.current.loadingChartMatches).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValueOnce(mockLiveChartableMatches);

    const { result } = renderHook(() => useChartMatches(mockApiService));

    await waitFor(() => {
      expect(result.current.loadingChartMatches).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.chartMatches).toEqual(mockLiveChartableMatches);
  });

  it("should set isChartNotAvailable to true", async () => {
    fetchMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useChartMatches(mockApiService));

    await waitFor(() => {
      expect(result.current.loadingChartMatches).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.isChartNotAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useChartMatches(mockApiService));

    await waitFor(() => {
      expect(result.current.loadingChartMatches).toBe(false);
    });

    expect(result.current.chartMatches).toEqual([]);
  });
});
