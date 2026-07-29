import { renderHook, waitFor } from "@testing-library/react";
import { useMatches } from "./matches";
import { vi, describe, beforeEach, expect, it } from "vitest";

import { mockDayMatchesResponse } from "../../mock-data";

describe("useMatches", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    matchesService: {
      fetchMatches: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockDayMatchesResponse);

    const { result } = renderHook(() =>
      useMatches(mockApiService, "NOT_STARTED", 22)
    );

    expect(result.current.loadingMatches).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockDayMatchesResponse);

    const { result } = renderHook(() =>
      useMatches(mockApiService, "NOT_STARTED", 22)
    );

    await waitFor(() => {
      expect(result.current.loadingMatches).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.matches).toBeDefined();
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useMatches(mockApiService, "NOT_STARTED", 22)
    );

    await waitFor(() => {
      expect(result.current.loadingMatches).toBe(false);
    });

    expect(result.current.matches).toEqual([]);
  });

  it("should refetch when team date or time change", async () => {
    fetchMock.mockResolvedValue(mockDayMatchesResponse);

    const { result, rerender } = renderHook(
      ({ matchLocalISODate, timeRange }) =>
        useMatches(mockApiService, matchLocalISODate, timeRange),
      {
        initialProps: { matchLocalISODate: "23-12-2025", timeRange: 23 },
      }
    );

    await waitFor(() => {
      expect(result.current.loadingMatches).toBe(false);
    });

    rerender({ matchLocalISODate: "23-11-2025", timeRange: 22 });

    await waitFor(() => {
      expect(result.current.loadingMatches).toBeDefined();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
