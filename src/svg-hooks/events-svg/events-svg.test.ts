import { describe, it, expect } from "vitest";
import {
  formatEventTime,
  getMatchEventsSvgH,
  buildMatchEventsSvgString,
  MATCH_EVENTS_SVG_W,
  MatchEventsSvgData,
} from "./events-svg";
import { MatchEvent } from "../../types";

const makeEvent = (overrides: Partial<MatchEvent> = {}): MatchEvent => ({
  timeElapsed: 45,
  teamName: "Home FC",
  eventType: "goal",
  eventDetails: "",
  ...overrides,
});

const baseData = (): MatchEventsSvgData => ({
  homeTeamName: "Home FC",
  homeTeamLogo: "home.png",
  awayTeamName: "Away FC",
  awayTeamLogo: "away.png",
  events: [],
  timeLabel: "FT",
  eventLabel: (e) => e.playerName ?? "",
});

describe("formatEventTime", () => {
  it("returns elapsed with apostrophe when no extra time", () => {
    expect(formatEventTime(45)).toBe("45'");
  });

  it("appends extra time when provided", () => {
    expect(formatEventTime(90, 3)).toBe("90' +3");
  });

  it("omits extra time when null", () => {
    expect(formatEventTime(90, null)).toBe("90'");
  });
});

describe("getMatchEventsSvgH", () => {
  it("returns base height for zero events", () => {
    // HEADER_H(60) + 0 * EVENT_ROW_H(34) + FOOTER_H(40)
    expect(getMatchEventsSvgH(0)).toBe(100);
  });

  it("adds EVENT_ROW_H per event", () => {
    expect(getMatchEventsSvgH(1)).toBe(134);
    expect(getMatchEventsSvgH(5)).toBe(270);
  });
});

describe("buildMatchEventsSvgString", () => {
  it("generates valid SVG with correct width", () => {
    const svg = buildMatchEventsSvgString(baseData());
    expect(svg).toContain("<svg");
    expect(svg).toContain(`width="${MATCH_EVENTS_SVG_W}"`);
    expect(svg).toContain("</svg>");
  });

  it("includes team names in header", () => {
    const svg = buildMatchEventsSvgString(baseData());
    expect(svg).toContain("Home FC");
    expect(svg).toContain("Away FC");
  });

  it("includes time label uppercased", () => {
    const svg = buildMatchEventsSvgString({ ...baseData(), timeLabel: "ft" });
    expect(svg).toContain("FT");
  });

  it("includes team logos when provided", () => {
    const svg = buildMatchEventsSvgString(baseData());
    expect(svg).toContain("home.png");
    expect(svg).toContain("away.png");
  });

  it("omits logo image elements when logos are empty", () => {
    const svg = buildMatchEventsSvgString({
      ...baseData(),
      homeTeamLogo: "",
      awayTeamLogo: "",
    });
    expect(svg).not.toContain("<image");
  });

  it("includes footer brand", () => {
    const svg = buildMatchEventsSvgString(baseData());
    expect(svg).toContain("footballproject.org");
  });

  it("renders a row for each event", () => {
    const data = baseData();
    data.events = [
      makeEvent({ playerName: "Ronaldo", teamName: "Home FC" }),
      makeEvent({ playerName: "Messi", teamName: "Away FC" }),
    ];
    data.eventLabel = (e) => e.playerName ?? "";
    const svg = buildMatchEventsSvgString(data);
    expect(svg).toContain("Ronaldo");
    expect(svg).toContain("Messi");
  });

  it("renders event time using formatEventTime", () => {
    const data = baseData();
    data.events = [makeEvent({ timeElapsed: 67, timeExtra: 2 })];
    const svg = buildMatchEventsSvgString(data);
    expect(svg).toContain("67' +2");
  });

  it("renders yellow card rect for yellow card events", () => {
    const data = baseData();
    data.events = [
      makeEvent({ eventType: "card", eventDetails: "yellow card" }),
    ];
    const svg = buildMatchEventsSvgString(data);
    // Yellow card uses SvgReportsColors.YELLOW fill rect
    expect(svg).toContain("#ffc61a");
  });

  it("renders red card rect for red card events", () => {
    const data = baseData();
    data.events = [
      makeEvent({ eventType: "card", eventDetails: "red card" }),
    ];
    const svg = buildMatchEventsSvgString(data);
    expect(svg).toContain("#D50000");
  });

  it("truncates long event labels to 22 chars", () => {
    const data = baseData();
    const longName = "A".repeat(30);
    data.events = [makeEvent({ playerName: longName, teamName: "Home FC" })];
    data.eventLabel = (e) => e.playerName ?? "";
    const svg = buildMatchEventsSvgString(data);
    expect(svg).not.toContain(longName);
    expect(svg).toContain("…");
  });

  it("sets correct SVG height based on event count", () => {
    const data = baseData();
    data.events = [makeEvent(), makeEvent()];
    const svg = buildMatchEventsSvgString(data);
    expect(svg).toContain(`height="${getMatchEventsSvgH(2)}"`);
  });

  it("alternates row background colors", () => {
    const data = baseData();
    data.events = [makeEvent(), makeEvent()];
    const svg = buildMatchEventsSvgString(data);
    expect(svg).toContain("#181818"); // ROW_ODD
    expect(svg).toContain("#1E1E1E"); // ROW_EVEN
  });
});
