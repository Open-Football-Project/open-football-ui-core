import { renderHook, waitFor } from "@testing-library/react";
import { useValueBets } from "./value-bets";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { valueBetsResponse } from "../../mock-data";

describe("useValueBets", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    oddsService: {
      fetchValueBets: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(valueBetsResponse);

    const { result } = renderHook(() => useValueBets(mockApiService, 2323));

    expect(result.current.loadingValueBets).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(valueBetsResponse);

    const { result } = renderHook(() => useValueBets(mockApiService, 2323));

    await waitFor(() => {
      expect(result.current.loadingValueBets).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.valueBets).toEqual(valueBetsResponse);
    expect(result.current.isValueBetsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useValueBets(mockApiService, 5544));

    await waitFor(() => {
      expect(result.current.loadingValueBets).toBe(false);
    });

    expect(result.current.valueBets.markets).toEqual([]);
    expect(result.current.isValueBetsAvailable).toBe(false);
  });

  it("should refetch when fixtureId changes", async () => {
    fetchMock.mockResolvedValue(valueBetsResponse);

    const { result, rerender } = renderHook(
      ({ fixtureId }) => useValueBets(mockApiService, fixtureId),
      {
        initialProps: { fixtureId: 2323 },
      }
    );

    await waitFor(() => {
      expect(result.current.valueBets).toEqual(valueBetsResponse);
    });

    rerender({ fixtureId: 5544 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
