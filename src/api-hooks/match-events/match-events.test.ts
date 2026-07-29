import { renderHook, waitFor } from "@testing-library/react";
import { useMatchEvents } from "./match-events";
import { vi, beforeEach, describe, expect, it } from "vitest";

import { mockMatchEvents } from "../../mock-data";

describe("useMatchEvents", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    matchesService: {
      fetchMatchEvents: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockMatchEvents);

    const { result } = renderHook(() => useMatchEvents(mockApiService, 2323));

    expect(result.current.loadingEvents).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockMatchEvents);

    const { result } = renderHook(() => useMatchEvents(mockApiService, 2323));

    await waitFor(() => {
      expect(result.current.loadingEvents).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.events).toEqual(mockMatchEvents);
    expect(result.current.isEventsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useMatchEvents(mockApiService, 5544));

    await waitFor(() => {
      expect(result.current.loadingEvents).toBe(false);
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.isEventsAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    fetchMock.mockResolvedValue(mockMatchEvents);

    const { result, rerender } = renderHook(
      ({ fixtureId }) => useMatchEvents(mockApiService, fixtureId),
      {
        initialProps: { fixtureId: 2323 },
      }
    );

    await waitFor(() => {
      expect(result.current.events).toEqual(mockMatchEvents);
    });

    rerender({ fixtureId: 5544 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
