import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { useTopGuysAvailable } from "./top-guys-available";

describe("useTopGuysAvailable", () => {
  const fetchAvailableFixtureIdsMock = vi.fn();

  const mockApiService = {
    playerService: {
      fetchTodayPlayersFixtureIds: fetchAvailableFixtureIdsMock,
    },
  } as any;

  beforeEach(() => {
    fetchAvailableFixtureIdsMock.mockReset();
  });

  it("should start with loadingTopGuysAvailable=true", () => {
    fetchAvailableFixtureIdsMock.mockResolvedValueOnce([42]);

    const { result } = renderHook(() => useTopGuysAvailable(mockApiService, 42));

    expect(result.current.loadingTopGuysAvailable).toBe(true);
  });

  it("should expose isTopGuysAvailable=true when the fixture id is in the available list", async () => {
    fetchAvailableFixtureIdsMock.mockResolvedValueOnce([42, 99]);

    const { result } = renderHook(() => useTopGuysAvailable(mockApiService, 42));

    await waitFor(() => expect(result.current.loadingTopGuysAvailable).toBe(false));

    expect(fetchAvailableFixtureIdsMock).toHaveBeenCalled();
    expect(result.current.isTopGuysAvailable).toBe(true);
  });

  it("should expose isTopGuysAvailable=false when the fixture id is not in the available list", async () => {
    fetchAvailableFixtureIdsMock.mockResolvedValueOnce([99]);

    const { result } = renderHook(() => useTopGuysAvailable(mockApiService, 42));

    await waitFor(() => expect(result.current.loadingTopGuysAvailable).toBe(false));

    expect(result.current.isTopGuysAvailable).toBe(false);
  });

  it("should expose isTopGuysAvailable=false on API error (fail closed)", async () => {
    fetchAvailableFixtureIdsMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useTopGuysAvailable(mockApiService, 42));

    await waitFor(() => expect(result.current.loadingTopGuysAvailable).toBe(false));

    expect(result.current.isTopGuysAvailable).toBe(false);
  });

  it("should refetch when fixtureId changes", async () => {
    fetchAvailableFixtureIdsMock.mockResolvedValue([42]);

    const { result, rerender } = renderHook(
      ({ fixtureId }) => useTopGuysAvailable(mockApiService, fixtureId),
      { initialProps: { fixtureId: 42 } }
    );

    await waitFor(() => expect(result.current.isTopGuysAvailable).toBe(true));

    rerender({ fixtureId: 99 });

    await waitFor(() => expect(result.current.isTopGuysAvailable).toBe(false));

    expect(fetchAvailableFixtureIdsMock).toHaveBeenCalledTimes(2);
  });
});
