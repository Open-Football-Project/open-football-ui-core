import { renderHook, waitFor } from "@testing-library/react";
import { useOddsFeeling } from "./odds-feeling";
import { vi, describe, expect, beforeEach, it } from "vitest";

import { oddsWinnerFeeling } from "../../mock-data";

describe("useLastFiveResults", () => {
  const mockFetchOddsWinnerFeeling = vi.fn();

  const mockApiService = {
    oddsService: {
      fetchOddWinnerFeeling: mockFetchOddsWinnerFeeling,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchOddsWinnerFeeling.mockResolvedValueOnce(oddsWinnerFeeling);

    const { result } = renderHook(() => useOddsFeeling(mockApiService, 1234));

    expect(result.current.loadingOddsFeeling).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchOddsWinnerFeeling.mockResolvedValueOnce(oddsWinnerFeeling);

    const { result } = renderHook(() => useOddsFeeling(mockApiService, 1234));

    await waitFor(() => expect(result.current.loadingOddsFeeling).toBe(false));

    expect(mockFetchOddsWinnerFeeling).toHaveBeenCalledWith(1234);
    expect(result.current.oddsFeeling).toEqual(oddsWinnerFeeling);
    expect(result.current.isOddsFeelingAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchOddsWinnerFeeling.mockRejectedValueOnce(
      new Error("network error")
    );

    const { result } = renderHook(() => useOddsFeeling(mockApiService, 1234));

    await waitFor(() => expect(result.current.loadingOddsFeeling).toBe(false));

    expect(result.current.oddsFeeling).toBeUndefined();
    expect(result.current.isOddsFeelingAvailable).toBe(false);
  });

  it("should refetch when fixture id changes", async () => {
    mockFetchOddsWinnerFeeling.mockResolvedValue(oddsWinnerFeeling);

    const { result, rerender } = renderHook(
      ({ fixtureId }) => useOddsFeeling(mockApiService, fixtureId),
      {
        initialProps: { fixtureId: 1234 },
      }
    );

    await waitFor(() =>
      expect(result.current.oddsFeeling).toEqual(oddsWinnerFeeling)
    );

    rerender({ fixtureId: 5678 });

    await waitFor(() =>
      expect(result.current.oddsFeeling).toEqual(oddsWinnerFeeling)
    );

    expect(mockFetchOddsWinnerFeeling).toHaveBeenCalledTimes(2);
  });
});
