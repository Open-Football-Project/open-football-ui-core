import { describe, it, expect } from "vitest";
import { sortLeagueFixturesMatch, sanitizeLiveChartPoints } from "./sorting";
import { LeagueFixturesMatch, LiveChartPoint } from "../../types";

describe("sortLeagueFixturesMatch", () => {
  it("returns an empty array for empty input", () => {
    expect(sortLeagueFixturesMatch([])).toEqual([]);
  });

  it("returns a single item unchanged", () => {
    const matches: LeagueFixturesMatch[] = [
      {
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        date: "2026-02-21T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ];

    expect(sortLeagueFixturesMatch(matches)).toEqual(matches);
  });

  it("sorts matches in chronological order by date", () => {
    const matches: LeagueFixturesMatch[] = [
      {
        fixtureId: 3,
        homeTeamId: 5,
        awayTeamId: 6,
        homeTeamName: "Team E",
        awayTeamName: "Team F",
        date: "2026-02-23T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        date: "2026-02-21T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeamName: "Team C",
        awayTeamName: "Team D",
        date: "2026-02-22T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ];

    const sorted = sortLeagueFixturesMatch(matches);

    expect(sorted[0].fixtureId).toBe(1);
    expect(sorted[1].fixtureId).toBe(2);
    expect(sorted[2].fixtureId).toBe(3);
  });

  it("sorts matches with different times on the same day", () => {
    const matches: LeagueFixturesMatch[] = [
      {
        fixtureId: 3,
        homeTeamId: 5,
        awayTeamId: 6,
        homeTeamName: "Team E",
        awayTeamName: "Team F",
        date: "2026-02-21T18:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        date: "2026-02-21T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeamName: "Team C",
        awayTeamName: "Team D",
        date: "2026-02-21T16:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ];

    const sorted = sortLeagueFixturesMatch(matches);

    expect(sorted[0].fixtureId).toBe(1);
    expect(sorted[1].fixtureId).toBe(2);
    expect(sorted[2].fixtureId).toBe(3);
  });

  it("does not mutate the original array", () => {
    const matches: LeagueFixturesMatch[] = [
      {
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeamName: "Team C",
        awayTeamName: "Team D",
        date: "2026-02-22T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        date: "2026-02-21T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ];

    const originalOrder = [...matches];
    sortLeagueFixturesMatch(matches);

    expect(matches).toEqual(originalOrder);
  });

  it("handles invalid dates gracefully", () => {
    const matches: LeagueFixturesMatch[] = [
      {
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamName: "Team A",
        awayTeamName: "Team B",
        date: "invalid-date",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
      {
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
        homeTeamName: "Team C",
        awayTeamName: "Team D",
        date: "2026-02-21T15:00:00Z",
        isFinished: false,
        fixtureRound: "Round 1",
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ];

    expect(() => sortLeagueFixturesMatch(matches)).not.toThrow();
    expect(sortLeagueFixturesMatch(matches)).toHaveLength(2);
  });
});

describe("sanitizeLiveChartPoints", () => {
  const point = (minute: number, capturedAt: string, value = 50): LiveChartPoint => ({
    minute,
    value,
    capturedAt,
  });

  it("returns empty array for empty input", () => {
    expect(sanitizeLiveChartPoints([])).toEqual([]);
  });

  it("returns a single point unchanged", () => {
    const p = point(10, "2026-06-30T20:10:00Z");
    expect(sanitizeLiveChartPoints([p])).toEqual([p]);
  });

  it("sorts points by capturedAt ascending", () => {
    const p1 = point(10, "2026-06-30T20:10:00Z");
    const p2 = point(20, "2026-06-30T20:13:00Z");
    const p3 = point(30, "2026-06-30T20:16:00Z");
    expect(sanitizeLiveChartPoints([p3, p1, p2])).toEqual([p1, p2, p3]);
  });

  it("drops a point whose minute moves backward after sorting by capturedAt", () => {
    const p1 = point(90, "2026-06-30T20:45:00Z");
    const p2 = point(0, "2026-06-30T20:48:00Z");
    const p3 = point(97, "2026-06-30T20:51:00Z");
    expect(sanitizeLiveChartPoints([p1, p2, p3])).toEqual([p1, p3]);
  });

  it("drops a point whose minute equals the previous minute", () => {
    const p1 = point(45, "2026-06-30T20:45:00Z");
    const p2 = point(45, "2026-06-30T20:48:00Z");
    expect(sanitizeLiveChartPoints([p1, p2])).toEqual([p1]);
  });

  it("does not mutate the original array", () => {
    const points = [point(30, "2026-06-30T20:16:00Z"), point(10, "2026-06-30T20:10:00Z")];
    const original = [...points];
    sanitizeLiveChartPoints(points);
    expect(points).toEqual(original);
  });
});
