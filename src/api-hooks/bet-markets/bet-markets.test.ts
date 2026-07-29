import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { useBetMarkets } from "./bet-markets";

describe("useBetMarkets", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    chartsService: {
      fetchBetMarkets: fetchMock,
    },
  } as any;

  const betMarketGroups = [
    [
      {
        id: 59,
        name: "fulltime_result",
        history: {
          Home: [{ minute: 5, odd: "1.7", capturedAt: "2026-06-24T15:05:00Z" }],
        },
      },
    ],
  ];

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("returns an empty betMarketGroups and does not fetch when fixtureId is undefined", () => {
    const { result } = renderHook(() => useBetMarkets(mockApiService, undefined));

    expect(result.current.betMarketGroups).toEqual([]);
    expect(result.current.loadingBetMarkets).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports isBetMarketsAvailable as false when fixtureId is undefined", () => {
    const { result } = renderHook(() => useBetMarkets(mockApiService, undefined));

    expect(result.current.isBetMarketsAvailable).toBe(false);
  });

  it("reports isBetMarketsAvailable as false while the fetch is in flight", () => {
    fetchMock.mockReturnValueOnce(new Promise(() => {}));

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    expect(result.current.isBetMarketsAvailable).toBe(false);
  });

  it("reports isBetMarketsAvailable as true once betMarketGroups is populated", async () => {
    fetchMock.mockResolvedValueOnce(betMarketGroups);

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    await waitFor(() => {
      expect(result.current.isBetMarketsAvailable).toBe(true);
    });
  });

  it("reports isBetMarketsAvailable as false when fetchBetMarkets resolves empty", async () => {
    fetchMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    await waitFor(() => {
      expect(result.current.loadingBetMarkets).toBe(false);
    });

    expect(result.current.isBetMarketsAvailable).toBe(false);
  });

  it("fetches bet markets for the given fixtureId and exposes them as betMarketGroups", async () => {
    fetchMock.mockResolvedValueOnce(betMarketGroups);

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    await waitFor(() => {
      expect(result.current.loadingBetMarkets).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith(1539007);
    expect(result.current.betMarketGroups).toEqual(betMarketGroups);
  });

  it("sets loadingBetMarkets to true while the fetch is in flight", () => {
    fetchMock.mockReturnValueOnce(new Promise(() => {}));

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    expect(result.current.loadingBetMarkets).toBe(true);
  });

  it("resets betMarketGroups to [] when fetchBetMarkets rejects", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useBetMarkets(mockApiService, 1539007));

    await waitFor(() => {
      expect(result.current.loadingBetMarkets).toBe(false);
    });

    expect(result.current.betMarketGroups).toEqual([]);
  });

  it("refetches when fixtureId changes", async () => {
    fetchMock.mockResolvedValue(betMarketGroups);

    const { rerender } = renderHook(
      ({ fixtureId }) => useBetMarkets(mockApiService, fixtureId),
      { initialProps: { fixtureId: 1539007 } }
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(1539007);
    });

    rerender({ fixtureId: 2000000 });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(2000000);
    });
  });

  it("refetches the same fixtureId when refreshTrigger changes, without a fixtureId change", async () => {
    fetchMock.mockResolvedValue(betMarketGroups);

    const { rerender } = renderHook(
      ({ refreshTrigger }) => useBetMarkets(mockApiService, 1539007, refreshTrigger),
      { initialProps: { refreshTrigger: "tick-1" } }
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    rerender({ refreshTrigger: "tick-2" });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock).toHaveBeenNthCalledWith(2, 1539007);
  });

  it("does not refetch when refreshTrigger is passed but stays referentially the same", async () => {
    fetchMock.mockResolvedValue(betMarketGroups);
    const refreshTrigger = { tick: 1 };

    const { rerender } = renderHook(
      () => useBetMarkets(mockApiService, 1539007, refreshTrigger)
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    rerender();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
