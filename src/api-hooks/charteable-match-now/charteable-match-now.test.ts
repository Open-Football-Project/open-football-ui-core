import { renderHook, waitFor } from "@testing-library/react";
import { expect, vi, describe, it, beforeEach } from "vitest";

import { useCharteableMatchNow } from "./charteable-match-now";

describe("useCharteableMatchNow", () => {
  const fetchIndicatorsMock = vi.fn();
  const fetchOddsFixturesMock = vi.fn();

  const mockApiService = {
    chartsService: {
      fetchFixtureIndicators: fetchIndicatorsMock,
      fetchOddsFixtures: fetchOddsFixturesMock,
    },
  } as any;

  beforeEach(() => {
    fetchIndicatorsMock.mockReset();
    fetchOddsFixturesMock.mockReset();
    fetchOddsFixturesMock.mockResolvedValue([]);
  });

  it("should start with loadingCharteableMatchNow=true", () => {
    fetchIndicatorsMock.mockResolvedValueOnce({ momentum: [] });

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    expect(result.current.loadingCharteableMatchNow).toBe(true);
  });

  it("should expose isCharteableMatchNow=true when an indicator has points", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({
      momentum: [{ minute: 1, value: 0, capturedAt: "2026-01-01T00:00:00Z" }],
    });

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(fetchIndicatorsMock).toHaveBeenCalledWith(42);
    expect(result.current.isCharteableMatchNow).toBe(true);
  });

  it("should expose isCharteableMatchNow=false when every indicator array is empty and no odds fixture matches", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({ momentum: [] });

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(result.current.isCharteableMatchNow).toBe(false);
  });

  it("should expose isCharteableMatchNow=false on indicators API error when no odds fixture matches", async () => {
    fetchIndicatorsMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(result.current.isCharteableMatchNow).toBe(false);
  });

  it("should expose isCharteableMatchNow=true when there are no indicator points but the fixture is in the odds-fixtures list", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({ momentum: [] });
    fetchOddsFixturesMock.mockResolvedValueOnce([
      { fixtureId: 42, homeTeamName: "Arsenal", awayTeamName: "Chelsea" },
    ]);

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(fetchOddsFixturesMock).toHaveBeenCalled();
    expect(result.current.isCharteableMatchNow).toBe(true);
  });

  it("should expose isCharteableMatchNow=false when the odds-fixtures list has entries for other fixtures only", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({ momentum: [] });
    fetchOddsFixturesMock.mockResolvedValueOnce([
      { fixtureId: 99, homeTeamName: "Man City", awayTeamName: "Liverpool" },
    ]);

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(result.current.isCharteableMatchNow).toBe(false);
  });

  it("should expose isCharteableMatchNow=false on odds-fixtures API error when there are no indicator points", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({ momentum: [] });
    fetchOddsFixturesMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(result.current.isCharteableMatchNow).toBe(false);
  });

  it("should still expose isCharteableMatchNow=true when odds-fixtures errors but an indicator has points", async () => {
    fetchIndicatorsMock.mockResolvedValueOnce({
      momentum: [{ minute: 1, value: 0, capturedAt: "2026-01-01T00:00:00Z" }],
    });
    fetchOddsFixturesMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useCharteableMatchNow(mockApiService, 42)
    );

    await waitFor(() => {
      expect(result.current.loadingCharteableMatchNow).toBe(false);
    });

    expect(result.current.isCharteableMatchNow).toBe(true);
  });
});
