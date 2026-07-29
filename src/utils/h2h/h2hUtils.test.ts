import { describe, it, expect } from "vitest";
import { h2hToIndicator } from "./h2hUtils";
import { H2HDetails } from "../../types";

const match = (winner: string): H2HDetails => ({
  date: "2025-01-01T00:00:00Z",
  venue: {},
  leagueName: "La Liga",
  season: 2024,
  winner,
  homeHalfTimeGoal: 0,
  awayHalfTimeGoal: 0,
  homeFullTimeGoal: 0,
  awayFullTimeGoal: 0,
  homeExtraTimeGoal: 0,
  awayExtraTimeGoal: 0,
  homePenalty: 0,
  awayPenalty: 0,
});

describe("h2hToIndicator", () => {
  it("returns 50/50 for an empty match list", () => {
    const result = h2hToIndicator([], "Barcelona", "Real Madrid");
    expect(result.homePercent).toBe(50);
    expect(result.awayPercent).toBe(50);
  });

  it("returns 100/0 when home team won all matches", () => {
    const matches = [match("Barcelona"), match("Barcelona"), match("Barcelona")];
    const result = h2hToIndicator(matches, "Barcelona", "Real Madrid");
    expect(result.homePercent).toBeCloseTo(100);
    expect(result.awayPercent).toBeCloseTo(0);
  });

  it("returns 0/100 when away team won all matches", () => {
    const matches = [match("Real Madrid"), match("Real Madrid")];
    const result = h2hToIndicator(matches, "Barcelona", "Real Madrid");
    expect(result.homePercent).toBeCloseTo(0);
    expect(result.awayPercent).toBeCloseTo(100);
  });

  it("splits draws 50/50 between both teams", () => {
    const matches = [match("Draw"), match("Draw")];
    const result = h2hToIndicator(matches, "Barcelona", "Real Madrid");
    expect(result.homePercent).toBeCloseTo(50);
    expect(result.awayPercent).toBeCloseTo(50);
  });

  it("adds half a draw point to each side when mixed results", () => {
    // 2 home wins, 1 away win, 1 draw => home=(2+0.5)/4=62.5, away=(1+0.5)/4=37.5
    const matches = [
      match("Barcelona"),
      match("Barcelona"),
      match("Real Madrid"),
      match("Draw"),
    ];
    const result = h2hToIndicator(matches, "Barcelona", "Real Madrid");
    expect(result.homePercent).toBeCloseTo(62.5);
    expect(result.awayPercent).toBeCloseTo(37.5);
  });

  it("home and away percents always sum to 100", () => {
    const matches = [
      match("Barcelona"),
      match("Draw"),
      match("Real Madrid"),
      match("Draw"),
      match("Barcelona"),
    ];
    const result = h2hToIndicator(matches, "Barcelona", "Real Madrid");
    expect(result.homePercent + result.awayPercent).toBeCloseTo(100);
  });

  it("sets a label and emoji on the result", () => {
    const result = h2hToIndicator([], "Barcelona", "Real Madrid");
    expect(result.label).toBeTruthy();
    expect(result.emoji).toBeTruthy();
  });
});
