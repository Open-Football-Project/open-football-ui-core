import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { useTeamLeagues } from "./team-leagues";

import { teamLeagues } from "../../mock-data";

describe("useTeamLeagues", () => {
  const mockFetch = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchTeamLeagues: mockFetch,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetch.mockResolvedValueOnce(teamLeagues);

    const { result } = renderHook(() => useTeamLeagues(mockApiService, 1));

    expect(result.current.loadingTeamLeagues).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetch.mockResolvedValueOnce(teamLeagues);

    const { result } = renderHook(() => useTeamLeagues(mockApiService, 1));

    await waitFor(() => expect(result.current.loadingTeamLeagues).toBe(false));

    expect(mockFetch).toHaveBeenCalledWith(1);
    expect(result.current.teamLeagues).toEqual(teamLeagues);
    expect(result.current.isTeamLeaguesAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useTeamLeagues(mockApiService, 5));

    await waitFor(() => expect(result.current.loadingTeamLeagues).toBe(false));

    expect(result.current.isTeamLeaguesAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetch.mockResolvedValue(teamLeagues);

    const { result, rerender } = renderHook(
      ({ teamId }) => useTeamLeagues(mockApiService, teamId),
      {
        initialProps: { teamId: 1 },
      }
    );

    await waitFor(() =>
      expect(result.current.teamLeagues).toEqual(teamLeagues)
    );

    rerender({ teamId: 2 });

    await waitFor(() =>
      expect(result.current.isTeamLeaguesAvailable).toBe(true)
    );

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
