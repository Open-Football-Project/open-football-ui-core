import { describe, it, expect } from "vitest";
import { buildBracketFromPicks, extractUniqueTeams, BracketPicks } from "./bracket-picks";
import { collectRounds } from "../../../svg-hooks/league-knockouts/league-knockouts-svg";

// LEAGUE_CUP_ROUNDS = ["round_of_32", "round_of_16", "quarter_finals", "semi_finals", "final"]
// Tree mapping for match indices (e.g. QF with 4 matches):
//   index 0 → final.left.left
//   index 1 → final.left.right
//   index 2 → final.right.left
//   index 3 → final.right.right

describe("buildBracketFromPicks", () => {
  describe("tree structure", () => {
    it("builds a 2-level tree when leafRound is semi_finals (4 teams)", () => {
      const tree = buildBracketFromPicks({}, "semi_finals");
      expect(tree.roundKey).toBe("final");
      expect(tree.left?.roundKey).toBe("semi_finals");
      expect(tree.right?.roundKey).toBe("semi_finals");
      expect(tree.left?.left).toBeUndefined();
      expect(tree.right?.left).toBeUndefined();
    });

    it("builds a 3-level tree when leafRound is quarter_finals (8 teams)", () => {
      const tree = buildBracketFromPicks({}, "quarter_finals");
      expect(tree.roundKey).toBe("final");
      expect(tree.left?.roundKey).toBe("semi_finals");
      expect(tree.right?.roundKey).toBe("semi_finals");
      expect(tree.left?.left?.roundKey).toBe("quarter_finals");
      expect(tree.left?.right?.roundKey).toBe("quarter_finals");
      expect(tree.right?.left?.roundKey).toBe("quarter_finals");
      expect(tree.right?.right?.roundKey).toBe("quarter_finals");
    });

    it("builds a 4-level tree when leafRound is round_of_16 (16 teams)", () => {
      const tree = buildBracketFromPicks({}, "round_of_16");
      expect(tree.roundKey).toBe("final");
      const r16Node = tree.left?.left?.left;
      expect(r16Node?.roundKey).toBe("round_of_16");
    });

    it("builds a 5-level tree when leafRound is round_of_32 (32 teams)", () => {
      const tree = buildBracketFromPicks({}, "round_of_32");
      expect(tree.roundKey).toBe("final");
      const r32Node = tree.left?.left?.left?.left;
      expect(r32Node?.roundKey).toBe("round_of_32");
    });

    it("leaf nodes have no children", () => {
      const tree = buildBracketFromPicks({}, "quarter_finals");
      const leaf = tree.left?.left;
      expect(leaf?.roundKey).toBe("quarter_finals");
      expect(leaf?.left).toBeUndefined();
      expect(leaf?.right).toBeUndefined();
    });

    it("has correct number of leaf nodes (8 for QF)", () => {
      const tree = buildBracketFromPicks({}, "quarter_finals");
      const rounds = collectRounds(tree);
      const qf = rounds.find(r => r.key === "quarter_finals")!;
      expect(qf.nodes).toHaveLength(4);
    });
  });

  describe("empty picks", () => {
    it("all ties are null when picks is empty", () => {
      const tree = buildBracketFromPicks({}, "semi_finals");
      expect(tree.tie).toBeNull();
      expect(tree.left?.tie).toBeNull();
      expect(tree.right?.tie).toBeNull();
    });

    it("missingData is false for all nodes when picks is empty", () => {
      const tree = buildBracketFromPicks({}, "semi_finals");
      expect(tree.missingData).toBe(false);
      expect(tree.left?.missingData).toBe(false);
      expect(tree.right?.missingData).toBe(false);
    });
  });

  describe("filling picks", () => {
    it("creates a tie when both t1 and t2 are filled for a match", () => {
      const picks: BracketPicks = {
        "final-0-t1": "Real Madrid",
        "final-0-t2": "Barcelona",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toEqual({ t1: "Real Madrid", t2: "Barcelona", legs: [], aggregate: null });
    });

    it("creates a tie with empty t2 when only t1 is filled", () => {
      const picks: BracketPicks = {
        "final-0-t1": "Real Madrid",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toEqual({ t1: "Real Madrid", t2: "", legs: [], aggregate: null });
    });

    it("creates a tie with empty t1 when only t2 is filled", () => {
      const picks: BracketPicks = {
        "final-0-t2": "Barcelona",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toEqual({ t1: "", t2: "Barcelona", legs: [], aggregate: null });
    });

    it("leaves tie null when neither t1 nor t2 is set", () => {
      const picks: BracketPicks = {
        "semi_finals-0-t1": "Bayern",
        "semi_finals-0-t2": "Dortmund",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toBeNull(); // final has no picks
      expect(tree.left?.tie).toEqual({ t1: "Bayern", t2: "Dortmund", legs: [], aggregate: null });
    });

    it("treats null values in picks as absent (no tie created)", () => {
      const picks: BracketPicks = {
        "final-0-t1": null,
        "final-0-t2": null,
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toBeNull();
    });

    it("creates a tie when one value is set and the other is null", () => {
      const picks: BracketPicks = {
        "final-0-t1": null,
        "final-0-t2": "Barcelona",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.tie).toEqual({ t1: "", t2: "Barcelona", legs: [], aggregate: null });
    });

    it("handles picks across multiple rounds simultaneously", () => {
      const picks: BracketPicks = {
        "semi_finals-0-t1": "Real Madrid",
        "semi_finals-0-t2": "Bayern",
        "final-0-t1": "Real Madrid",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      expect(tree.left?.tie).toEqual({ t1: "Real Madrid", t2: "Bayern", legs: [], aggregate: null });
      expect(tree.tie).toEqual({ t1: "Real Madrid", t2: "", legs: [], aggregate: null });
    });

    it("leaves other matches empty when only one match is filled", () => {
      const picks: BracketPicks = {
        "quarter_finals-0-t1": "Bayern",
        "quarter_finals-0-t2": "Dortmund",
      };
      const tree = buildBracketFromPicks(picks, "quarter_finals");
      expect(tree.left?.left?.tie).toEqual({ t1: "Bayern", t2: "Dortmund", legs: [], aggregate: null });
      expect(tree.left?.right?.tie).toBeNull();
      expect(tree.right?.left?.tie).toBeNull();
      expect(tree.right?.right?.tie).toBeNull();
      expect(tree.left?.tie).toBeNull();
      expect(tree.tie).toBeNull();
    });
  });

  describe("match indexing", () => {
    it("maps match index 0 to left-left subtree", () => {
      const picks: BracketPicks = { "quarter_finals-0-t1": "A", "quarter_finals-0-t2": "B" };
      const tree = buildBracketFromPicks(picks, "quarter_finals");
      expect(tree.left?.left?.tie).toEqual({ t1: "A", t2: "B", legs: [], aggregate: null });
    });

    it("maps match index 1 to left-right subtree", () => {
      const picks: BracketPicks = { "quarter_finals-1-t1": "C", "quarter_finals-1-t2": "D" };
      const tree = buildBracketFromPicks(picks, "quarter_finals");
      expect(tree.left?.right?.tie).toEqual({ t1: "C", t2: "D", legs: [], aggregate: null });
    });

    it("maps match index 2 to right-left subtree", () => {
      const picks: BracketPicks = { "quarter_finals-2-t1": "E", "quarter_finals-2-t2": "F" };
      const tree = buildBracketFromPicks(picks, "quarter_finals");
      expect(tree.right?.left?.tie).toEqual({ t1: "E", t2: "F", legs: [], aggregate: null });
    });

    it("maps match index 3 to right-right subtree", () => {
      const picks: BracketPicks = { "quarter_finals-3-t1": "G", "quarter_finals-3-t2": "H" };
      const tree = buildBracketFromPicks(picks, "quarter_finals");
      expect(tree.right?.right?.tie).toEqual({ t1: "G", t2: "H", legs: [], aggregate: null });
    });

    it("maps R16 indices correctly in a 4-level tree", () => {
      const picks: BracketPicks = { "round_of_16-5-t1": "X", "round_of_16-5-t2": "Y" };
      const tree = buildBracketFromPicks(picks, "round_of_16");
      // Index 5 in 8 matches: binary 101 → right(1), left(0), right(1)
      const node = tree.right?.left?.right;
      expect(node?.tie).toEqual({ t1: "X", t2: "Y", legs: [], aggregate: null });
    });
  });

  describe("SVG pipeline compatibility", () => {
    it("produced tree works with collectRounds", () => {
      const picks: BracketPicks = {
        "semi_finals-0-t1": "A",
        "semi_finals-0-t2": "B",
        "semi_finals-1-t1": "C",
        "semi_finals-1-t2": "D",
        "final-0-t1": "A",
        "final-0-t2": "C",
      };
      const tree = buildBracketFromPicks(picks, "semi_finals");
      const rounds = collectRounds(tree);
      expect(rounds).toHaveLength(2);
      expect(rounds[0].key).toBe("semi_finals");
      expect(rounds[0].nodes).toHaveLength(2);
      expect(rounds[1].key).toBe("final");
      expect(rounds[1].nodes).toHaveLength(1);
    });

    it("empty tree works with collectRounds without crashing", () => {
      const tree = buildBracketFromPicks({}, "quarter_finals");
      const rounds = collectRounds(tree);
      expect(rounds).toHaveLength(3);
    });
  });
});

describe("extractUniqueTeams", () => {
  it("returns empty array for empty fixtures", () => {
    expect(extractUniqueTeams({ rounds: [] } as any)).toEqual([]);
  });

  it("returns unique team names from fixtures", () => {
    const fixtures = {
      rounds: [{
        name: "Quarter-finals",
        days: [{
          date: "2024-01-01",
          matches: [
            { homeTeamName: "Real Madrid", awayTeamName: "Barcelona" },
            { homeTeamName: "Bayern", awayTeamName: "Real Madrid" },
          ],
        }],
      }],
    };
    const teams = extractUniqueTeams(fixtures as any);
    expect(teams).toHaveLength(3);
    expect(teams).toContain("Real Madrid");
    expect(teams).toContain("Barcelona");
    expect(teams).toContain("Bayern");
  });

  it("returns teams sorted alphabetically", () => {
    const fixtures = {
      rounds: [{
        name: "Semi-finals",
        days: [{
          date: "2024-01-01",
          matches: [
            { homeTeamName: "Zebras FC", awayTeamName: "Ajax" },
            { homeTeamName: "Milan", awayTeamName: "Bayern" },
          ],
        }],
      }],
    };
    const teams = extractUniqueTeams(fixtures as any);
    expect(teams).toEqual(["Ajax", "Bayern", "Milan", "Zebras FC"]);
  });

  it("collects teams across multiple rounds", () => {
    const fixtures = {
      rounds: [
        {
          name: "Quarter-finals",
          days: [{ date: "2024-01-01", matches: [{ homeTeamName: "A", awayTeamName: "B" }] }],
        },
        {
          name: "Semi-finals",
          days: [{ date: "2024-01-02", matches: [{ homeTeamName: "C", awayTeamName: "D" }] }],
        },
      ],
    };
    const teams = extractUniqueTeams(fixtures as any);
    expect(teams).toEqual(["A", "B", "C", "D"]);
  });

  it("collects teams across multiple days", () => {
    const fixtures = {
      rounds: [{
        name: "Quarter-finals",
        days: [
          { date: "2024-01-01", matches: [{ homeTeamName: "A", awayTeamName: "B" }] },
          { date: "2024-01-02", matches: [{ homeTeamName: "C", awayTeamName: "D" }] },
        ],
      }],
    };
    const teams = extractUniqueTeams(fixtures as any);
    expect(teams).toEqual(["A", "B", "C", "D"]);
  });

  it("excludes teams from non-knockout rounds", () => {
    const fixtures = {
      rounds: [
        {
          name: "3rd Round",
          days: [{ date: "2024-01-01", matches: [
            { homeTeamName: "EarlyTeam1", awayTeamName: "EarlyTeam2" },
            { homeTeamName: "EarlyTeam3", awayTeamName: "EarlyTeam4" },
          ] }],
        },
        {
          name: "Round of 32",
          days: [{ date: "2024-02-01", matches: [
            { homeTeamName: "Arsenal", awayTeamName: "Chelsea" },
          ] }],
        },
        {
          name: "Quarter-finals",
          days: [{ date: "2024-03-01", matches: [
            { homeTeamName: "Arsenal", awayTeamName: "Liverpool" },
          ] }],
        },
      ],
    };
    const teams = extractUniqueTeams(fixtures as any);
    expect(teams).toEqual(["Arsenal", "Chelsea", "Liverpool"]);
    expect(teams).not.toContain("EarlyTeam1");
    expect(teams).not.toContain("EarlyTeam2");
    expect(teams).not.toContain("EarlyTeam3");
    expect(teams).not.toContain("EarlyTeam4");
  });
});
