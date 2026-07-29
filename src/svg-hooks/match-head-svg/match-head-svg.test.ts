import { describe, it, expect } from "vitest";
import {
  getMatchInfoSvgH,
  buildMatchInfoSvgString,
  MATCH_INFO_SVG_W,
  MatchInfoSvgData,
  MatchInfoSvgLabels,
} from "./match-head-svg";

const labels: MatchInfoSvgLabels = { ht: "HT", ft: "FT", et: "ET", pen: "PEN" };

const baseData = (): MatchInfoSvgData => ({
  homeTeamName: "Home FC",
  awayTeamName: "Away FC",
  goalsHome: 2,
  goalsAway: 1,
  score: {
    halftime: { home: 1, away: 0 },
    fulltime: { home: 2, away: 1 },
  },
  leagueName: "Premier League",
  formattedDate: "2026-03-27",
  labels,
});

describe("getMatchInfoSvgH", () => {
  it("returns base height without status row", () => {
    // LEAGUE_H(48) + TEAMS_H(100) + SCORES_H(42) + INFO_H(54) + FOOTER_H(40)
    expect(getMatchInfoSvgH(false)).toBe(284);
  });

  it("adds STATUS_H when hasStatus is true", () => {
    // + STATUS_H(30)
    expect(getMatchInfoSvgH(true)).toBe(314);
  });
});

describe("buildMatchInfoSvgString", () => {
  it("generates valid SVG with correct width", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("<svg");
    expect(svg).toContain(`width="${MATCH_INFO_SVG_W}"`);
    expect(svg).toContain("</svg>");
  });

  it("includes both team names", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("Home FC");
    expect(svg).toContain("Away FC");
  });

  it("includes main score", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("2 : 1");
  });

  it("includes league name", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("Premier League");
  });

  it("includes score breakdown labels and values", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("HT");
    expect(svg).toContain("FT");
    expect(svg).toContain("1 : 0");
    expect(svg).toContain("2 : 1");
  });

  it("includes ET and PEN labels when provided", () => {
    const data: MatchInfoSvgData = {
      ...baseData(),
      score: {
        ...baseData().score,
        extratime: { home: 2, away: 2 },
        penalty: { home: 4, away: 3 },
      },
    };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("ET");
    expect(svg).toContain("PEN");
    expect(svg).toContain("4 : 3");
  });

  it("omits ET and PEN when not provided", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).not.toContain("ET");
    expect(svg).not.toContain("PEN");
  });

  it("includes formatted date", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("2026-03-27");
  });

  it("includes venue when provided", () => {
    const data: MatchInfoSvgData = {
      ...baseData(),
      venueName: "Old Trafford",
      venueCity: "Manchester",
    };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("Old Trafford");
    expect(svg).toContain("Manchester");
  });

  it("includes status label when provided", () => {
    const data: MatchInfoSvgData = { ...baseData(), statusLabel: "LIVE" };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("LIVE");
    expect(svg).toContain(`height="${getMatchInfoSvgH(true)}"`);
  });

  it("omits status row when statusLabel is absent", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain(`height="${getMatchInfoSvgH(false)}"`);
  });

  it("includes league logo when provided", () => {
    const data: MatchInfoSvgData = { ...baseData(), leagueLogo: "league.png" };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("league.png");
  });

  it("includes team logos when provided", () => {
    const data: MatchInfoSvgData = {
      ...baseData(),
      homeTeamLogo: "home.png",
      awayTeamLogo: "away.png",
    };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("home.png");
    expect(svg).toContain("away.png");
  });

  it("shows dashes when goals are undefined", () => {
    const data: MatchInfoSvgData = {
      ...baseData(),
      goalsHome: undefined,
      goalsAway: undefined,
    };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).toContain("- : -");
  });

  it("includes footer brand", () => {
    const svg = buildMatchInfoSvgString(baseData());
    expect(svg).toContain("footballproject.org");
  });

  it("truncates long team names", () => {
    const longName = "A".repeat(20);
    const data: MatchInfoSvgData = { ...baseData(), homeTeamName: longName };
    const svg = buildMatchInfoSvgString(data);
    expect(svg).not.toContain(longName);
    expect(svg).toContain("…");
  });
});
