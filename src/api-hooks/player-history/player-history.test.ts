import { renderHook, waitFor } from "@testing-library/react";
import { usePlayerHistory } from "./player-history";

import { vi, describe, expect, beforeEach, it } from "vitest";

import { mockPlayerHistory } from "../../mock-data";

describe("usePlayerHistory", () => {
  const mockFetchPlayerHistory = vi.fn();

  const mockApiService = {
    playerService: {
      fetchPlayerHistory: mockFetchPlayerHistory,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchPlayerHistory.mockResolvedValueOnce(mockPlayerHistory);

    const { result } = renderHook(() => usePlayerHistory(mockApiService, 1342));

    expect(result.current.loadingPlayerHistory).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchPlayerHistory.mockResolvedValueOnce(mockPlayerHistory);

    const { result } = renderHook(() => usePlayerHistory(mockApiService, 1342));

    await waitFor(() =>
      expect(result.current.loadingPlayerHistory).toBe(false)
    );

    expect(mockFetchPlayerHistory).toHaveBeenCalledWith(1342);
    expect(result.current.playerHistory).toEqual(mockPlayerHistory);
    expect(result.current.isPlayerHistoryAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchPlayerHistory.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePlayerHistory(mockApiService, 5));

    await waitFor(() =>
      expect(result.current.loadingPlayerHistory).toBe(false)
    );

    expect(result.current.playerHistory).toBeUndefined();
    expect(result.current.isPlayerHistoryAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetchPlayerHistory.mockResolvedValue(mockPlayerHistory);

    const { result, rerender } = renderHook(
      ({ playerId }) => usePlayerHistory(mockApiService, playerId),
      {
        initialProps: { playerId: 142 },
      }
    );

    await waitFor(() =>
      expect(result.current.playerHistory).toEqual(mockPlayerHistory)
    );

    rerender({ playerId: 910 });

    await waitFor(() =>
      expect(result.current.isPlayerHistoryAvailable).toBe(true)
    );

    expect(mockFetchPlayerHistory).toHaveBeenCalledTimes(2);
  });
});
