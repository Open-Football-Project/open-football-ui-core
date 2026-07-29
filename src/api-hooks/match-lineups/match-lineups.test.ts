import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";

import { useMatchLineups } from "./match-lineups";
import { mockLineups } from "../../mock-data";

describe("useMatchLineups", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    matchesService: {
      fetchMatchLineups: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockLineups);

    const { result } = renderHook(() => useMatchLineups(mockApiService, 2323));

    expect(result.current.loadingMatchLineups).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockLineups);

    const { result } = renderHook(() => useMatchLineups(mockApiService, 2323));

    await waitFor(() => {
      expect(result.current.loadingMatchLineups).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.matchLineups).toEqual(mockLineups);
    expect(result.current.isLineupsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useMatchLineups(mockApiService, 5544));

    await waitFor(() => {
      expect(result.current.loadingMatchLineups).toBe(false);
    });

    expect(result.current.isLineupsAvailable).toBe(false);
  });

  it("should refetch when fixture id change", async () => {
    fetchMock.mockResolvedValue(mockLineups);

    const { result, rerender } = renderHook(
      ({ fixtureId }) => useMatchLineups(mockApiService, fixtureId),
      {
        initialProps: { fixtureId: 23223 },
      }
    );

    await waitFor(() => {
      expect(result.current.matchLineups).toEqual(mockLineups);
    });

    rerender({ fixtureId: 5544 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
