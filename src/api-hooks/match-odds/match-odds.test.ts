import { renderHook, waitFor } from "@testing-library/react";
import { useMatchOdds } from "./match-odds";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { bets } from "../../mock-data";

describe("useMatchOdds", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    oddsService: {
      fetchOdds: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(bets);

    const { result } = renderHook(() => useMatchOdds(mockApiService, 2323));

    expect(result.current.loadingOdds).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(bets);

    const { result } = renderHook(() => useMatchOdds(mockApiService, 2323));

    await waitFor(() => {
      expect(result.current.loadingOdds).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.odds).toEqual(bets);
    expect(result.current.isOddsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useMatchOdds(mockApiService, 5544));

    await waitFor(() => {
      expect(result.current.loadingOdds).toBe(false);
    });

    expect(result.current.odds).toEqual([]);
    expect(result.current.isOddsAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    fetchMock.mockResolvedValue(bets);

    const { result, rerender } = renderHook(
      ({ matchId }) => useMatchOdds(mockApiService, matchId),
      {
        initialProps: { matchId: 2323 },
      }
    );

    await waitFor(() => {
      expect(result.current.odds).toEqual(bets);
    });

    rerender({ matchId: 5544 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
