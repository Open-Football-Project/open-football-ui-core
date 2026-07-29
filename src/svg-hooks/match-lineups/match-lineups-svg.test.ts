import { describe, it, expect } from "vitest";
import {
  buildMatchLineupsSvgString,
  MATCH_LINEUPS_SVG_W,
  MATCH_LINEUPS_SVG_H,
} from "./match-lineups-svg";
import { LineupPlayer, TeamLineup } from "../../types";

const getLeftPercent = (index: number, total: number): number =>
  total === 1 ? 50 : (index / (total - 1)) * 100;

const positionToLine = (pos: string): number => {
  if (pos === "G") return 0;
  if (pos === "D") return 1;
  if (pos === "M") return 2;
  return 3; // F
};

const groupByLine = (
  players: LineupPlayer[],
  ptl: (pos: string) => number,
): Record<number, LineupPlayer[]> => {
  const result: Record<number, LineupPlayer[]> = {};
  for (const p of players) {
    const line = ptl(p.pos);
    (result[line] ??= []).push(p);
  }
  return result;
};

const makePlayer = (
  name: string,
  number: number,
  pos: string,
): LineupPlayer => ({ name, number, pos, grid: "" });

const teamA: TeamLineup = {
  teamId: 1,
  teamLogo: "",
  teamName: "Arsenal",
  teamFormation: "4-3-3",
  lineup: [
    makePlayer("Raya", 22, "G"),
    makePlayer("White", 4, "D"),
    makePlayer("Saliba", 12, "D"),
    makePlayer("Odegaard", 8, "M"),
    makePlayer("Saka", 7, "F"),
  ],
  substitutes: [],
};

const teamB: TeamLineup = {
  teamId: 2,
  teamLogo: "",
  teamName: "Chelsea",
  teamFormation: "4-2-3-1",
  lineup: [
    makePlayer("Sanchez", 1, "G"),
    makePlayer("Reece", 24, "D"),
    makePlayer("Palmer", 20, "M"),
    makePlayer("Jackson", 15, "F"),
  ],
  substitutes: [],
};

const buildSvg = (
  overrides: Partial<{ teamA: TeamLineup; teamB: TeamLineup }> = {},
) =>
  buildMatchLineupsSvgString(
    overrides.teamA ?? teamA,
    overrides.teamB ?? teamB,
    getLeftPercent,
    groupByLine,
    positionToLine,
  );

describe("buildMatchLineupsSvgString", () => {
  it("returns a valid SVG string with correct dimensions", () => {
    const svg = buildSvg();

    expect(svg).toContain(`width="${MATCH_LINEUPS_SVG_W}"`);
    expect(svg).toContain(`height="${MATCH_LINEUPS_SVG_H}"`);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("includes both team names in the header", () => {
    const svg = buildSvg();

    expect(svg).toContain("Arsenal");
    expect(svg).toContain("Chelsea");
  });

  it("includes both team formations in the header badges", () => {
    const svg = buildSvg();

    expect(svg).toContain("4-3-3");
    expect(svg).toContain("4-2-3-1");
  });

  it("renders the 'vs' separator between team names", () => {
    const svg = buildSvg();

    expect(svg).toContain("Arsenal vs Chelsea");
  });

  it("includes footballproject.org branding in the footer", () => {
    const svg = buildSvg();

    expect(svg).toContain("footballproject.org");
  });

  it("escapes & in team names", () => {
    const svg = buildSvg({
      teamA: { ...teamA, teamName: "Brighton & Hove" },
    });

    expect(svg).toContain("Brighton &amp; Hove");
    expect(svg).not.toContain("Brighton & Hove");
  });

  it("escapes < and > in team names", () => {
    const svg = buildSvg({
      teamA: { ...teamA, teamName: "A<B>C" },
    });

    expect(svg).toContain("A&lt;B&gt;C");
  });

  it("truncates team names longer than 20 characters", () => {
    const longName = "Borussia Dortmund FC Extra";
    const svg = buildSvg({ teamA: { ...teamA, teamName: longName } });

    expect(svg).toContain("Borussia Dortmund F…");
    expect(svg).not.toContain(longName);
  });

  it("renders home players with home color", () => {
    const svg = buildSvg();

    expect(svg).toContain('fill="#0f2150"');
  });

  it("renders away players with away color", () => {
    const svg = buildSvg();

    expect(svg).toContain('fill="#c20202"');
  });

  it("renders player shirt numbers", () => {
    const svg = buildSvg();

    expect(svg).toContain(">22<");
    expect(svg).toContain(">7<");
    expect(svg).toContain(">1<");
    expect(svg).toContain(">20<");
  });

  it("renders player names in uppercase", () => {
    const svg = buildSvg();

    expect(svg).toContain("RAYA");
    expect(svg).toContain("SAKA");
    expect(svg).toContain("PALMER");
  });

  it("truncates player names longer than 9 characters", () => {
    const svg = buildSvg({
      teamA: {
        ...teamA,
        lineup: [makePlayer("Alexandersson", 5, "G")],
      },
    });

    expect(svg).toContain("ALEXANDE…");
    expect(svg).not.toContain("ALEXANDERSSON");
  });

  it("escapes & in player names", () => {
    const svg = buildSvg({
      teamA: {
        ...teamA,
        lineup: [makePlayer("O&Neil", 5, "G")],
      },
    });

    expect(svg).toContain("O&amp;NEIL");
  });

  it("renders pitch background rectangle", () => {
    const svg = buildSvg();

    expect(svg).toContain('fill="#2d6a2d"');
  });

  it("renders halfway line", () => {
    const svg = buildSvg();

    expect(svg).toContain("<line");
  });

  it("renders center circle", () => {
    const svg = buildSvg();

    expect(svg).toContain('r="40"');
  });

  it("renders penalty area rectangles", () => {
    const svg = buildSvg();

    expect(svg).toContain('width="300"');
  });

  it("renders goal area rectangles", () => {
    const svg = buildSvg();

    expect(svg).toContain('width="180"');
  });

  it("renders a linearGradient background in defs", () => {
    const svg = buildSvg();

    expect(svg).toContain("<defs>");
    expect(svg).toContain("<linearGradient");
    expect(svg).toContain("url(#lbg)");
  });

  it("renders player circles with radius 14", () => {
    const svg = buildSvg();

    expect(svg).toContain('r="14"');
  });

  it("handles a team with no players gracefully", () => {
    const emptyTeam: TeamLineup = { ...teamA, lineup: [] };
    const svg = buildSvg({ teamA: emptyTeam });

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("keeps team name of exactly 20 characters unchanged", () => {
    const exactName = "12345678901234567890"; // 20 chars
    const svg = buildSvg({ teamA: { ...teamA, teamName: exactName } });

    expect(svg).toContain(exactName);
  });

  it("keeps player name of exactly 9 characters unchanged", () => {
    const svg = buildSvg({
      teamA: {
        ...teamA,
        lineup: [makePlayer("123456789", 9, "G")],
      },
    });

    expect(svg).toContain("123456789");
    expect(svg).not.toContain("12345678…");
  });
});
