import { describe, it, expect, vi } from "vitest";
import { flatKnockoutMatches, buildRoundsInOrder, groupByTie, matchesToTie, roundsTiesMap, findTieContainingTeam } from "../general/league-fixture-general-utils";
import { LeagueFixtureRound, LeagueFixturesMatch } from "../../../types";

const createMatch = (
  overrides: Partial<LeagueFixturesMatch> = {}
): LeagueFixturesMatch =>
  ({
    fixtureId: Math.random(),
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeamName: "Home",
    awayTeamName: "Away",
    date: "2024-01-01T12:00:00Z",
    isFinished: false,
    fixtureRound: "Quarter-finals",
    ...overrides,
  } as LeagueFixturesMatch);

const createRound = (
  name: string,
  matches: LeagueFixturesMatch[]
): LeagueFixtureRound =>
  ({
    name,
    days: [
      {
        matches,
      },
    ],
  } as LeagueFixtureRound);

describe("flatKnockoutMatches", () => {
  it("flattens matches across all days", () => {
    const round: LeagueFixtureRound = {
      name: "Quarter-finals",
      days: [
        { date: "", matches: [createMatch({ fixtureId: 1 })] },
        { date: "", matches: [createMatch({ fixtureId: 2 })] },
      ],
    };

    const result = flatKnockoutMatches(round);

    expect(result).toHaveLength(2);
    expect(result.map((m) => m.fixtureId)).toEqual([1, 2]);
  });

  it("returns empty array when no days exist", () => {
    const round = {
      name: "Final",
      days: [],
    } as LeagueFixtureRound;

    expect(flatKnockoutMatches(round)).toEqual([]);
  });
});

describe("buildRoundsInOrder", () => {
  it("filters out rounds not in LEAGUE_CUP_ROUNDS", () => {
    const rounds = [
      createRound("Group Stage", []),
      createRound("Quarter Finals", []),
    ];

    const result = buildRoundsInOrder(rounds);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Quarter Finals");
  });

  it("sorts rounds according to LEAGUE_CUP_ROUNDS order", () => {
    const rounds = [
      createRound("Final", []),
      createRound("Round of 16", []),
      createRound("Semi Finals", []),
    ];

    const result = buildRoundsInOrder(rounds);

    expect(result.map((r) => r.name)).toEqual([
      "Round of 16",
      "Semi Finals",
      "Final",
    ]);
  });

  it("returns empty array when no rounds match", () => {
    const rounds = [createRound("Group Stage", [])];

    expect(buildRoundsInOrder(rounds)).toEqual([]);
  });
});

describe("groupByTie", () => {
  it("groups home-away reversed matches into the same tie", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
      }),
      createMatch({
        fixtureId: 2,
        homeTeamId: 2,
        awayTeamId: 1,
      }),
    ];

    const result = groupByTie(matches);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(2);
  });

  it("creates separate groups for different ties", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        homeTeamId: 1,
        awayTeamId: 2,
      }),
      createMatch({
        fixtureId: 2,
        homeTeamId: 3,
        awayTeamId: 4,
      }),
    ];

    const result = groupByTie(matches);

    expect(result).toHaveLength(2);
  });

  it("sorts matches inside a tie by date ascending", () => {
    const matches = [
      createMatch({
        fixtureId: 1,
        date: "2024-01-10T12:00:00Z",
      }),
      createMatch({
        fixtureId: 2,
        date: "2024-01-05T12:00:00Z",
        homeTeamId: 2,
        awayTeamId: 1,
      }),
    ];

    const result = groupByTie(matches);

    expect(result[0].map((m) => m.fixtureId)).toEqual([2, 1]);
  });

  it("returns empty array when no matches are provided", () => {
    expect(groupByTie([])).toEqual([]);
  });
});

