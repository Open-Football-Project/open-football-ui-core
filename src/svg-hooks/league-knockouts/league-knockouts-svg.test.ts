import { describe, it, expect } from "vitest";
import {
  collectRounds,
  buildBracketSvgString,
  SVG_W,
  RoundLayout,
} from "./league-knockouts-svg";
import { BracketNode } from "../../utils/league-fixture/general/league-fixture-general-utils";

const makeNode = (roundKey: string, overrides: Partial<BracketNode> = {}): BracketNode => ({
  roundKey,
  tie: null,
  missingData: false,
  ...overrides,
});

const makeTieNode = (roundKey: string, t1: string, t2: string, logos = false): BracketNode => ({
  roundKey,
  tie: {
    t1,
    t2,
    ...(logos ? { t1logo: "logo1.png", t2logo: "logo2.png" } : {}),
  },
  missingData: false,
});

const t = (key: string, opts?: Record<string, unknown>): string =>
  (opts as { defaultValue?: string })?.defaultValue ?? key;

describe("collectRounds", () => {
  it("returns a single round for a leaf node", () => {
    const node = makeNode("final");
    const rounds = collectRounds(node);
    expect(rounds).toHaveLength(1);
    expect(rounds[0].key).toBe("final");
    expect(rounds[0].nodes).toHaveLength(1);
  });

  it("collects all rounds from a tree in leaf-first order", () => {
    const root = makeNode("final", {
      left: makeNode("semi_finals"),
      right: makeNode("semi_finals"),
    });
    const rounds = collectRounds(root);
    expect(rounds).toHaveLength(2);
    expect(rounds[0].key).toBe("semi_finals");
    expect(rounds[1].key).toBe("final");
  });

  it("groups multiple nodes with the same roundKey together", () => {
    const root = makeNode("final", {
      left: makeNode("semi_finals"),
      right: makeNode("semi_finals"),
    });
    const rounds = collectRounds(root);
    const semis = rounds.find((r) => r.key === "semi_finals")!;
    expect(semis.nodes).toHaveLength(2);
  });

  it("handles a deeper tree with quarter-finals, semi-finals, final", () => {
    const root = makeNode("final", {
      left: makeNode("semi_finals", {
        left: makeNode("quarter_finals"),
        right: makeNode("quarter_finals"),
      }),
      right: makeNode("semi_finals", {
        left: makeNode("quarter_finals"),
        right: makeNode("quarter_finals"),
      }),
    });
    const rounds = collectRounds(root);
    expect(rounds).toHaveLength(3);
    const qf = rounds.find((r) => r.key === "quarter_finals")!;
    expect(qf.nodes).toHaveLength(4);
    const sf = rounds.find((r) => r.key === "semi_finals")!;
    expect(sf.nodes).toHaveLength(2);
  });
});

describe("buildBracketSvgString", () => {
  const singleRound: RoundLayout[] = [
    { key: "final", nodes: [makeTieNode("final", "Team A", "Team B")] },
  ];

  it("returns a string starting with <svg", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "Test League", t);
    expect(svg.trim()).toMatch(/^<svg /);
  });

  it("includes the league name in the output", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "Champions League", t);
    expect(svg).toContain("Champions League");
  });

  it("escapes HTML special chars in the league name", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "A & B <Cup>", t);
    expect(svg).toContain("A &amp; B &lt;Cup&gt;");
    expect(svg).not.toContain("A & B <Cup>");
  });

  it("includes the round label for each round", () => {
    const rounds: RoundLayout[] = [
      { key: "semi_finals", nodes: [makeTieNode("semi_finals", "A", "B"), makeTieNode("semi_finals", "C", "D")] },
      { key: "final", nodes: [makeTieNode("final", "A", "C")] },
    ];
    const svg = buildBracketSvgString(rounds, 2, 600, "League", t);
    expect(svg).toContain("semi finals");
    expect(svg).toContain("final");
  });

  it("uses the SVG_W constant for the svg width attribute", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", t);
    expect(svg).toContain(`width="${SVG_W}"`);
  });

  it("uses the passed svgH for the svg height attribute", () => {
    const svg = buildBracketSvgString(singleRound, 1, 999, "L", t);
    expect(svg).toContain(`height="999"`);
  });

  it("renders team names in cards when tie is present", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", t);
    expect(svg).toContain("Team A");
    expect(svg).toContain("Team B");
  });

  it("truncates long team names with ellipsis", () => {
    const longName = "A".repeat(30);
    const rounds: RoundLayout[] = [
      { key: "final", nodes: [makeTieNode("final", longName, "B")] },
    ];
    const svg = buildBracketSvgString(rounds, 1, 400, "L", t);
    expect(svg).toContain("…");
    expect(svg).not.toContain(longName);
  });

  it("escapes HTML special chars in team names", () => {
    const rounds: RoundLayout[] = [
      { key: "final", nodes: [makeTieNode("final", "A & B", "C < D")] },
    ];
    const svg = buildBracketSvgString(rounds, 1, 400, "L", t);
    expect(svg).toContain("A &amp; B");
    expect(svg).toContain("C &lt; D");
  });

  it("renders placeholder when tie is null and missingData is true", () => {
    const rounds: RoundLayout[] = [
      { key: "final", nodes: [makeNode("final", { missingData: true })] },
    ];
    const svg = buildBracketSvgString(rounds, 1, 400, "L", t);
    expect(svg).toContain("–");
  });

  it("renders ? placeholder when tie is null and missingData is false", () => {
    const rounds: RoundLayout[] = [
      { key: "final", nodes: [makeNode("final", { tie: null, missingData: false })] },
    ];
    const svg = buildBracketSvgString(rounds, 1, 400, "L", t);
    expect(svg).toContain("?");
  });

  it("renders logo images when tie has logos", () => {
    const rounds: RoundLayout[] = [
      { key: "final", nodes: [makeTieNode("final", "A", "B", true)] },
    ];
    const svg = buildBracketSvgString(rounds, 1, 400, "L", t);
    expect(svg).toContain('href="logo1.png"');
    expect(svg).toContain('href="logo2.png"');
  });

  it("omits logo images when tie has no logos", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", t);
    expect(svg).not.toContain("<image");
  });

  it("draws connector lines between rounds", () => {
    const rounds: RoundLayout[] = [
      { key: "semi_finals", nodes: [makeTieNode("semi_finals", "A", "B"), makeTieNode("semi_finals", "C", "D")] },
      { key: "final", nodes: [makeTieNode("final", "A", "C")] },
    ];
    const svg = buildBracketSvgString(rounds, 2, 600, "L", t);
    expect(svg).toContain("<line");
    expect(svg).toContain('stroke="#FF6B00"');
  });

  it("does not draw orange connector lines for a single-round bracket", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", t);
    // Card dividers use #1e293b; orange (#FF6B00) lines only appear between rounds
    const orangeLines = svg.match(/<line[^>]*stroke="#FF6B00"/g);
    expect(orangeLines).toBeNull();
  });

  it("includes the footer with footballproject.org", () => {
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", t);
    expect(svg).toContain("footballproject.org");
  });

  it("uses the t function for round labels", () => {
    const customT = (key: string) => (key === "fixtures.final" ? "FINALE" : key);
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", customT);
    expect(svg).toContain("FINALE");
  });

  it("uses the t function for the bracket header", () => {
    const customT = (key: string) => (key === "knockout.brackets" ? "Bracket Header" : key);
    const svg = buildBracketSvgString(singleRound, 1, 400, "L", customT);
    expect(svg).toContain("Bracket Header");
  });
});

