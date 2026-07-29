import { renderHook, waitFor } from "@testing-library/react";
import { useGuessThePlayer } from "./guess-the-player";

import { vi, describe, beforeEach, it, expect } from "vitest";

import { mockGuessThePlayerGame } from "../../mock-data";

describe("useGuessThePlayer", () => {
  const mockFetch = vi.fn();

  const mockApiService = {
    gameService: {
      fetchGuessThePlayer: mockFetch,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetch.mockResolvedValueOnce(mockGuessThePlayerGame);

    const { result } = renderHook(() => useGuessThePlayer(mockApiService, 1));

    expect(result.current.loadingGuessThePlayer).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce(mockGuessThePlayerGame);

    const { result } = renderHook(() => useGuessThePlayer(mockApiService, 1));

    await waitFor(() =>
      expect(result.current.loadingGuessThePlayer).toBe(false)
    );

    expect(mockFetch).toHaveBeenCalledWith(1);
    expect(result.current.guessThePlayer).toEqual(mockGuessThePlayerGame);
    expect(result.current.isGuessThePlayerAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useGuessThePlayer(mockApiService, 5));

    await waitFor(() =>
      expect(result.current.loadingGuessThePlayer).toBe(false)
    );

    expect(result.current.guessThePlayer).toBeUndefined();
    expect(result.current.isGuessThePlayerAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetch.mockResolvedValue(mockGuessThePlayerGame);

    const { result, rerender } = renderHook(
      ({ teamId }) => useGuessThePlayer(mockApiService, teamId),
      {
        initialProps: { teamId: 1 },
      }
    );

    await waitFor(() =>
      expect(result.current.isGuessThePlayerAvailable).toBe(true)
    );

    rerender({ teamId: 9 });

    await waitFor(() =>
      expect(result.current.isGuessThePlayerAvailable).toBe(true)
    );

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
