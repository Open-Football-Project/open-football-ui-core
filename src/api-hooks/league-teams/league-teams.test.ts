import { renderHook, waitFor } from "@testing-library/react";
import { useLeagueTeams } from "./league-teams";

import { vi, describe, it, beforeEach, expect } from "vitest";

import { leagueTeams } from "../../mock-data";

describe("useLeagueTeams", () => {
  const mockFetch = vi.fn();

  const mockApiService = {
    leagueService: {
      fetchLeagueTeams: mockFetch,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetch.mockResolvedValueOnce(leagueTeams);

    const { result } = renderHook(() => useLeagueTeams(mockApiService, 39));

    expect(result.current.loadingLeaguesTeams).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce(leagueTeams);

    const { result } = renderHook(() => useLeagueTeams(mockApiService, 39));

    await waitFor(() => expect(result.current.loadingLeaguesTeams).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(39);
    expect(result.current.leaguesTeams).toEqual(leagueTeams);
    expect(result.current.isLeaguesTeamsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useLeagueTeams(mockApiService, 39));

    await waitFor(() => expect(result.current.loadingLeaguesTeams).toBe(false));

    expect(result.current.isLeaguesTeamsAvailable).toBe(false);
  });

  it("should refetch when league IDs change", async () => {
    mockFetch.mockResolvedValue(leagueTeams);

    const { result, rerender } = renderHook(
      ({ leagueId }) => useLeagueTeams(mockApiService, leagueId),
      {
        initialProps: { leagueId: 1 },
      }
    );

    await waitFor(() =>
      expect(result.current.leaguesTeams).toEqual(leagueTeams)
    );

    rerender({ leagueId: 2 });

    await waitFor(() =>
      expect(result.current.isLeaguesTeamsAvailable).toBe(true)
    );

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
