import { renderHook, act } from "@testing-library/react";
import { vi, Mock, describe, it, expect, beforeEach } from "vitest";
import { useLiveMatchesStatus } from "./live-matches-status";
import { LiveMatch } from "../../types";

vi.mock("../../api-hooks", async () => {
  return {
    useMatchOdds: vi.fn(),
    useMatchStats: vi.fn(),
    useMatchLineups: vi.fn(),
    useAvailablePolls: vi.fn(),
  };
});

const mockUseMatchStats = useMatchStats as Mock;
const mockUseMatchLineups = useMatchLineups as Mock;
const mockUseAvailablePolls = useAvailablePolls as Mock;
const mockUseMatchOdds = useMatchOdds as Mock;

const mockApiService = {} as any;

import {
  useAvailablePolls,
  useMatchLineups,
  useMatchOdds,
  useMatchStats,
} from "../../api-hooks";

const makeMatch = (id: number, overrides: Partial<LiveMatch> = {}): LiveMatch =>
  ({
    id,
    homeTeamName: `Home ${id}`,
    awayTeamName: `Away ${id}`,
    elapsedTime: 45,
    extraTime: 2,
    ...overrides,
  } as LiveMatch);

describe("useLiveMatchesStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMatchStats.mockImplementation((matchId, totalMinutes) => ({
      isStatsAvailable: true,
      matchStats: { matchId, totalMinutes },
    }));

    mockUseMatchLineups.mockImplementation((matchId) => ({
      isLineupsAvailable: true,
      matchLineups: { teamA: { id: matchId }, teamB: { id: matchId } },
    }));

    mockUseAvailablePolls.mockImplementation(() => ({
      availablePolls: [
        {
          pollKey: "match-winner",
          pollTitle: "Match Winner?",
          pollVotingOptions: [],
        },
      ],
      isAvailablePollsOn: true,
    }));

    mockUseMatchOdds.mockImplementation(() => ({
      loadingOdds: false,
      odds: [{ type: "win", value: 1.5 }],
      isOddsAvailable: true,
    }));
  });

  it("initializes with first match selected", () => {
    const matches = [makeMatch(1), makeMatch(2)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    expect(result.current.totalMatches).toBe(2);
    expect(result.current.selectedMatchId).toBe(1);
    expect(mockUseMatchStats).toHaveBeenCalledWith(mockApiService, 1, 47);
  });

  it("resets selectedMatchId when selected match is removed", () => {
    const matches = [makeMatch(1), makeMatch(2)];
    const { result, rerender } = renderHook(
      ({ data }) => useLiveMatchesStatus(mockApiService, data),
      { initialProps: { data: matches } }
    );

    expect(result.current.selectedMatchId).toBe(1);

    rerender({ data: [makeMatch(2)] });

    expect(result.current.selectedMatchId).toBe(2);
  });

  it("returns live stats values from useLiveStats", () => {
    mockUseMatchStats.mockReturnValueOnce({
      isStatsAvailable: true,
      matchStats: { shots: 5 },
    });

    const matches = [makeMatch(1)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    expect(result.current.isStatsAvailable).toBe(true);
    expect(result.current.matchStats).toEqual({ shots: 5 });
  });

  it("returns live lineup values from useLiveLineups", () => {
    mockUseMatchLineups.mockReturnValueOnce({
      isLineupsAvailable: true,
      matchLineups: { teamA: {}, teamB: {} },
    });

    const matches = [makeMatch(1)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    expect(result.current.isLineupsAvailable).toBe(true);
    expect(result.current.matchLineups).toBeDefined();
  });

  it("allows manually changing selected match", () => {
    const matches = [makeMatch(1), makeMatch(2)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    act(() => {
      result.current.setSelectedMatchId(2);
    });

    expect(result.current.selectedMatchId).toBe(2);
  });

  it("returns available polls when available", () => {
    const matches = [makeMatch(1)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    expect(result.current.isAvailablePollsOn).toBe(true);
    expect(result.current.availablePolls).toHaveLength(1);
    expect(result.current.availablePolls[0].pollKey).toBe("match-winner");
    expect(mockUseAvailablePolls).toHaveBeenCalledWith(mockApiService, 1);
  });

  it("set optional passed fixture id", () => {
    const matches = [makeMatch(2331)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches, 2331)
    );

    expect(result.current.selectedMatchId).toBe(2331);
    expect(mockUseAvailablePolls).toHaveBeenCalledWith(mockApiService, 2331);
  });

  it("returns match odds values from useMatchOdds", () => {
    mockUseMatchOdds.mockReturnValueOnce({
      loadingOdds: true,
      odds: [{ type: "draw", value: 3.2 }],
      isOddsAvailable: true,
    });

    const matches = [makeMatch(1)];
    const { result } = renderHook(() =>
      useLiveMatchesStatus(mockApiService, matches)
    );

    expect(result.current.isOddsAvailable).toBe(true);
    expect(result.current.loadingOdds).toBe(true);
    expect(result.current.odds).toEqual([{ type: "draw", value: 3.2 }]);
    expect(mockUseMatchOdds).toHaveBeenCalledWith(mockApiService, 1);
  });
});
