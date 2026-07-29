import { describe, it, expect } from "vitest";
import {
  getTeamStatsSvgH,
  buildTeamStatsSvgString,
  TEAM_STATS_SVG_W,
  TeamStatsSvgData,
} from "./stats-svg";
import { TeamStatistic } from "../../types";

const makeStat = (overrides: Partial<TeamStatistic> = {}): TeamStatistic => ({
  name: "shots",
  value: 10,
  total: 20,
  isPositive: true,
  ...overrides,
});

const baseData = (): TeamStatsSvgData => ({
  title: "Team Stats",
  statistics: [],
  statLabel: (name) => name,
});

describe("getTeamStatsSvgH", () => {
  it("returns base height for zero stats", () => {
    // HEADER_H(64) + 0 * STAT_ROW_H(46) + FOOTER_H(40)
    expect(getTeamStatsSvgH(0)).toBe(104);
  });

  it("adds STAT_ROW_H per statistic", () => {
    expect(getTeamStatsSvgH(1)).toBe(150);
    expect(getTeamStatsSvgH(5)).toBe(334);
  });
});

describe("buildTeamStatsSvgString", () => {
  it("generates valid SVG with correct width", () => {
    const svg = buildTeamStatsSvgString(baseData());
    expect(svg).toContain("<svg");
    expect(svg).toContain(`width="${TEAM_STATS_SVG_W}"`);
    expect(svg).toContain("</svg>");
  });

  it("includes title in header", () => {
    const svg = buildTeamStatsSvgString(baseData());
    expect(svg).toContain("Team Stats");
  });

  it("includes logo when provided", () => {
    const svg = buildTeamStatsSvgString({ ...baseData(), logo: "logo.png" });
    expect(svg).toContain("logo.png");
  });

  it("omits logo image element when not provided", () => {
    const svg = buildTeamStatsSvgString(baseData());
    expect(svg).not.toContain("<image");
  });

  it("renders a row for each statistic", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ name: "shots" }), makeStat({ name: "passes" })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("shots");
    expect(svg).toContain("passes");
  });

  it("uses statLabel to translate stat names", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ name: "shots_on_target" })],
      statLabel: () => "Shots on Target",
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("Shots on Target");
  });

  it("displays the stat value", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 7 })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("7");
  });

  it("renders green bar fill for positive stat above 50%", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 15, total: 20, isPositive: true })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("#00C853"); // SUCCESS
  });

  it("renders red bar fill for positive stat at or below 20%", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 2, total: 20, isPositive: true })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("#D50000"); // DANGER
  });

  it("renders orange bar fill for positive stat between 20% and 50%", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 8, total: 20, isPositive: true })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("#FF6B00"); // ORANGE
  });

  it("inverts bar color logic for negative stats", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 18, total: 20, isPositive: false })],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("#D50000"); // DANGER — high % is bad
  });

  it("renders no bar fill rect when value is 0", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat({ value: 0, total: 20 })],
    };
    const svgLines = buildTeamStatsSvgString(data).split("\n");
    // bar background rect is always rendered; fill rect is only added when barFillW > 0
    const fillRects = svgLines.filter(
      (l) => l.includes("<rect") && l.includes("#00C853"),
    );
    expect(fillRects).toHaveLength(0);
  });

  it("alternates row backgrounds", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat(), makeStat()],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain("#181818"); // ROW_ODD
    expect(svg).toContain("#1E1E1E"); // ROW_EVEN
  });

  it("sets correct SVG height based on stat count", () => {
    const data: TeamStatsSvgData = {
      ...baseData(),
      statistics: [makeStat(), makeStat(), makeStat()],
    };
    const svg = buildTeamStatsSvgString(data);
    expect(svg).toContain(`height="${getTeamStatsSvgH(3)}"`);
  });

  it("includes footer brand", () => {
    const svg = buildTeamStatsSvgString(baseData());
    expect(svg).toContain("footballproject.org");
  });
});
