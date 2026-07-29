import { renderHook, waitFor } from "@testing-library/react";
import { useGuessTheTeam } from "./guess-the-team";

import { vi, describe, beforeEach, it, expect } from "vitest";

import { mockGuessTheTeamGame } from "../../mock-data";

describe("useGuessTheTeam", () => {
  const mockFetch = vi.fn();

  const mockApiService = {
    gameService: {
      fetchGuessTheTeam: mockFetch,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetch.mockResolvedValueOnce(mockGuessTheTeamGame);

    const { result } = renderHook(() => useGuessTheTeam(mockApiService, 1));

    expect(result.current.loadingGuessTheTeam).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce(mockGuessTheTeamGame);

    const { result } = renderHook(() => useGuessTheTeam(mockApiService, 1));

    await waitFor(() => expect(result.current.loadingGuessTheTeam).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(1);
    expect(result.current.guessTheTeam).toEqual(mockGuessTheTeamGame);
    expect(result.current.isGuessTheTeamAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useGuessTheTeam(mockApiService, 5));

    await waitFor(() => expect(result.current.loadingGuessTheTeam).toBe(false));

    expect(result.current.guessTheTeam).toBeUndefined();
    expect(result.current.isGuessTheTeamAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetch.mockResolvedValue(mockGuessTheTeamGame);

    const { result, rerender } = renderHook(
      ({ leagueId }) => useGuessTheTeam(mockApiService, leagueId),
      {
        initialProps: { leagueId: 1 },
      }
    );

    await waitFor(() =>
      expect(result.current.isGuessTheTeamAvailable).toBe(true)
    );

    rerender({ leagueId: 9 });

    await waitFor(() =>
      expect(result.current.isGuessTheTeamAvailable).toBe(true)
    );

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
