import { act, renderHook } from "@testing-library/react";
import { vi, Mock, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useCharteableOddsStatus } from "./charteable-odds-status";

vi.mock("../../spacial-hooks", async () => ({
  useOddsFixturesEvents: vi.fn(),
}));

import { useOddsFixturesEvents } from "../../spacial-hooks";

const mockUseOddsFixturesEvents = useOddsFixturesEvents as Mock;

const oddsMatches = [
  { fixtureId: 101, homeTeamName: "Arsenal", awayTeamName: "Chelsea" },
  { fixtureId: 102, homeTeamName: "Man City", awayTeamName: "Liverpool" },
];

describe("useCharteableOddsStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOddsFixturesEvents.mockReturnValue(oddsMatches);
  });

  it("calls useOddsFixturesEvents with the given params", () => {
    const source = vi.fn();
    renderHook(() =>
      useCharteableOddsStatus("http://test-api", 1, "101", source),
    );

    expect(mockUseOddsFixturesEvents).toHaveBeenCalledWith(
      "http://test-api",
      1,
      source,
    );
  });

  it("resolves effectiveFixtureId to the route fixture id when given", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0, "101"),
    );

    expect(result.current.effectiveFixtureId).toBe(101);
  });

  it("resolves effectiveFixtureId to the first oddsMatches entry when no route fixture id is given", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBe(101);
  });

  it("resolves effectiveFixtureId to undefined when there is no route fixture id and oddsMatches is empty", () => {
    mockUseOddsFixturesEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBeUndefined();
  });

  it("derives team names from the matching oddsMatches entry", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0, "102"),
    );

    expect(result.current.homeTeamName).toBe("Man City");
    expect(result.current.awayTeamName).toBe("Liverpool");
  });

  it("reports isOddsNotAvailable as true when oddsMatches is empty", () => {
    mockUseOddsFixturesEvents.mockReturnValue([]);

    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.isOddsNotAvailable).toBe(true);
  });

  it("reports isOddsNotAvailable as false when oddsMatches has entries", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.isOddsNotAvailable).toBe(false);
  });

  it("exposes oddsMatches sourced from useOddsFixturesEvents", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.oddsMatches).toEqual(oddsMatches);
  });

  it("exposes a setEffectiveFixtureId setter that updates effectiveFixtureId when called", () => {
    const { result } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0, "101"),
    );

    expect(result.current.effectiveFixtureId).toBe(101);

    act(() => {
      result.current.setEffectiveFixtureId(102);
    });

    expect(result.current.effectiveFixtureId).toBe(102);
  });

  it("switches to the first oddsMatches entry when the previously selected fixture is no longer present", () => {
    mockUseOddsFixturesEvents.mockReturnValue([oddsMatches[0]]);

    const { result, rerender } = renderHook(() =>
      useCharteableOddsStatus("http://test-api", 0),
    );

    expect(result.current.effectiveFixtureId).toBe(101);

    mockUseOddsFixturesEvents.mockReturnValue([oddsMatches[1]]);

    rerender();

    expect(result.current.effectiveFixtureId).toBe(102);
  });

  describe("oddsEventReceivedAt", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("is set on mount", () => {
      vi.spyOn(Date, "now").mockReturnValue(1000);

      const { result } = renderHook(() =>
        useCharteableOddsStatus("http://test-api", 0, "101"),
      );

      expect(result.current.oddsEventReceivedAt).toBe(1000);
    });

    it("updates when a new oddsMatches tick arrives, even with unchanged content", () => {
      const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1000);

      const { result, rerender } = renderHook(() =>
        useCharteableOddsStatus("http://test-api", 0, "101"),
      );

      expect(result.current.oddsEventReceivedAt).toBe(1000);

      nowSpy.mockReturnValue(2000);
      mockUseOddsFixturesEvents.mockReturnValue([...oddsMatches]);

      rerender();

      expect(result.current.oddsEventReceivedAt).toBe(2000);
    });

    it("does not update when only effectiveFixtureId changes via the manual setter", () => {
      const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1000);

      const { result } = renderHook(() =>
        useCharteableOddsStatus("http://test-api", 0, "101"),
      );

      expect(result.current.oddsEventReceivedAt).toBe(1000);

      nowSpy.mockReturnValue(9999);

      act(() => {
        result.current.setEffectiveFixtureId(102);
      });

      expect(result.current.oddsEventReceivedAt).toBe(1000);
    });
  });
});
