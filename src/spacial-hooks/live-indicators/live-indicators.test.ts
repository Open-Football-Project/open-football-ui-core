import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useLiveIndicators } from "./live-indicators";
import { TeamStatistic, TwoTeamsStatistics } from "../../types";

const makeStat = (name: string, value: number): TeamStatistic => ({
  name,
  value,
  total: value,
  isPositive: true,
});

const homeStats: TeamStatistic[] = [
  makeStat("shots_on_goal", 3),
  makeStat("shots_off_goal", 2),
  makeStat("shots_insidebox", 4),
  makeStat("corner_kicks", 1),
  makeStat("ball_possession", 60),
  makeStat("passes_%", 80),
  makeStat("expected_goals", 1.5),
];

const awayStats: TeamStatistic[] = [
  makeStat("shots_on_goal", 1),
  makeStat("shots_off_goal", 1),
  makeStat("shots_insidebox", 2),
  makeStat("corner_kicks", 0),
  makeStat("ball_possession", 40),
  makeStat("passes_%", 70),
  makeStat("expected_goals", 0.8),
];

const twoTeamsStats: TwoTeamsStatistics = {
  teamA: { teamId: 1, teamName: "Home", teamLogo: "", statistics: homeStats },
  teamB: { teamId: 2, teamName: "Away", teamLogo: "", statistics: awayStats },
};

describe("useLiveIndicators", () => {
  it("returns hasData false when liveStats is undefined", () => {
    const { result } = renderHook(() => useLiveIndicators(undefined));
    expect(result.current.hasData).toBe(false);
  });

  it("returns hasData false when teamA statistics are empty", () => {
    const stats: TwoTeamsStatistics = {
      teamA: { teamId: 1, teamName: "Home", teamLogo: "", statistics: [] },
      teamB: { teamId: 2, teamName: "Away", teamLogo: "", statistics: awayStats },
    };
    const { result } = renderHook(() => useLiveIndicators(stats));
    expect(result.current.hasData).toBe(false);
  });

  it("returns hasData false when teamB statistics are empty", () => {
    const stats: TwoTeamsStatistics = {
      teamA: { teamId: 1, teamName: "Home", teamLogo: "", statistics: homeStats },
      teamB: { teamId: 2, teamName: "Away", teamLogo: "", statistics: [] },
    };
    const { result } = renderHook(() => useLiveIndicators(stats));
    expect(result.current.hasData).toBe(false);
  });

  it("returns hasData true when both teams have statistics", () => {
    const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
    expect(result.current.hasData).toBe(true);
  });

  it("returns 50/50 for all indicators when stats are undefined", () => {
    const { result } = renderHook(() => useLiveIndicators(undefined));
    const { momentum, control, goalThreat } = result.current;

    expect(momentum.homePercent).toBe(50);
    expect(momentum.awayPercent).toBe(50);
    expect(control.homePercent).toBe(50);
    expect(control.awayPercent).toBe(50);
    expect(goalThreat.homePercent).toBe(50);
    expect(goalThreat.awayPercent).toBe(50);
  });

  describe("momentum", () => {
    it("calculates homePercent and awayPercent correctly", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.momentum.homePercent).toBe(71);
      expect(result.current.momentum.awayPercent).toBe(29);
    });

    it("has correct label and emoji", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.momentum.label).toBe("indicators.momentum");
      expect(result.current.momentum.emoji).toBe("⚡");
    });

    it("homePercent and awayPercent always sum to 100", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.momentum.homePercent + result.current.momentum.awayPercent).toBe(100);
    });
  });

  describe("control", () => {
    // home: 60×0.7 + 80×0.3 = 66, away: 40×0.7 + 70×0.3 = 49 → total 115 → home 57%, away 43%
    it("calculates homePercent and awayPercent correctly", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.control.homePercent).toBe(57);
      expect(result.current.control.awayPercent).toBe(43);
    });

    it("has correct label and emoji", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.control.label).toBe("indicators.match_control");
      expect(result.current.control.emoji).toBe("🎮");
    });

    it("homePercent and awayPercent always sum to 100", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.control.homePercent + result.current.control.awayPercent).toBe(100);
    });
  });

  describe("goalThreat", () => {
    // home: 1.5×10 + 3×3 + 4×1 = 28, away: 0.8×10 + 1×3 + 2×1 = 13 → total 41 → home 68%, away 32%
    it("calculates homePercent and awayPercent correctly", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.goalThreat.homePercent).toBe(68);
      expect(result.current.goalThreat.awayPercent).toBe(32);
    });

    it("has correct label and emoji", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.goalThreat.label).toBe("indicators.goal_threat");
      expect(result.current.goalThreat.emoji).toBe("🎯");
    });

    it("homePercent and awayPercent always sum to 100", () => {
      const { result } = renderHook(() => useLiveIndicators(twoTeamsStats));
      expect(result.current.goalThreat.homePercent + result.current.goalThreat.awayPercent).toBe(100);
    });
  });
});
