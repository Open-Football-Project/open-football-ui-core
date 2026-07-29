import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { useChartableLiveLeague } from "./chartable-live-league";

describe("useChartableLiveLeague", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    chartsService: {
      fetchActiveLeagueIds: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loadingActiveLeagueIds=true", () => {
    fetchMock.mockResolvedValueOnce([39, 140]);

    const { result } = renderHook(() =>
      useChartableLiveLeague(mockApiService, 39)
    );

    expect(result.current.loadingActiveLeagueIds).toBe(true);
  });

  it("should expose isChartableLiveLeague=true when the league id is tracked", async () => {
    fetchMock.mockResolvedValueOnce([39, 140]);

    const { result } = renderHook(() =>
      useChartableLiveLeague(mockApiService, 39)
    );

    await waitFor(() => {
      expect(result.current.loadingActiveLeagueIds).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.isChartableLiveLeague).toBe(true);
  });

  it("should expose isChartableLiveLeague=false when the league id is not tracked", async () => {
    fetchMock.mockResolvedValueOnce([39, 140]);

    const { result } = renderHook(() =>
      useChartableLiveLeague(mockApiService, 9999)
    );

    await waitFor(() => {
      expect(result.current.loadingActiveLeagueIds).toBe(false);
    });

    expect(result.current.isChartableLiveLeague).toBe(false);
  });

  it("should expose isChartableLiveLeague=false when leagueId is undefined", async () => {
    fetchMock.mockResolvedValueOnce([39, 140]);

    const { result } = renderHook(() =>
      useChartableLiveLeague(mockApiService, undefined)
    );

    await waitFor(() => {
      expect(result.current.loadingActiveLeagueIds).toBe(false);
    });

    expect(result.current.isChartableLiveLeague).toBe(false);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useChartableLiveLeague(mockApiService, 39)
    );

    await waitFor(() => {
      expect(result.current.loadingActiveLeagueIds).toBe(false);
    });

    expect(result.current.isChartableLiveLeague).toBe(false);
  });
});