describe("matchesToTie", () => {
  it("maps a single-match tie's team fields, one leg, and aggregate equal to that leg", () => {
    const match = createMatch({
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamName: "Team A",
      homeTeamLogo: "logo-a.png",
      awayTeamName: "Team B",
      awayTeamLogo: "logo-b.png",
      homeTeamScore: 2,
      awayTeamScore: 1,
      isFinished: true,
    });

    const tie = matchesToTie([match]);

    expect(tie.t1).toBe("Team A");
    expect(tie.t1logo).toBe("logo-a.png");
    expect(tie.t2).toBe("Team B");
    expect(tie.t2logo).toBe("logo-b.png");
    expect(tie.legs).toEqual([{ t1Score: 2, t2Score: 1, isFinished: true }]);
    expect(tie.aggregate).toEqual({ t1Score: 2, t2Score: 1 });
  });

  it("includes undefined logos when not present on the match", () => {
    const match = createMatch({
      homeTeamName: "Team A",
      homeTeamLogo: undefined,
      awayTeamName: "Team B",
      awayTeamLogo: undefined,
    });

    const tie = matchesToTie([match]);

    expect(tie.t1).toBe("Team A");
    expect(tie.t2).toBe("Team B");
    expect(tie.t1logo).toBeUndefined();
    expect(tie.t2logo).toBeUndefined();
  });

  it("aggregates a two-legged tie by team ID, not by home/away column, using the real Libertadores 2025 SF reproduction (LDU 3-0 Palmeiras, Palmeiras 4-0 LDU => aggregate LDU 3-4 Palmeiras)", () => {
    const leg1 = createMatch({
      fixtureId: 1,
      homeTeamId: 100,
      awayTeamId: 200,
      homeTeamName: "LDU de Quito",
      awayTeamName: "Palmeiras",
      homeTeamScore: 3,
      awayTeamScore: 0,
      isFinished: true,
      date: "2025-10-21T23:00:00Z",
    });
    const leg2 = createMatch({
      fixtureId: 2,
      homeTeamId: 200,
      awayTeamId: 100,
      homeTeamName: "Palmeiras",
      awayTeamName: "LDU de Quito",
      homeTeamScore: 4,
      awayTeamScore: 0,
      isFinished: true,
      date: "2025-10-28T23:00:00Z",
    });

    const tie = matchesToTie([leg1, leg2]);

    expect(tie.t1).toBe("LDU de Quito");
    expect(tie.t2).toBe("Palmeiras");
    expect(tie.legs).toEqual([
      { t1Score: 3, t2Score: 0, isFinished: true },
      { t1Score: 0, t2Score: 4, isFinished: true },
    ]);
    expect(tie.aggregate).toEqual({ t1Score: 3, t2Score: 4 });
  });

  it("returns a null aggregate when any leg is not finished yet", () => {
    const leg1 = createMatch({
      fixtureId: 1,
      homeTeamId: 100,
      awayTeamId: 200,
      homeTeamScore: 1,
      awayTeamScore: 1,
      isFinished: true,
    });
    const leg2 = createMatch({
      fixtureId: 2,
      homeTeamId: 200,
      awayTeamId: 100,
      homeTeamScore: null,
      awayTeamScore: null,
      isFinished: false,
    });

    const tie = matchesToTie([leg1, leg2]);

    expect(tie.aggregate).toBeNull();
  });
});

describe("roundsTiesMap", () => {
  it("returns empty map for empty rounds array", () => {
    expect(roundsTiesMap([])).toEqual(new Map());
  });

  it("maps each round name (normalized) to its ties", () => {
    const rounds = [
      createRound("Quarter Finals", [
        createMatch({ homeTeamId: 1, awayTeamId: 2, homeTeamName: "A", awayTeamName: "B" }),
        createMatch({ homeTeamId: 3, awayTeamId: 4, homeTeamName: "C", awayTeamName: "D" }),
      ]),
    ];

    const result = roundsTiesMap(rounds);

    expect(result.get("quarter_finals")).toHaveLength(2);
  });

  it("groups two-legged matches into a single tie per pair", () => {
    const rounds = [
      createRound("Semi Finals", [
        createMatch({ fixtureId: 1, homeTeamId: 1, awayTeamId: 2, homeTeamName: "A", awayTeamName: "B", date: "2024-01-01T12:00:00Z" }),
        createMatch({ fixtureId: 2, homeTeamId: 2, awayTeamId: 1, homeTeamName: "B", awayTeamName: "A", date: "2024-01-08T12:00:00Z" }),
      ]),
    ];

    const result = roundsTiesMap(rounds);
    const ties = result.get("semi_finals");

    expect(ties).toHaveLength(1);
    expect(ties![0].t1).toBe("A");
    expect(ties![0].t2).toBe("B");
  });

  it("builds entries for multiple rounds", () => {
    const rounds = [
      createRound("Semi Finals", [
        createMatch({ homeTeamId: 1, awayTeamId: 2, homeTeamName: "A", awayTeamName: "B" }),
      ]),
      createRound("Final", [
        createMatch({ homeTeamId: 3, awayTeamId: 4, homeTeamName: "C", awayTeamName: "D" }),
      ]),
    ];

    const result = roundsTiesMap(rounds);

    expect(result.size).toBe(2);
    expect(result.get("semi_finals")).toHaveLength(1);
    expect(result.get("final")).toHaveLength(1);
  });
});

describe("findTieContainingTeam", () => {
  const makeTie = (t1: string, t2: string) => ({ t1, t2 });

  it("returns the tie when the team is t1", () => {
    const ties = [makeTie("Arsenal", "Chelsea"), makeTie("Liverpool", "City")];
    expect(findTieContainingTeam(ties, "Arsenal")).toEqual(makeTie("Arsenal", "Chelsea"));
  });

  it("returns the tie when the team is t2", () => {
    const ties = [makeTie("Arsenal", "Chelsea"), makeTie("Liverpool", "City")];
    expect(findTieContainingTeam(ties, "Chelsea")).toEqual(makeTie("Arsenal", "Chelsea"));
  });

  it("removes the matched tie from the array", () => {
    const ties = [makeTie("Arsenal", "Chelsea"), makeTie("Liverpool", "City")];
    findTieContainingTeam(ties, "Arsenal");
    expect(ties).toHaveLength(1);
    expect(ties[0]).toEqual(makeTie("Liverpool", "City"));
  });

  it("returns null when no tie matches", () => {
    const ties = [makeTie("Arsenal", "Chelsea")];
    expect(findTieContainingTeam(ties, "Barcelona")).toBeNull();
  });

  it("returns null for empty ties array", () => {
    expect(findTieContainingTeam([], "Arsenal")).toBeNull();
  });
});
