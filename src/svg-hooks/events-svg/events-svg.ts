import {
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  MatchEventDetail,
  MatchEventType,
  SvgReportsColors,
} from "../../utils";

import { MatchEvent } from "../../types";

export const MATCH_EVENTS_SVG_W = 560;

const PADDING = 16;
const HEADER_H = 60;
const EVENT_ROW_H = 34;
const FOOTER_H = 40;
const LOGO_SIZE = 24;
const ICON_SLOT = 20;
const CARD_W = 10;
const CARD_H = 14;
const MAX_LABEL = 22;

export const getMatchEventsSvgH = (eventCount: number): number =>
  HEADER_H + eventCount * EVENT_ROW_H + FOOTER_H;

const TIME_CX = MATCH_EVENTS_SVG_W / 2;

const truncate = (s: string, max: number): string =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

const isYellowCard = (eType: string, detail: string) =>
  eType.includes(MatchEventType.CARD) &&
  detail.includes(MatchEventDetail.YELLOW);

const isRedCard = (eType: string, detail: string) =>
  eType.includes(MatchEventType.CARD) && detail.includes(MatchEventDetail.RED);

const eventSymbol = (eType: string, detail: string): string => {
  if (eType.includes(MatchEventType.VAR)) return "VAR";
  if (
    eType.includes(MatchEventType.GOAL) &&
    detail.includes(MatchEventDetail.MISSED)
  )
    return "\u2717"; // ✗
  if (
    eType.includes(MatchEventType.GOAL) &&
    detail.includes(MatchEventDetail.PENALTY)
  )
    return "\u26BD(P)"; // ⚽(P)
  if (eType.includes(MatchEventType.GOAL)) return "\u26BD"; // ⚽
  if (detail.includes(MatchEventDetail.SUBSTITUTION)) return "\u21C4"; // ⇄
  return "\u00B7"; // ·
};

const svgEventIcon = (
  eType: string,
  detail: string,
  anchorX: number,
  midY: number,
  anchor: "start" | "end",
): string => {
  if (isYellowCard(eType, detail)) {
    const rectX = anchor === "start" ? anchorX : anchorX - CARD_W;
    return svgRect(
      rectX,
      midY - Math.round(CARD_H / 2),
      CARD_W,
      CARD_H,
      SvgReportsColors.YELLOW,
    );
  }
  if (isRedCard(eType, detail)) {
    const rectX = anchor === "start" ? anchorX : anchorX - CARD_W;
    return svgRect(
      rectX,
      midY - Math.round(CARD_H / 2),
      CARD_W,
      CARD_H,
      SvgReportsColors.DANGER,
    );
  }
  return svgText(
    anchorX,
    midY + 4,
    anchor,
    SvgReportsColors.TEXT,
    11,
    "normal",
    eventSymbol(eType, detail),
  );
};

export const formatEventTime = (
  elapsed: number,
  extra?: number | null,
): string => (extra ? `${elapsed}' +${extra}` : `${elapsed}'`);

export interface MatchEventsSvgData {
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  events: MatchEvent[];
  timeLabel: string;
  eventLabel: (event: MatchEvent) => string;
}

