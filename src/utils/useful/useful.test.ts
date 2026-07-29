import { describe, it, expect, vi } from "vitest";
import {
  anyMainLeagueId,
  cleanLeagueName,
  cleanUpLeagueGrp,
  normalizeLeagueRound,
  normalizeStatName,
  getTeamStatistic,
  IndicatorStats,
} from "./useful";
import { TeamStatistic } from "../../types/team-statistics";

vi.mock("../../values", () => ({
  MAIN_LEAGUE_IDS: [1, 2, 3],
}));

describe("anyMainLeagueId", () => {
  it("returns true if any id is a main league", () => {
    expect(anyMainLeagueId([5, 2, 9])).toBe(true);
  });

  it("returns false if no id is a main league", () => {
    expect(anyMainLeagueId([4, 5, 6])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(anyMainLeagueId([])).toBe(false);
  });
});

describe("cleanLeagueName", () => {
  it("cleans and shortens league names", () => {
    const input = "CONMEBOL Primera Profesional League - Apertura";
    const result = cleanLeagueName(input);

    expect(result).toBe("Prim. Prof. Lg. Ape.");
  });

  it("handles world cup naming", () => {
    const input = "FIFA World Cup - Qualification";
    const result = cleanLeagueName(input);

    expect(result).toBe("WC Q.");
  });
});

describe("cleanUpLeagueGrp", () => {
  it("cleans group names correctly", () => {
    const input = "Conmebol Libertadores Primera Division Apertura";
    const result = cleanUpLeagueGrp(input);

    expect(result).toBe("Ape");
  });

  it("shortens known words", () => {
    const input = "Segunda Intermedio League";
    const result = cleanUpLeagueGrp(input);

    expect(result).toBe("Seg Int Lg.");
  });
});

describe("normalizeStatName", () => {
  it("lowercases and trims", () => {
    expect(normalizeStatName("  Shots On Goal  ")).toBe(IndicatorStats.SHOTS_ON_GOAL);
  });

  it("replaces spaces with underscores", () => {
    expect(normalizeStatName("Ball Possession")).toBe(IndicatorStats.BALL_POSSESSION);
  });

  it("replaces hyphens with underscores", () => {
    expect(normalizeStatName("Shots-On-Goal")).toBe(IndicatorStats.SHOTS_ON_GOAL);
  });

  it("collapses multiple spaces/hyphens into one underscore", () => {
    expect(normalizeStatName("shots  -  on goal")).toBe(IndicatorStats.SHOTS_ON_GOAL);
  });
});

describe("getTeamStatistic", () => {
  const stats: TeamStatistic[] = [
    { name: "Shots On Goal", value: 5, total: 10, isPositive: true },
    { name: "Ball Possession", value: 60, total: 100, isPositive: true },
  ];

  it("returns value for a matching stat name", () => {
    expect(getTeamStatistic(stats, "shots on goal")).toBe(5);
  });

  it("matches regardless of casing and formatting", () => {
    expect(getTeamStatistic(stats, "BALL-POSSESSION")).toBe(60);
  });

  it("returns 0 when stat is not found", () => {
    expect(getTeamStatistic(stats, "corner kicks")).toBe(0);
  });

  it("returns 0 for empty stats array", () => {
    expect(getTeamStatistic([], "shots on goal")).toBe(0);
  });
});

describe("normalizeLeagueRound", () => {
  it("normalizes spaces and hyphens", () => {
    expect(normalizeLeagueRound("Quarter Final - Leg 1")).toBe(
      "quarter_final_leg_1"
    );
  });

  it("removes extra underscores", () => {
    expect(normalizeLeagueRound("Semi  --   Final")).toBe("semi_final");
  });

  it("trims and lowercases", () => {
    expect(normalizeLeagueRound("  FINAL ROUND ")).toBe("final_round");
  });
});
