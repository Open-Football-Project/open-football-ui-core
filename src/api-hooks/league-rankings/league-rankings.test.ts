import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, expect, it } from "vitest";

import { mockLeagueRankingPlayers } from "../../mock-data";
import { useLeaguePlayerRankings } from "./league-rankings";
import { rankingKey } from "../../api-service";

describe("useLeaguePlayerRankings", () => {
  const mockFetchRanking = vi.fn();

  const mockApiService = {
    rankingService: {
      fetchRanking: mockFetchRanking,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchRanking.mockResolvedValue([]);
  });

  it("should start with all loading states = true", () => {
    const { result } = renderHook(() =>
      useLeaguePlayerRankings(mockApiService, 1234)
    );

    expect(result.current.loadingTopScorers).toBe(true);
    expect(result.current.loadingYellowCards).toBe(true);
    expect(result.current.loadingRedCards).toBe(true);
    expect(result.current.loadingAssists).toBe(true);
  });

  it("should fetch all rankings successfully and set results", async () => {
    mockFetchRanking.mockResolvedValue(mockLeagueRankingPlayers);

    const { result } = renderHook(() =>
      useLeaguePlayerRankings(mockApiService, 1234)
    );

    await waitFor(() => {
      expect(result.current.loadingTopScorers).toBe(false);
      expect(result.current.loadingYellowCards).toBe(false);
      expect(result.current.loadingRedCards).toBe(false);
      expect(result.current.loadingAssists).toBe(false);
    });

    expect(mockFetchRanking).toHaveBeenCalledTimes(4);
    expect(mockFetchRanking).toHaveBeenNthCalledWith(
      1,
      rankingKey.scorers,
      1234
    );
    expect(mockFetchRanking).toHaveBeenNthCalledWith(
      2,
      rankingKey.yellowCard,
      1234
    );
    expect(mockFetchRanking).toHaveBeenNthCalledWith(
      3,
      rankingKey.redCard,
      1234
    );
    expect(mockFetchRanking).toHaveBeenNthCalledWith(
      4,
      rankingKey.assists,
      1234
    );

    expect(result.current.topScorers).toEqual(mockLeagueRankingPlayers);
    expect(result.current.yellowCards).toEqual(mockLeagueRankingPlayers);
    expect(result.current.redCards).toEqual(mockLeagueRankingPlayers);
    expect(result.current.assists).toEqual(mockLeagueRankingPlayers);

    expect(result.current.isTopScorersAvailable).toBe(true);
    expect(result.current.isYellowCardsAvailable).toBe(true);
    expect(result.current.isRedCardsAvailable).toBe(true);
    expect(result.current.isAssistsAvailable).toBe(true);
  });

  it("should handle API errors gracefully", async () => {
    mockFetchRanking.mockRejectedValueOnce(new Error("network error"));
    mockFetchRanking.mockRejectedValueOnce(new Error("network error"));
    mockFetchRanking.mockRejectedValueOnce(new Error("network error"));
    mockFetchRanking.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useLeaguePlayerRankings(mockApiService, 999)
    );

    await waitFor(() => {
      expect(result.current.loadingTopScorers).toBe(false);
      expect(result.current.loadingYellowCards).toBe(false);
      expect(result.current.loadingRedCards).toBe(false);
      expect(result.current.loadingAssists).toBe(false);
    });

    expect(result.current.topScorers).toEqual([]);
    expect(result.current.yellowCards).toEqual([]);
    expect(result.current.redCards).toEqual([]);
    expect(result.current.assists).toEqual([]);

    expect(result.current.isTopScorersAvailable).toBe(false);
    expect(result.current.isYellowCardsAvailable).toBe(false);
    expect(result.current.isRedCardsAvailable).toBe(false);
    expect(result.current.isAssistsAvailable).toBe(false);
  });

  it("should refetch when leagueId changes", async () => {
    mockFetchRanking.mockResolvedValue(mockLeagueRankingPlayers);

    const { result, rerender } = renderHook(
      ({ leagueId }) => useLeaguePlayerRankings(mockApiService, leagueId),
      { initialProps: { leagueId: 1234 } }
    );

    await waitFor(() =>
      expect(result.current.topScorers).toEqual(mockLeagueRankingPlayers)
    );

    rerender({ leagueId: 5678 });

    await waitFor(() =>
      expect(result.current.topScorers).toEqual(mockLeagueRankingPlayers)
    );

    expect(mockFetchRanking).toHaveBeenCalledTimes(8);
  });
});