describe("buildBracketSvgString with showScores", () => {
  const makeScoredTieNode = (
    roundKey: string,
    t1: string,
    t2: string,
    legs: { t1Score: number | null; t2Score: number | null; isFinished: boolean }[],
    aggregate: { t1Score: number; t2Score: number } | null,
  ): BracketNode => ({
    roundKey,
    tie: { t1, t2, legs, aggregate },
    missingData: false,
  });

  const decidedOneLegged: RoundLayout[] = [
    {
      key: "final",
      nodes: [
        makeScoredTieNode(
          "final",
          "Palmeiras",
          "Flamengo",
          [{ t1Score: 2, t2Score: 1, isFinished: true }],
          { t1Score: 2, t2Score: 1 },
        ),
      ],
    },
  ];

  const undecidedOneLegged: RoundLayout[] = [
    {
      key: "final",
      nodes: [
        makeScoredTieNode(
          "final",
          "Palmeiras",
          "Flamengo",
          [{ t1Score: null, t2Score: null, isFinished: false }],
          null,
        ),
      ],
    },
  ];

  const decidedTwoLegged: RoundLayout[] = [
    {
      key: "semi_finals",
      nodes: [
        makeScoredTieNode(
          "semi_finals",
          "LDU de Quito",
          "Palmeiras",
          [
            { t1Score: 3, t2Score: 0, isFinished: true },
            { t1Score: 0, t2Score: 4, isFinished: true },
          ],
          { t1Score: 3, t2Score: 4 },
        ),
      ],
    },
  ];

  const undecidedTwoLegged: RoundLayout[] = [
    {
      key: "semi_finals",
      nodes: [
        makeScoredTieNode(
          "semi_finals",
          "LDU de Quito",
          "Palmeiras",
          [
            { t1Score: 3, t2Score: 0, isFinished: true },
            { t1Score: null, t2Score: null, isFinished: false },
          ],
          null,
        ),
      ],
    },
  ];

  it("does not render scores when showScores is omitted, even for a decided tie", () => {
    const svg = buildBracketSvgString(decidedTwoLegged, 1, 400, "L", t);
    expect(svg).not.toContain("·");
  });

  it("does not render scores when showScores is false, even for a decided tie", () => {
    const svg = buildBracketSvgString(decidedTwoLegged, 1, 400, "L", t, false);
    expect(svg).not.toContain("·");
  });

  it("renders each team's score for a decided one-legged tie when showScores is true", () => {
    const svg = buildBracketSvgString(decidedOneLegged, 1, 400, "L", t, true);
    expect(svg).toMatch(/<text[^>]*>2<\/text>/);
    expect(svg).toMatch(/<text[^>]*>1<\/text>/);
  });

  it("does not fabricate a score for an undecided one-legged tie even when showScores is true", () => {
    const svg = buildBracketSvgString(undecidedOneLegged, 1, 400, "L", t, true);
    expect(svg).not.toMatch(/<text[^>]*>\d+<\/text>/);
  });

  it("renders leg1, leg2 and aggregate per team for a decided two-legged tie (Libertadores 2025 SF: LDU 3-4 Palmeiras)", () => {
    const svg = buildBracketSvgString(decidedTwoLegged, 1, 400, "L", t, true);
    expect(svg).toContain("3·0(3)");
    expect(svg).toContain("0·4(4)");
  });

  it("does not render scores for an undecided two-legged tie even when showScores is true", () => {
    const svg = buildBracketSvgString(undecidedTwoLegged, 1, 400, "L", t, true);
    expect(svg).not.toContain("·");
    expect(svg).not.toMatch(/<text[^>]*>\d+<\/text>/);
  });
});
