import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { LeagueFixture, LeagueFixturesMatch } from "../../../types";

import { useLeagueFixtureBinaryTree } from "./league-fixture-binary-tree";

const createMatch = (
  homeTeamId: number,
  awayTeamId: number,
  homeTeamName: string,
  awayTeamName: string,
  overrides: Partial<LeagueFixturesMatch> = {}
): LeagueFixturesMatch =>
  ({
    fixtureId: Math.random(),
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    date: "2024-01-01T12:00:00Z",
    isFinished: false,
    fixtureRound: "",
    ...overrides,
  } as LeagueFixturesMatch);

const createFixture = (rounds: { name: string; matches: LeagueFixturesMatch[] }[]): LeagueFixture =>
  ({
    currentRoundIndex: 0,
    totalRounds: rounds.length,
    rounds: rounds.map(({ name, matches }) => ({
      name,
      days: [{ date: "", matches }],
    })),
  } as LeagueFixture);

describe("useLeagueFixtureBinaryTree", () => {
  it("returns null when fixtures has no valid knockout rounds", () => {
    const fixture = createFixture([{ name: "Group Stage", matches: [] }]);
    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    expect(result.current).toBeNull();
  });

  it("returns null when rounds array is empty", () => {
    const fixture = createFixture([]);
    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    expect(result.current).toBeNull();
  });

  it("returns a root node with the final tie when only the final round is present", () => {
    const fixture = createFixture([
      { name: "Final", matches: [createMatch(1, 2, "Arsenal", "Chelsea")] },
    ]);
    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));

    expect(result.current).not.toBeNull();
    expect(result.current!.roundKey).toBe("final");
    expect(result.current!.tie).toEqual(expect.objectContaining({ t1: "Arsenal", t2: "Chelsea" }));
    expect(result.current!.missingData).toBe(false);
    expect(result.current!.left).toBeUndefined();
    expect(result.current!.right).toBeUndefined();
  });

  it("builds a two-level tree from final + semi finals", () => {
    const fixture = createFixture([
      {
        name: "Semi Finals",
        matches: [
          createMatch(1, 3, "Arsenal", "Liverpool"),
          createMatch(2, 4, "Chelsea", "City"),
        ],
      },
      {
        name: "Final",
        matches: [createMatch(1, 2, "Arsenal", "Chelsea")],
      },
    ]);

    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    const root = result.current!;

    expect(root.roundKey).toBe("final");
    expect(root.tie).toEqual(expect.objectContaining({ t1: "Arsenal", t2: "Chelsea" }));

    expect(root.left!.roundKey).toBe("semi_finals");
    expect(root.left!.tie).toEqual(expect.objectContaining({ t1: "Arsenal", t2: "Liverpool" }));
    expect(root.left!.missingData).toBe(false);

    expect(root.right!.roundKey).toBe("semi_finals");
    expect(root.right!.tie).toEqual(expect.objectContaining({ t1: "Chelsea", t2: "City" }));
    expect(root.right!.missingData).toBe(false);
  });

  it("sets missingData=true on a child when its team is not found in the previous round", () => {
    const fixture = createFixture([
      {
        name: "Semi Finals",
        matches: [

          createMatch(1, 3, "Arsenal", "Liverpool"),
        ],
      },
      {
        name: "Final",
        matches: [createMatch(1, 2, "Arsenal", "Chelsea")],
      },
    ]);

    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    const root = result.current!;

    const arsnalSide = [root.left!, root.right!].find((n) => !n.missingData);
    const missingSide = [root.left!, root.right!].find((n) => n.missingData);

    expect(arsnalSide).toBeDefined();
    expect(arsnalSide!.tie).toEqual(expect.objectContaining({ t1: "Arsenal" }));

    expect(missingSide).toBeDefined();
    expect(missingSide!.tie).toBeNull();
  });

  it("returns null when a round has more ties than a single bracket allows", () => {
    const fixture = createFixture([
      {
        name: "Final",
        matches: [
          createMatch(1, 2, "Arsenal", "Chelsea"),
          createMatch(3, 4, "City", "Liverpool"),
        ],
      },
    ]);
    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    expect(result.current).toBeNull();
  });

  it("builds a three-level tree from QF + SF + Final", () => {
    const fixture = createFixture([
      {
        name: "Quarter Finals",
        matches: [
          createMatch(10, 11, "T10", "T11"),
          createMatch(12, 13, "T12", "T13"),
          createMatch(20, 21, "T20", "T21"),
          createMatch(22, 23, "T22", "T23"),
        ],
      },
      {
        name: "Semi Finals",
        matches: [
          createMatch(10, 12, "T10", "T12"),
          createMatch(20, 22, "T20", "T22"),
        ],
      },
      {
        name: "Final",
        matches: [createMatch(10, 20, "T10", "T20")],
      },
    ]);

    const { result } = renderHook(() => useLeagueFixtureBinaryTree(fixture));
    const root = result.current!;

    expect(root.roundKey).toBe("final");
    expect(root.left!.roundKey).toBe("semi_finals");
    expect(root.right!.roundKey).toBe("semi_finals");
    expect(root.left!.left!.roundKey).toBe("quarter_finals");
    expect(root.left!.right!.roundKey).toBe("quarter_finals");
    expect(root.right!.left!.roundKey).toBe("quarter_finals");
    expect(root.right!.right!.roundKey).toBe("quarter_finals");
  });
});
