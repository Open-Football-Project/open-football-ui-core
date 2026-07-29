import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { useMatchDetail } from "./match-details";
import { mockMatchDetails } from "../../mock-data";

vi.mock("../match-stats/match-stats", () => ({
  useMatchStats: vi.fn(),
}));

vi.mock("../match-lineups/match-lineups", () => ({
  useMatchLineups: vi.fn(),
}));

vi.mock("../match-odds/match-odds", () => ({
  useMatchOdds: vi.fn(),
}));

vi.mock("../match-events/match-events", () => ({
  useMatchEvents: vi.fn(),
}));

import { useMatchStats } from "../match-stats/match-stats";
import { useMatchLineups } from "../match-lineups/match-lineups";
import { useMatchOdds } from "../match-odds/match-odds";
import { useMatchEvents } from "../match-events/match-events";

describe("useMatchDetail", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    matchesService: {
      fetchMatchDetails: fetchMock,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    (useMatchStats as any).mockReturnValue({
      isStatsAvailable: false,
      matchStats: {},
    });

    (useMatchLineups as any).mockReturnValue({
      isLineupsAvailable: false,
      matchLineups: {},
    });

    (useMatchOdds as any).mockReturnValue({
      loadingOdds: false,
      odds: [],
      isOddsAvailable: false,
    });

    (useMatchEvents as any).mockReturnValue({
      loadingEvents: false,
      events: [],
      isEventsAvailable: false,
    });
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockMatchDetails);

    const { result } = renderHook(() => useMatchDetail(mockApiService, 1234));

    expect(result.current.loadingMatchDetail).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockMatchDetails);

    const { result } = renderHook(() => useMatchDetail(mockApiService, 1232));

    await waitFor(() => {
      expect(result.current.loadingMatchDetail).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.matchDetail).toBeDefined();
    expect(result.current.isMatcheDetailAvalable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useMatchDetail(mockApiService, 5457));

    await waitFor(() => {
      expect(result.current.loadingMatchDetail).toBe(false);
    });

    expect(result.current.matchDetail).toBeUndefined();
    expect(result.current.isMatcheDetailAvalable).toBe(false);
  });

  it("should refetch when matchId changes", async () => {
    fetchMock.mockResolvedValue(mockMatchDetails);

    const { result, rerender } = renderHook(
      ({ matchId }) => useMatchDetail(mockApiService, matchId),
      { initialProps: { matchId: 134 } }
    );

    await waitFor(() => {
      expect(result.current.isMatcheDetailAvalable).toBe(true);
    });

    rerender({ matchId: 4567 });

    await waitFor(() => {
      expect(result.current.isMatcheDetailAvalable).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should expose stats, lineups, odds, and events from hooks", async () => {
    (useMatchStats as any).mockReturnValue({
      isStatsAvailable: true,
      matchStats: { shots: 5 },
    });
    (useMatchLineups as any).mockReturnValue({
      isLineupsAvailable: true,
      matchLineups: { home: [], away: [] },
    });
    (useMatchOdds as any).mockReturnValue({
      loadingOdds: false,
      odds: [{ id: 1 }],
      isOddsAvailable: true,
    });
    (useMatchEvents as any).mockReturnValue({
      loadingEvents: false,
      events: [{ type: "goal" }],
      isEventsAvailable: true,
    });

    fetchMock.mockResolvedValue(mockMatchDetails);

    const { result } = renderHook(() => useMatchDetail(mockApiService, 999));

    await waitFor(() => {
      expect(result.current.loadingMatchDetail).toBe(false);
    });

    expect(result.current.isStatsAvailable).toBe(true);
    expect(result.current.isLineupsAvailable).toBe(true);
    expect(result.current.isOddsAvailable).toBe(true);
    expect(result.current.isEventsAvailable).toBe(true);

    expect(result.current.matchStats).toEqual({ shots: 5 });
    expect(result.current.matchLineups).toEqual({ home: [], away: [] });
    expect(result.current.odds).toEqual([{ id: 1 }]);
    expect(result.current.events).toEqual([{ type: "goal" }]);
  });
});
