import { describe, it, expect } from "vitest";
import {
  buildLiveIndicatorsDonutsSvgString,
  LIVE_MATCH_DONUTS_SVG_W,
  LIVE_MATCH_DONUTS_SVG_H,
} from "./live-match-donuts-svg";
import {
  DonutsBrandColor,
  IndicatorResult,
  LiveMatchIndicatorsDonut,
  LiveMatchIndicatorsDonutTrKeys,
  LiveMatchIndicatorsDonutVerdictThresholds,
} from "../../types";

const t = (key: string, opts?: Record<string, string>) =>
  opts?.team ? `${key}:${opts.team}` : key;

const donut: LiveMatchIndicatorsDonut = {
  center: 80,
  radius: 30,
  strokeWidth: 4,
  circumference: 2 * Math.PI * 30,
};

const brand: DonutsBrandColor = {
  orange: "#ff6b00",
  aqualight: "#00bcd4",
  darkBg: "#1e1e1e",
  divider: "#333333",
};

const veredictThresholds: LiveMatchIndicatorsDonutVerdictThresholds = {
  dominating: 70,
  leading: 58,
  trailing: 42,
  dominated: 30,
};

const trkeys: LiveMatchIndicatorsDonutTrKeys = {
  veredictDominating: "indicators.verdict.dominating",
  veredictAhead: "indicators.verdict.ahead",
  veredictEven: "indicators.verdict.even",
  veredictDominated: "indicators.verdict.dominated",
  veredictNoData: "indicators.verdict.no_data",
};

const momentum: IndicatorResult = {
  emoji: "⚡",
  label: "indicators.momentum",
  homePercent: 65,
  awayPercent: 35,
};

const control: IndicatorResult = {
  emoji: "🎮",
  label: "indicators.match_control",
  homePercent: 50,
  awayPercent: 50,
};

const goalThreat: IndicatorResult = {
  emoji: "🎯",
  label: "indicators.goal_threat",
  homePercent: 28,
  awayPercent: 72,
};

const buildSvg = (
  overrides: Partial<{
    homeTeamName: string;
    awayTeamName: string;
    momentum: IndicatorResult;
    control: IndicatorResult;
    goalThreat: IndicatorResult;
    hasData: boolean;
  }> = {},
) =>
  buildLiveIndicatorsDonutsSvgString(
    overrides.homeTeamName ?? "Arsenal",
    overrides.awayTeamName ?? "Chelsea",
    overrides.momentum ?? momentum,
    overrides.control ?? control,
    overrides.goalThreat ?? goalThreat,
    overrides.hasData ?? true,
    t,
    donut,
    brand,
    veredictThresholds,
    trkeys,
  );

describe("buildLiveIndicatorsSvgString", () => {
  it("returns a valid SVG string with correct dimensions", () => {
    const svg = buildSvg();

    expect(svg).toContain(`width="${LIVE_MATCH_DONUTS_SVG_W}"`);
    expect(svg).toContain(`height="${LIVE_MATCH_DONUTS_SVG_H}"`);
    expect(svg).toContain(
      `viewBox="0 0 ${LIVE_MATCH_DONUTS_SVG_W} ${LIVE_MATCH_DONUTS_SVG_H}"`,
    );
  });

  it("includes footballproject.org branding in the footer", () => {
    const svg = buildSvg();

    expect(svg).toContain("footballproject.org");
  });

  it("includes all three indicator labels", () => {
    const svg = buildSvg();

    expect(svg).toContain("indicators.momentum");
    expect(svg).toContain("indicators.match_control");
    expect(svg).toContain("indicators.goal_threat");
  });

  it("includes emojis from each indicator", () => {
    const svg = buildSvg();

    expect(svg).toContain("⚡");
    expect(svg).toContain("🎮");
    expect(svg).toContain("🎯");
  });

  it("includes both team names in the legend", () => {
    const svg = buildSvg();

    expect(svg).toContain("Arsenal");
    expect(svg).toContain("Chelsea");
  });

  it("includes percentage values for all indicators", () => {
    const svg = buildSvg();

    expect(svg).toContain("65%");
    expect(svg).toContain("35%");
    expect(svg).toContain("50%");
    expect(svg).toContain("28%");
    expect(svg).toContain("72%");
  });

  it("renders zero home dash when hasData is false", () => {
    const svg = buildSvg({ hasData: false });

    expect(svg).toContain('stroke-dasharray="0.00');
  });

  it("renders home leading verdict when homePercent >= leading threshold (58)", () => {
    const svg = buildSvg();

    expect(svg).toContain("indicators.verdict.ahead:Arsenal");
  });

  it("renders away leading verdict when homePercent is between dominated (30) and trailing (42)", () => {
    const awayAhead: IndicatorResult = {
      ...goalThreat,
      homePercent: 35,
      awayPercent: 65,
    };
    const svg = buildSvg({ goalThreat: awayAhead });

    expect(svg).toContain("indicators.verdict.ahead:Chelsea");
  });

  it("renders even verdict when homePercent is between thresholds", () => {
    const svg = buildSvg();

    expect(svg).toContain("indicators.verdict.even");
  });

  it("renders no_data verdict when hasData is false", () => {
    const svg = buildSvg({ hasData: false });

    expect(svg).toContain("indicators.verdict.no_data");
  });

  it("renders dominating verdict when homePercent >= 70", () => {
    const dominant: IndicatorResult = {
      ...momentum,
      homePercent: 75,
      awayPercent: 25,
    };
    const svg = buildSvg({ momentum: dominant });

    expect(svg).toContain("indicators.verdict.dominating:Arsenal");
  });

  it("renders vertical divider lines between columns", () => {
    const svg = buildSvg();

    expect(svg).toContain(`x1="180"`);
    expect(svg).toContain(`x1="360"`);
  });
});
