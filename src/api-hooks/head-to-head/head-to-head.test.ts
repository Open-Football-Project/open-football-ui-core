import { renderHook, waitFor } from "@testing-library/react";
import { useHeadToHead } from "./head-to-head";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { mockH2HDetails } from "../../mock-data";

describe("useHeadToHead", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchHeadToHead: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockH2HDetails);

    const { result } = renderHook(() => useHeadToHead(mockApiService, 1, 2));

    expect(result.current.loadingH2hDetail).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockH2HDetails);

    const { result } = renderHook(() => useHeadToHead(mockApiService, 1, 2));

    await waitFor(() => {
      expect(result.current.loadingH2hDetail).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.h2hDetails).toEqual(mockH2HDetails);
    expect(result.current.isHead2HeadAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useHeadToHead(mockApiService, 5, 7));

    await waitFor(() => {
      expect(result.current.loadingH2hDetail).toBe(false);
    });

    expect(result.current.h2hDetails).toEqual([]);
    expect(result.current.isHead2HeadAvailable).toBe(false);
  });

  it("should pass isFull=true to the service when requested", async () => {
    fetchMock.mockResolvedValue(mockH2HDetails);

    const { result } = renderHook(() =>
      useHeadToHead(mockApiService, 1, 2, true)
    );

    await waitFor(() => {
      expect(result.current.loadingH2hDetail).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith(1, 2, true);
  });

  it("should not pass isFull when omitted", async () => {
    fetchMock.mockResolvedValue(mockH2HDetails);

    const { result } = renderHook(() => useHeadToHead(mockApiService, 1, 2));

    await waitFor(() => {
      expect(result.current.loadingH2hDetail).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith(1, 2, undefined);
  });

  it("should refetch when team IDs change", async () => {
    fetchMock.mockResolvedValue(mockH2HDetails);

    const { result, rerender } = renderHook(
      ({ homeId, awayId }) => useHeadToHead(mockApiService, homeId, awayId),
      {
        initialProps: { homeId: 1, awayId: 2 },
      }
    );

    await waitFor(() => {
      expect(result.current.h2hDetails).toEqual(mockH2HDetails);
    });

    rerender({ homeId: 9, awayId: 10 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
