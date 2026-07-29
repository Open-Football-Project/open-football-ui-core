import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { useCheckLiveOdds } from "./check-live-odds";

describe("useCheckLiveOdds", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    chartsService: {
      fetchOddsFixtures: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loadingLiveOdds=true", () => {
    fetchMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCheckLiveOdds(mockApiService, 42));

    expect(result.current.loadingLiveOdds).toBe(true);
  });

  it("should expose isLiveOddsAvailable=true when the fixture is in the odds fixtures list", async () => {
    fetchMock.mockResolvedValueOnce([
      { fixtureId: 42, homeTeamName: "Home FC", awayTeamName: "Away FC" },
    ]);

    const { result } = renderHook(() => useCheckLiveOdds(mockApiService, 42));

    await waitFor(() => {
      expect(result.current.loadingLiveOdds).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith();
    expect(result.current.isLiveOddsAvailable).toBe(true);
  });

  it("should expose isLiveOddsAvailable=false when the fixture is not in the odds fixtures list", async () => {
    fetchMock.mockResolvedValueOnce([
      { fixtureId: 99, homeTeamName: "Other FC", awayTeamName: "Another FC" },
    ]);

    const { result } = renderHook(() => useCheckLiveOdds(mockApiService, 42));

    await waitFor(() => {
      expect(result.current.loadingLiveOdds).toBe(false);
    });

    expect(result.current.isLiveOddsAvailable).toBe(false);
  });

  it("should expose isLiveOddsAvailable=false on API error", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useCheckLiveOdds(mockApiService, 42));

    await waitFor(() => {
      expect(result.current.loadingLiveOdds).toBe(false);
    });

    expect(result.current.isLiveOddsAvailable).toBe(false);
  });
});
