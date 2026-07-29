import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBracketGame } from "./bracket-game";
import { LeagueFixture } from "../../types";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

const createFixture = (
  rounds: { name: string; matches: { homeTeamName: string; awayTeamName: string }[] }[],
): LeagueFixture =>
  ({
    currentRoundIndex: 0,
    totalRounds: rounds.length,
    rounds: rounds.map(({ name, matches }) => ({
      name,
      days: [{ date: "2024-01-01", matches }],
    })),
  }) as LeagueFixture;

const sfFixture = createFixture([
  {
    name: "Semi Finals",
    matches: [
      { homeTeamName: "Arsenal", awayTeamName: "Liverpool" },
      { homeTeamName: "Chelsea", awayTeamName: "City" },
    ],
  },
  {
    name: "Final",
    matches: [{ homeTeamName: "Arsenal", awayTeamName: "Chelsea" }],
  },
]);

const qfFixture = createFixture([
  {
    name: "Quarter Finals",
    matches: [
      { homeTeamName: "A", awayTeamName: "B" },
      { homeTeamName: "C", awayTeamName: "D" },
      { homeTeamName: "E", awayTeamName: "F" },
      { homeTeamName: "G", awayTeamName: "H" },
    ],
  },
  {
    name: "Semi Finals",
    matches: [
      { homeTeamName: "A", awayTeamName: "C" },
      { homeTeamName: "E", awayTeamName: "G" },
    ],
  },
  {
    name: "Final",
    matches: [{ homeTeamName: "A", awayTeamName: "E" }],
  },
]);

describe("useBracketGame", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("initialization", () => {
    it("derives leafRound from the earliest knockout round", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      expect(result.current.leafRound).toBe("semi_finals");
    });

    it("derives leafRound as quarter_finals for QF fixture", () => {
      const { result } = renderHook(() => useBracketGame(qfFixture, "League"));
      expect(result.current.leafRound).toBe("quarter_finals");
    });

    it("extracts unique sorted teams from fixtures", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      expect(result.current.teams).toEqual(["Arsenal", "Chelsea", "City", "Liverpool"]);
    });

    it("starts with empty picks", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      expect(result.current.picks).toEqual({});
    });

    it("returns null leafRound when no knockout rounds exist", () => {
      const fixture = createFixture([{ name: "Group Stage", matches: [] }]);
      const { result } = renderHook(() => useBracketGame(fixture, "League"));
      expect(result.current.leafRound).toBeNull();
    });
  });

  describe("setPick", () => {
    it("sets a team into a slot", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("semi_finals-0-t1", "Arsenal"));

      expect(result.current.picks["semi_finals-0-t1"]).toBe("Arsenal");
    });

    it("overwrites an existing pick", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("semi_finals-0-t1", "Arsenal"));
      act(() => result.current.setPick("semi_finals-0-t1", "Chelsea"));

      expect(result.current.picks["semi_finals-0-t1"]).toBe("Chelsea");
    });

    it("preserves other picks when setting a new one", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("semi_finals-0-t1", "Arsenal"));
      act(() => result.current.setPick("semi_finals-0-t2", "Liverpool"));

      expect(result.current.picks["semi_finals-0-t1"]).toBe("Arsenal");
      expect(result.current.picks["semi_finals-0-t2"]).toBe("Liverpool");
    });

    it("allows setting an emoji-decorated team name", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("final-0-t1", "🏆 Arsenal"));

      expect(result.current.picks["final-0-t1"]).toBe("🏆 Arsenal");
    });
  });

  describe("clearPick", () => {
    it("removes a pick from the map", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("semi_finals-0-t1", "Arsenal"));
      act(() => result.current.clearPick("semi_finals-0-t1"));

      expect(result.current.picks["semi_finals-0-t1"]).toBeUndefined();
    });

    it("does nothing when clearing a non-existent pick", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.clearPick("semi_finals-0-t1"));

      expect(result.current.picks).toEqual({});
    });

    it("preserves other picks when clearing one", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => result.current.setPick("semi_finals-0-t1", "Arsenal"));
      act(() => result.current.setPick("semi_finals-0-t2", "Liverpool"));
      act(() => result.current.clearPick("semi_finals-0-t1"));

      expect(result.current.picks["semi_finals-0-t1"]).toBeUndefined();
      expect(result.current.picks["semi_finals-0-t2"]).toBe("Liverpool");
    });
  });

  describe("buildTree", () => {
    it("returns a BracketNode tree with all ties null when picks is empty", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      const tree = result.current.buildTree();

      expect(tree).not.toBeNull();
      expect(tree!.roundKey).toBe("final");
      expect(tree!.tie).toBeNull();
      expect(tree!.left?.tie).toBeNull();
      expect(tree!.right?.tie).toBeNull();
    });

    it("returns null when leafRound is null", () => {
      const fixture = createFixture([{ name: "Group Stage", matches: [] }]);
      const { result } = renderHook(() => useBracketGame(fixture, "League"));
      const tree = result.current.buildTree();

      expect(tree).toBeNull();
    });

    it("builds a tree reflecting current picks", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));

      act(() => {
        result.current.setPick("semi_finals-0-t1", "Arsenal");
        result.current.setPick("semi_finals-0-t2", "Liverpool");
        result.current.setPick("final-0-t1", "Arsenal");
      });

      const tree = result.current.buildTree();
      expect(tree!.left?.tie).toEqual({ t1: "Arsenal", t2: "Liverpool", legs: [], aggregate: null });
      expect(tree!.tie).toEqual({ t1: "Arsenal", t2: "", legs: [], aggregate: null });
    });
  });

  describe("slot computation", () => {
    it("provides the total number of leaf match slots", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      expect(result.current.totalLeafSlots).toBe(2);
    });

    it("provides 4 leaf slots for QF fixture", () => {
      const { result } = renderHook(() => useBracketGame(qfFixture, "League"));
      expect(result.current.totalLeafSlots).toBe(4);
    });

    it("returns 0 leaf slots when no knockout rounds", () => {
      const fixture = createFixture([{ name: "Group Stage", matches: [] }]);
      const { result } = renderHook(() => useBracketGame(fixture, "League"));
      expect(result.current.totalLeafSlots).toBe(0);
    });
  });

  describe("round labels", () => {
    it("provides ordered round keys from leaf to final", () => {
      const { result } = renderHook(() => useBracketGame(sfFixture, "League"));
      expect(result.current.roundKeys).toEqual(["semi_finals", "final"]);
    });

    it("provides 3 round keys for QF fixture", () => {
      const { result } = renderHook(() => useBracketGame(qfFixture, "League"));
      expect(result.current.roundKeys).toEqual(["quarter_finals", "semi_finals", "final"]);
    });

    it("returns empty array when no knockout rounds", () => {
      const fixture = createFixture([{ name: "Group Stage", matches: [] }]);
      const { result } = renderHook(() => useBracketGame(fixture, "League"));
      expect(result.current.roundKeys).toEqual([]);
    });
  });
});
