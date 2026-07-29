import { renderHook, waitFor } from "@testing-library/react";
import { useTodayPlayers } from "./today-players";

import { vi, describe, beforeEach, it, expect } from "vitest";

import { todayPlayersMock } from "../../mock-data";

describe("useTodayPlayers", () => {
  const mockFetchTodayPlayers = vi.fn();

  const mockApiService = {
    playerService: {
      fetchTodayPlayers: mockFetchTodayPlayers,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchTodayPlayers.mockResolvedValueOnce(todayPlayersMock);

    const { result } = renderHook(() => useTodayPlayers(mockApiService));

    expect(result.current.loadingTodayPlayers).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchTodayPlayers.mockResolvedValueOnce(todayPlayersMock);

    const { result } = renderHook(() => useTodayPlayers(mockApiService));

    await waitFor(() => expect(result.current.loadingTodayPlayers).toBe(false));

    expect(mockFetchTodayPlayers).toHaveBeenCalled();
    expect(result.current.todayPlayersFixtures).toEqual(todayPlayersMock);
    expect(result.current.isTodayPlayersAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchTodayPlayers.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useTodayPlayers(mockApiService));

    await waitFor(() => expect(result.current.loadingTodayPlayers).toBe(false));

    expect(result.current.todayPlayersFixtures).toEqual([]);
    expect(result.current.isTodayPlayersAvailable).toBe(false);
  });

  it("should expose isTodayPlayersAvailable=false when the fetch resolves to an empty list", async () => {
    mockFetchTodayPlayers.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTodayPlayers(mockApiService));

    await waitFor(() => expect(result.current.loadingTodayPlayers).toBe(false));

    expect(result.current.isTodayPlayersAvailable).toBe(false);
  });
});
