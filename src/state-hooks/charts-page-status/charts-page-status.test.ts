import { act, renderHook } from "@testing-library/react";
import { vi, Mock, describe, it, expect, beforeEach } from "vitest";
import { useChartsPageStatus } from "./charts-page-status";

vi.mock("../../spacial-hooks", async () => ({
  useChartsEvents: vi.fn(),
}));

import { useChartsEvents } from "../../spacial-hooks";

const mockUseChartsEvents = useChartsEvents as Mock;

const momentumPoints = [
  { minute: 5, value: 12, capturedAt: "2026-06-24T15:05:00Z" },
];

const controlPoints = [
  { minute: 5, value: 58, capturedAt: "2026-06-24T15:05:00Z" },
];

const goalThreatPoints = [
  { minute: 5, value: 65, capturedAt: "2026-06-24T15:05:00Z" },
];

const chartsEvents = [
  {
    fixtureId: 101,
    homeTeamName: "Arsenal",
    awayTeamName: "Chelsea",
    indicators: { momentum: momentumPoints, control: controlPoints, goal_threat: goalThreatPoints },
  },
  {
    fixtureId: 102,
    homeTeamName: "Man City",
    awayTeamName: "Liverpool",
    indicators: { momentum: [], control: [], goal_threat: [] },
  },
];

describe("useChartsPageStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChartsEvents.mockReturnValue(chartsEvents);
  });

  it("calls useChartsEvents with the given params", () => {
    const source = vi.fn();
    renderHook(() =>
      useChartsPageStatus("http://test-api", 1, "101", source),
    );

    expect(mockUseChartsEvents).toHaveBeenCalledWith(
      "http://test-api",
      1,
      source,
    );
  });

  it("resolves effectiveFixtureId to the route fixture id when given", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.effectiveFixtureId).toBe(101);
  });

  it("resolves effectiveFixtureId to the first chartsEvents entry when no route fixture id is given", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBe(101);
  });

  it("resolves effectiveFixtureId to undefined when there is no route fixture id and chartsEvents is empty", () => {
    mockUseChartsEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBeUndefined();
  });

  it("derives team names from the matching chartsEvents entry", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "102"),
    );

    expect(result.current.homeTeamName).toBe("Man City");
    expect(result.current.awayTeamName).toBe("Liverpool");
  });

  it("derives momentumPoints from the matching chartsEvents entry", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.momentumPoints).toEqual(momentumPoints);
  });

  it("derives controlPoints from the matching chartsEvents entry", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.controlPoints).toEqual(controlPoints);
  });

  it("returns an empty controlPoints array when chartsEvents has no matching entry yet", () => {
    mockUseChartsEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.controlPoints).toEqual([]);
  });

  it("derives goalThreatPoints from the matching chartsEvents entry", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.goalThreatPoints).toEqual(goalThreatPoints);
  });

  it("returns an empty goalThreatPoints array when chartsEvents has no matching entry yet", () => {
    mockUseChartsEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.goalThreatPoints).toEqual([]);
  });

  it("returns an empty momentumPoints array when chartsEvents has no matching entry yet", () => {
    mockUseChartsEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.momentumPoints).toEqual([]);
  });

  it("always reports loadingChartMatches as false", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.loadingChartMatches).toBe(false);
  });

  it("reports isChartNotAvailable as true when chartsEvents is empty", () => {
    mockUseChartsEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.isChartNotAvailable).toBe(true);
  });

  it("reports isChartNotAvailable as false when chartsEvents has entries", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.isChartNotAvailable).toBe(false);
  });

  it("exposes chartMatches sourced from chartsEvents", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.chartMatches).toEqual(chartsEvents);
  });

  it("exposes a setEffectiveFixtureId setter that updates effectiveFixtureId when called", () => {
    const { result } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0, "101"),
    );

    expect(result.current.effectiveFixtureId).toBe(101);

    act(() => {
      result.current.setEffectiveFixtureId(102);
    });

    expect(result.current.effectiveFixtureId).toBe(102);
  });

  it("switches to the first chartsEvents entry when the previously selected fixture is no longer present", () => {
    mockUseChartsEvents.mockReturnValue([chartsEvents[0]]);

    const { result, rerender } = renderHook(() =>
      useChartsPageStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBe(101);

    mockUseChartsEvents.mockReturnValue([chartsEvents[1]]);

    rerender();

    expect(result.current.effectiveFixtureId).toBe(102);
  });
});
