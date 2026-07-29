import { renderHook, waitFor } from "@testing-library/react";
import { useLastFiveMatchesEvents } from "./last-five-match-events";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { lastfiveEvents } from "../../mock-data";

describe("useLastFiveMatchesEvents", () => {
  const fetchLastFiveMatchesEvents = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchLastFiveMatchesEvents: fetchLastFiveMatchesEvents,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    fetchLastFiveMatchesEvents.mockResolvedValue(lastfiveEvents);

    const { result } = renderHook(() =>
      useLastFiveMatchesEvents(mockApiService, 1, 2)
    );

    expect(result.current.loadingAwayEvents).toBe(true);
    expect(result.current.loadingHomeEvents).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchLastFiveMatchesEvents.mockResolvedValue(lastfiveEvents);

    const { result } = renderHook(() =>
      useLastFiveMatchesEvents(mockApiService, 1, 2)
    );

    await waitFor(() => {
      expect(result.current.loadingAwayEvents).toBe(false);
      expect(result.current.loadingHomeEvents).toBe(false);
      expect(result.current.isAwayEventsAvailable).toBe(true);
      expect(result.current.isHomeEventsAvailable).toBe(true);
    });

    expect(fetchLastFiveMatchesEvents).toHaveBeenCalledTimes(2);
    expect(result.current.awayEventsSummary).toEqual(lastfiveEvents);
    expect(result.current.homeEventsSummary).toEqual(lastfiveEvents);
  });

  it("should handle API error gracefully", async () => {
    fetchLastFiveMatchesEvents
      .mockRejectedValueOnce(new Error("network error"))
      .mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useLastFiveMatchesEvents(mockApiService, 5, 7)
    );

    await waitFor(() => {
      expect(result.current.loadingAwayEvents).toBe(false);
      expect(result.current.loadingHomeEvents).toBe(false);
    });

    expect(result.current.awayEventsSummary).toBeUndefined();
    expect(result.current.homeEventsSummary).toBeUndefined();
    expect(result.current.isAwayEventsAvailable).toBe(false);
    expect(result.current.isHomeEventsAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    fetchLastFiveMatchesEvents.mockResolvedValue(lastfiveEvents);

    const { result, rerender } = renderHook(
      ({ homeId, awayId }) =>
        useLastFiveMatchesEvents(mockApiService, homeId, awayId),
      {
        initialProps: { homeId: 1, awayId: 2 },
      }
    );

    await waitFor(() => {
      expect(result.current.homeEventsSummary).toEqual(lastfiveEvents);
      expect(result.current.awayEventsSummary).toEqual(lastfiveEvents);
    });

    rerender({ homeId: 9, awayId: 10 });

    await waitFor(() => {
      expect(result.current.homeEventsSummary).toEqual(lastfiveEvents);
      expect(result.current.awayEventsSummary).toEqual(lastfiveEvents);
    });

    expect(fetchLastFiveMatchesEvents).toHaveBeenCalledTimes(4);
  });
});
