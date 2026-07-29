import type {
  LeagueFixtureRound,
  LeagueFixturesMatch,
  DayMatches,
  TeamFixtureMatch,
} from "../../types";

import {
  SvgReportsColors,
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  getFormattedDate,
  getFormattedTime,
} from "../../utils";

export const FIXTURE_SVG_W = 620;

const HEADER_H = 70;
const HEADER_LOGO_SIZE = 44;
const HEADER_LOGO_X = 12;
const ROUND_H = 28;
const MATCH_H = 44;
const FOOTER_H = 38;

const TIME_X = 4;
const TIME_W = 54;
const HOME_NAME_X_END = 254;
const HOME_LOGO_X = 256;
const LOGO_SIZE = 22;
const SCORE_CENTER = 310;
const AWAY_LOGO_X = 342;
const AWAY_NAME_X = 366;
const MAX_TEAM_NAME_LEN = 18;

function truncate(name: string): string {
  return name.length > MAX_TEAM_NAME_LEN
    ? name.slice(0, MAX_TEAM_NAME_LEN) + "\u2026"
    : name;
}

function renderHeader(
  headerName: string,
  roundName: string,
  headerLogo?: string,
): string[] {
  const elements: string[] = [
    svgRect(0, 0, FIXTURE_SVG_W, HEADER_H, SvgReportsColors.HEADER_BG),
    svgText(
      FIXTURE_SVG_W / 2,
      HEADER_H / 2 + 6,
      "middle",
      SvgReportsColors.YELLOW,
      20,
      "bold",
      escapeXml(headerName),
    ),
    svgRect(0, HEADER_H, FIXTURE_SVG_W, ROUND_H, SvgReportsColors.COL_HDR_BG),
    svgText(
      FIXTURE_SVG_W / 2,
      HEADER_H + ROUND_H / 2 + 5,
      "middle",
      SvgReportsColors.TEXT,
      11,
      "bold",
      escapeXml(roundName.toUpperCase()),
    ),
  ];
  if (headerLogo) {
    const logoY = (HEADER_H - HEADER_LOGO_SIZE) / 2;
    elements.splice(
      1,
      0,
      svgImage(headerLogo, HEADER_LOGO_X, logoY, HEADER_LOGO_SIZE),
    );
  }
  return elements;
}

function renderMatchRow(
  match: LeagueFixturesMatch,
  rowIndex: number,
  y: number,
): string[] {
  const rowBg =
    rowIndex % 2 === 0 ? SvgReportsColors.ROW_ODD : SvgReportsColors.ROW_EVEN;
  const logoY = y + (MATCH_H - LOGO_SIZE) / 2;
  const dateY = y + MATCH_H / 2 - 3;
  const timeY = y + MATCH_H / 2 + 10;

  const scoreStr = match.isFinished
    ? `${match.homeTeamScore ?? 0} - ${match.awayTeamScore ?? 0}`
    : "  -  ";
  const dateStr = getFormattedDate(match.date, "dd/MM");
  const timeStr = match.isFinished ? "\u2713" : getFormattedTime(match.date);
  const timeColor = match.isFinished
    ? SvgReportsColors.TEXT_MUTED
    : SvgReportsColors.YELLOW;
  const timeWeight = match.isFinished ? "normal" : "bold";

  const elements: string[] = [
    svgRect(0, y, FIXTURE_SVG_W, MATCH_H, rowBg),
    svgText(
      TIME_X + TIME_W / 2,
      dateY,
      "middle",
      timeColor,
      9,
      timeWeight,
      escapeXml(dateStr),
    ),
    svgText(
      TIME_X + TIME_W / 2,
      timeY,
      "middle",
      timeColor,
      9,
      timeWeight,
      escapeXml(timeStr),
    ),
    svgText(
      HOME_NAME_X_END,
      y + MATCH_H / 2 + 5,
      "end",
      SvgReportsColors.TEXT,
      11,
      "bold",
      escapeXml(truncate(match.homeTeamName)),
    ),
    svgText(
      SCORE_CENTER,
      y + MATCH_H / 2 + 5,
      "middle",
      SvgReportsColors.YELLOW,
      13,
      "bold",
      scoreStr,
    ),
    svgText(
      AWAY_NAME_X,
      y + MATCH_H / 2 + 5,
      "start",
      SvgReportsColors.TEXT,
      11,
      "bold",
      escapeXml(truncate(match.awayTeamName)),
    ),
    svgHLine(y + MATCH_H, FIXTURE_SVG_W, SvgReportsColors.BORDER),
  ];

  if (match.homeTeamLogo) {
    elements.push(svgImage(match.homeTeamLogo, HOME_LOGO_X, logoY, LOGO_SIZE));
  }
  if (match.awayTeamLogo) {
    elements.push(svgImage(match.awayTeamLogo, AWAY_LOGO_X, logoY, LOGO_SIZE));
  }

  return elements;
}

function renderFooter(y: number): string[] {
  return [
    svgRect(0, y, FIXTURE_SVG_W, FOOTER_H, SvgReportsColors.HEADER_BG),
    svgText(
      FIXTURE_SVG_W / 2,
      y + FOOTER_H / 2 + 5,
      "middle",
      SvgReportsColors.ORANGE,
      14,
      "bold",
      "footballproject.org",
    ),
  ];
}

export function getFixtureSvgH(round: LeagueFixtureRound): number {
  const matchCount = round.days.reduce((s, d) => s + d.matches.length, 0);
  return HEADER_H + ROUND_H + matchCount * MATCH_H + FOOTER_H;
}

export function buildFixtureSvgString(
  round: LeagueFixtureRound,
  headerName: string,
  headerLogo?: string,
): string {
  const svgH = getFixtureSvgH(round);
  const els: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
      ` width="${FIXTURE_SVG_W}" height="${svgH}" viewBox="0 0 ${FIXTURE_SVG_W} ${svgH}">`,
    svgRect(0, 0, FIXTURE_SVG_W, svgH, SvgReportsColors.BG),
    ...renderHeader(headerName, round.name, headerLogo),
  ];

  let y = HEADER_H + ROUND_H;
  let matchIdx = 0;

  for (const day of round.days) {
    for (const match of day.matches) {
      els.push(...renderMatchRow(match, matchIdx++, y));
      y += MATCH_H;
    }
  }

  els.push(...renderFooter(y));
  els.push("</svg>");
  return els.join("\n");
}

export function dayMatchesToFixtureRound(
  league: DayMatches,
): LeagueFixtureRound {
  const date = league.matches[0]?.date ?? new Date().toISOString();
  return {
    name: date,
    days: [
      {
        date,
        matches: league.matches.map((m) => ({
          ...m,
          homeTeamLogo: m.homeTeamLogo ?? undefined,
          awayTeamLogo: m.awayTeamLogo ?? undefined,
          fixtureRound: "",
        })),
      },
    ],
  };
}

export function teamFixtureMatchesToFixtureRound(
  matches: TeamFixtureMatch[],
  label: string,
): LeagueFixtureRound {
  if (!matches.length) return { name: label, days: [] };
  return {
    name: label,
    days: [
      {
        date: matches[0].date,
        matches: matches.map((m) => ({ ...m, fixtureRound: "" })),
      },
    ],
  };
}
