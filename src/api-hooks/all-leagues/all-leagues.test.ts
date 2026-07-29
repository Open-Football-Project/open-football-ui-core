import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { mockLeaguesGroups } from "../../mock-data";

import { useAllLeagues } from "./all-leagues";

describe("useAllLeagues", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    leagueService: {
      fetchLeaguesGroups: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockLeaguesGroups);

    const { result } = renderHook(() => useAllLeagues(mockApiService));

    expect(result.current.loadingLeagues).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValueOnce(mockLeaguesGroups);

    const { result } = renderHook(() => useAllLeagues(mockApiService));

    await waitFor(() => {
      expect(result.current.loadingLeagues).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.leaguesGroups).toBeDefined();
    expect(result.current.isAnyLeagueAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useAllLeagues(mockApiService));

    await waitFor(() => {
      expect(result.current.loadingLeagues).toBe(false);
    });

    expect(result.current.leaguesGroups).toBeUndefined();
    expect(result.current.isAnyLeagueAvailable).toBe(false);
  });
});
