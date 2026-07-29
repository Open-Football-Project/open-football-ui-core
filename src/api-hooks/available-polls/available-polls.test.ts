import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect } from "vitest";
import { useAvailablePolls } from "./available-polls";

describe("useAvailablePolls", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    pollsService: {
      availablePolls: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true and no available polls", () => {
    fetchMock.mockResolvedValueOnce([]);
    const { result } = renderHook(() =>
      useAvailablePolls(mockApiService, 1234)
    );

    expect(result.current.isAvailablePollsOn).toBe(false);
  });

  it("should set results after successful fetch", async () => {
    const mockPolls = [
      { pollKey: "match-winner", pollTitle: "Match Winner", pollOptions: [] },
    ];

    fetchMock.mockResolvedValueOnce(mockPolls);

    const { result } = renderHook(() =>
      useAvailablePolls(mockApiService, 2323)
    );

    await waitFor(() => {
      expect(result.current.availablePolls).toEqual(mockPolls);
      expect(result.current.isAvailablePollsOn).toBe(true);
    });
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useAvailablePolls(mockApiService, 2333)
    );

    await waitFor(() => {
      expect(result.current.availablePolls).toEqual([]);
      expect(result.current.isAvailablePollsOn).toBe(false);
    });
  });

  it("should refetch when fixture id changes", async () => {
    const mockPolls = [
      { pollKey: "total-goals", pollTitle: "Total Goals", pollOptions: [] },
    ];

    fetchMock.mockResolvedValue(mockPolls);

    const { rerender } = renderHook(
      ({ fixtureId }) => useAvailablePolls(mockApiService, fixtureId),
      {
        initialProps: { fixtureId: 1000 },
      }
    );

    rerender({ fixtureId: 2000 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
