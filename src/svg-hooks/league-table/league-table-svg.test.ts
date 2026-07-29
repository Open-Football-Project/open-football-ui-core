import { describe, it, expect } from "vitest";
import { LeagueTeamInfo } from "../../types/league-types";
import {
  buildStandingsSvgString,
  getStandingsSvgH,
  SvgLeagueTableColDefinition,
} from "./league-table-svg";

describe("league-table-svg module", () => {
  it("calculates SVG height correctly", () => {
    expect(getStandingsSvgH(0)).toBe(70 + 36 + 0 + 40);
    expect(getStandingsSvgH(3)).toBe(70 + 36 + 3 * 38 + 40);
  });

  it("builds an SVG string with header, columns, team row, form squares, and footer", () => {
    const columns: SvgLeagueTableColDefinition[] = [
      { label: "#", x: 0, w: 35, align: "center" },
      { label: "Team", x: 35, w: 265, align: "left" },
      { label: "Pts", x: 300, w: 70, align: "center" },
      { label: "P", x: 370, w: 50, align: "center" },
      { label: "W", x: 420, w: 50, align: "center" },
      { label: "D", x: 470, w: 50, align: "center" },
      { label: "L", x: 520, w: 50, align: "center" },
      { label: "GF", x: 570, w: 50, align: "center" },
      { label: "GA", x: 620, w: 50, align: "center" },
      { label: "Form", x: 670, w: 130, align: "center" },
    ];

    const teams: LeagueTeamInfo[] = [
      {
        teamId: 1,
        rank: 1,
        teamName: "A&B United",
        logo: "http://team.logo/1.png",
        points: 30,
        played: 20,
        won: 9,
        draw: 3,
        lost: 8,
        goalsFor: 27,
        goalsAgainst: 25,
        form: "WDLLW",
      },
    ];

    const result = buildStandingsSvgString(
      teams,
      "Super League",
      "http://league.logo.png",
      "Group A",
      columns,
      (r) => r,
    );

    const expectedHeight = getStandingsSvgH(1);
    expect(result).toContain(`viewBox="0 0 800 ${expectedHeight}"`);

    expect(result).toContain("Super League – Group A");
    expect(result).toContain('href="http://league.logo.png"');

    expect(result).toContain(">1<");
    expect(result).toContain(">30<");
    expect(result).toContain("A&amp;B UNITED");

    expect(result).toContain("futballero.com");

    expect(result.match(/fill="#22c55e"/g)?.length).toBe(2);
    expect(result.match(/fill="#eab308"/g)?.length).toBe(1);
    expect(result.match(/fill="#ef4444"/g)?.length).toBe(2);

    expect(result.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
    expect(result.trim().endsWith("</svg>")).toBe(true);
  });
});
