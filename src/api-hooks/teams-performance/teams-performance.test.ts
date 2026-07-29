import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { useTeamsScorePerformance } from "./teams-performance";
import { teamScorePerformance } from "../../mock-data";

describe("useRestStatus", () => {
  const mockFetchTeamsScorePerformance = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchTeamsScorePerformance: mockFetchTeamsScorePerformance,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with loading=true", () => {
    mockFetchTeamsScorePerformance.mockResolvedValueOnce(teamScorePerformance);

    const { result } = renderHook(() =>
      useTeamsScorePerformance(mockApiService, 1, 2, 3)
    );

    expect(result.current.loadingTeamsPerformance).toBe(true);
  });

  it("sets Score performance after successful fetch", async () => {
    mockFetchTeamsScorePerformance.mockResolvedValueOnce(teamScorePerformance);

    const { result } = renderHook(() =>
      useTeamsScorePerformance(mockApiService, 1, 2, 3)
    );

    await waitFor(() =>
      expect(result.current.loadingTeamsPerformance).toBe(false)
    );

    expect(result.current.teamsPerformance).toEqual(teamScorePerformance);

    expect(mockFetchTeamsScorePerformance).toHaveBeenCalledWith(1, 2, 3);
  });

  it("handles API error gracefully", async () => {
    mockFetchTeamsScorePerformance.mockRejectedValueOnce(
      new Error("network error")
    );

    const { result } = renderHook(() =>
      useTeamsScorePerformance(mockApiService, 5, 7, 3)
    );

    await waitFor(() =>
      expect(result.current.loadingTeamsPerformance).toBe(false)
    );

    expect(result.current.teamsPerformance).toBeUndefined();
  });

  it("refetches when dependencies change", async () => {
    mockFetchTeamsScorePerformance.mockResolvedValue(teamScorePerformance);

    const { result, rerender } = renderHook(
      ({ homeId, awayId, leagueId }) =>
        useTeamsScorePerformance(mockApiService, homeId, awayId, leagueId),
      {
        initialProps: { homeId: 1, awayId: 2, leagueId: 5 },
      }
    );

    await waitFor(() =>
      expect(result.current.teamsPerformance).toEqual(teamScorePerformance)
    );

    rerender({ homeId: 9, awayId: 10, leagueId: 8 });

    await waitFor(() =>
      expect(result.current.teamsPerformance).toEqual(teamScorePerformance)
    );

    expect(mockFetchTeamsScorePerformance).toHaveBeenCalledTimes(2);
  });
});