export function buildMatchEventsSvgString(data: MatchEventsSvgData): string {
  const {
    homeTeamName,
    homeTeamLogo,
    awayTeamName,
    awayTeamLogo,
    events,
    timeLabel,
    eventLabel,
  } = data;
  const totalH = getMatchEventsSvgH(events.length);
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MATCH_EVENTS_SVG_W}" height="${totalH}">`,
  );

  parts.push(
    svgRect(0, 0, MATCH_EVENTS_SVG_W, HEADER_H, SvgReportsColors.HEADER_BG),
  );
  const headerMidY = Math.round(HEADER_H / 2);

  if (homeTeamLogo) {
    parts.push(
      svgImage(
        homeTeamLogo,
        PADDING,
        headerMidY - Math.round(LOGO_SIZE / 2),
        LOGO_SIZE,
      ),
    );
  }
  const homeNameX = homeTeamLogo ? PADDING + LOGO_SIZE + 6 : PADDING;
  parts.push(
    svgText(
      homeNameX,
      headerMidY + 5,
      "start",
      SvgReportsColors.TEXT,
      13,
      "bold",
      escapeXml(truncate(homeTeamName, 16)),
    ),
  );

  parts.push(
    svgText(
      TIME_CX,
      headerMidY + 5,
      "middle",
      SvgReportsColors.YELLOW,
      11,
      "bold",
      escapeXml(timeLabel.toUpperCase()),
    ),
  );

  const awayNameX = awayTeamLogo
    ? MATCH_EVENTS_SVG_W - PADDING - LOGO_SIZE - 6
    : MATCH_EVENTS_SVG_W - PADDING;
  parts.push(
    svgText(
      awayNameX,
      headerMidY + 5,
      "end",
      SvgReportsColors.TEXT,
      13,
      "bold",
      escapeXml(truncate(awayTeamName, 16)),
    ),
  );
  if (awayTeamLogo) {
    parts.push(
      svgImage(
        awayTeamLogo,
        MATCH_EVENTS_SVG_W - PADDING - LOGO_SIZE,
        headerMidY - Math.round(LOGO_SIZE / 2),
        LOGO_SIZE,
      ),
    );
  }

  parts.push(svgHLine(HEADER_H, MATCH_EVENTS_SVG_W, SvgReportsColors.BORDER));

  events.forEach((event, idx) => {
    const rowY = HEADER_H + idx * EVENT_ROW_H;
    const rowBg =
      idx % 2 === 0 ? SvgReportsColors.ROW_ODD : SvgReportsColors.ROW_EVEN;
    const midY = rowY + Math.round(EVENT_ROW_H / 2);
    const textY = midY + 4;
    const isHome = event.teamName === homeTeamName;
    const eType = (event.eventType ?? "").toLowerCase();
    const detail = (event.eventDetails ?? "").toLowerCase();
    const label = truncate(eventLabel(event), MAX_LABEL);

    parts.push(svgRect(0, rowY, MATCH_EVENTS_SVG_W, EVENT_ROW_H, rowBg));

    if (isHome) {
      parts.push(svgEventIcon(eType, detail, PADDING, midY, "start"));
      parts.push(
        svgText(
          PADDING + ICON_SLOT,
          textY,
          "start",
          SvgReportsColors.TEXT,
          11,
          "normal",
          escapeXml(label),
        ),
      );
    } else {
      parts.push(
        svgText(
          MATCH_EVENTS_SVG_W - PADDING - ICON_SLOT,
          textY,
          "end",
          SvgReportsColors.TEXT,
          11,
          "normal",
          escapeXml(label),
        ),
      );
      parts.push(
        svgEventIcon(eType, detail, MATCH_EVENTS_SVG_W - PADDING, midY, "end"),
      );
    }

    parts.push(
      svgText(
        TIME_CX,
        textY,
        "middle",
        SvgReportsColors.SUCCESS,
        11,
        "bold",
        formatEventTime(event.timeElapsed, event.timeExtra),
      ),
    );

    parts.push(
      svgHLine(rowY + EVENT_ROW_H, MATCH_EVENTS_SVG_W, SvgReportsColors.BORDER),
    );
  });

  const footerY = HEADER_H + events.length * EVENT_ROW_H;
  parts.push(
    svgRect(
      0,
      footerY,
      MATCH_EVENTS_SVG_W,
      FOOTER_H,
      SvgReportsColors.HEADER_BG,
    ),
  );
  parts.push(
    svgText(
      TIME_CX,
      footerY + Math.round(FOOTER_H / 2) + 5,
      "middle",
      SvgReportsColors.ORANGE,
      14,
      "bold",
      "futballero.com",
    ),
  );

  parts.push("</svg>");
  return parts.join("\n");
}
