import { renderHook, waitFor } from "@testing-library/react";
import { usePlayerInfo } from "./player-info";

import { vi, describe, beforeEach, it, expect } from "vitest";

import { playerMainInfoMock } from "../../mock-data";

describe("usePlayerInfo", () => {
  const mockFetchPlayerInfo = vi.fn();

  const mockApiService = {
    playerService: {
      fetchPlayerInfo: mockFetchPlayerInfo,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchPlayerInfo.mockResolvedValueOnce(playerMainInfoMock);

    const { result } = renderHook(() => usePlayerInfo(mockApiService, 1342));

    expect(result.current.loadingPlayerInfo).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchPlayerInfo.mockResolvedValueOnce(playerMainInfoMock);

    const { result } = renderHook(() => usePlayerInfo(mockApiService, 1342));

    await waitFor(() => expect(result.current.loadingPlayerInfo).toBe(false));

    expect(mockFetchPlayerInfo).toHaveBeenCalledWith(1342);
    expect(result.current.playerInfo).toEqual(playerMainInfoMock);
    expect(result.current.isPlayerInfoAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchPlayerInfo.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => usePlayerInfo(mockApiService, 5));

    await waitFor(() => expect(result.current.loadingPlayerInfo).toBe(false));

    expect(result.current.playerInfo).toBeUndefined();
    expect(result.current.isPlayerInfoAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    mockFetchPlayerInfo.mockResolvedValue(playerMainInfoMock);

    const { result, rerender } = renderHook(
      ({ playerId }) => usePlayerInfo(mockApiService, playerId),
      {
        initialProps: { playerId: 142 },
      }
    );

    await waitFor(() =>
      expect(result.current.playerInfo).toEqual(playerMainInfoMock)
    );

    rerender({ playerId: 910 });

    await waitFor(() =>
      expect(result.current.isPlayerInfoAvailable).toBe(true)
    );

    expect(mockFetchPlayerInfo).toHaveBeenCalledTimes(2);
  });
});
