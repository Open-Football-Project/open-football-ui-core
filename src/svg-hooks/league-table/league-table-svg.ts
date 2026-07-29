import { LeagueTeamInfo } from "../../types";
import {
  SvgReportsColors,
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
} from "../../utils";

const HEADER_LOGO_X = 15;
const HEADER_LOGO_SIZE = 46;
const ROW_LOGO_SIZE = 22;
const ROW_LOGO_PADDING = 6;
const ROW_LOGO_NAME_GAP = 6;
const LEFT_COL_TEXT_OFFSET = 8;
const FORM_SQUARE_SIZE = 18;
const FORM_SQUARE_GAP = 3;

const HEADER_H = 70;
const COL_HEADER_H = 36;
const ROW_H = 38;
const FOOTER_H = 40;

export const STANDINGS_SVG_W = 800;

export const getStandingsSvgH = (teamCount: number): number =>
  HEADER_H + COL_HEADER_H + teamCount * ROW_H + FOOTER_H;

const enum LeagueTableFontSizes {
  TITLE = 22,
  COL_HEADER = 11,
  BODY = 12,
  POINTS = 13,
  FOOTER = 14,
  FORM_LABEL = 9,
}

export interface SvgLeagueTableColDefinition {
  label: string;
  x: number;
  w: number;
  align: "center" | "left";
}

function renderHeader(
  leagueName: string,
  leagueLogo: string | undefined,
  groupLabel: string | undefined,
): string[] {
  const title = groupLabel
    ? `${escapeXml(leagueName)} – ${escapeXml(groupLabel)}`
    : escapeXml(leagueName);
  const titleX = STANDINGS_SVG_W / 2;
  const titleY = HEADER_H / 2 + 8;

  const elements = [
    svgRect(0, 0, STANDINGS_SVG_W, HEADER_H, SvgReportsColors.HEADER_BG),
    svgText(
      titleX,
      titleY,
      "middle",
      SvgReportsColors.YELLOW,
      LeagueTableFontSizes.TITLE,
      "bold",
      title,
    ),
  ];

  if (leagueLogo) {
    const logoY = (HEADER_H - HEADER_LOGO_SIZE) / 2;
    elements.splice(
      1,
      0,
      svgImage(leagueLogo, HEADER_LOGO_X, logoY, HEADER_LOGO_SIZE),
    );
  }

  return elements;
}

function renderColHeaders(cols: SvgLeagueTableColDefinition[]): string[] {
  const bgY = HEADER_H;
  const textY = bgY + COL_HEADER_H / 2 + 5;

  return [
    svgRect(0, bgY, STANDINGS_SVG_W, COL_HEADER_H, SvgReportsColors.COL_HDR_BG),
    ...cols.map((col) => {
      const x =
        col.align === "center"
          ? col.x + col.w / 2
          : col.x + LEFT_COL_TEXT_OFFSET;
      const anchor = col.align === "center" ? "middle" : "start";
      return svgText(
        x,
        textY,
        anchor,
        SvgReportsColors.TEXT,
        LeagueTableFontSizes.COL_HEADER,
        "bold",
        col.label.toUpperCase(),
      );
    }),
  ];
}

function formSquareColor(result: string): SvgReportsColors {
  if (result === "W") return SvgReportsColors.WIN;
  if (result === "D") return SvgReportsColors.DRAW;
  return SvgReportsColors.LOSS;
}

function renderFormSquares(
  team: LeagueTeamInfo,
  formCol: SvgLeagueTableColDefinition,
  rowY: number,
  formLabel: (result: string) => string,
): string[] {
  const results = team.form.split("").slice(0, 5);
  const totalWidth =
    results.length * (FORM_SQUARE_SIZE + FORM_SQUARE_GAP) - FORM_SQUARE_GAP;
  const startX = formCol.x + (formCol.w - totalWidth) / 2;
  const squareY = rowY + (ROW_H - FORM_SQUARE_SIZE) / 2;

  return results.flatMap((r, i) => {
    const x = startX + i * (FORM_SQUARE_SIZE + FORM_SQUARE_GAP);
    const centerX = x + FORM_SQUARE_SIZE / 2;
    const labelY = squareY + FORM_SQUARE_SIZE / 2 + 4;
    return [
      `<rect x="${x}" y="${squareY}" width="${FORM_SQUARE_SIZE}" height="${FORM_SQUARE_SIZE}" rx="2" fill="${formSquareColor(r)}"/>`,
      svgText(
        centerX,
        labelY,
        "middle",
        SvgReportsColors.FORM_LABEL,
        LeagueTableFontSizes.FORM_LABEL,
        "bold",
        formLabel(r),
      ),
    ];
  });
}

function renderTeamRow(
  team: LeagueTeamInfo,
  rowIndex: number,
  cols: SvgLeagueTableColDefinition[],
  formLabel: (result: string) => string,
): string[] {
  const rowY = HEADER_H + COL_HEADER_H + rowIndex * ROW_H;
  const rowBg =
    rowIndex % 2 === 0 ? SvgReportsColors.ROW_ODD : SvgReportsColors.ROW_EVEN;
  const textY = rowY + ROW_H / 2 + 5;
  const logoX = cols[1].x + ROW_LOGO_PADDING;
  const logoY = rowY + (ROW_H - ROW_LOGO_SIZE) / 2;

  const stats = [
    team.played,
    team.won,
    team.draw,
    team.lost,
    team.goalsFor,
    team.goalsAgainst,
  ];

  return [
    svgRect(0, rowY, STANDINGS_SVG_W, ROW_H, rowBg),
    svgText(
      cols[0].x + cols[0].w / 2,
      textY,
      "middle",
      SvgReportsColors.TEXT,
      LeagueTableFontSizes.BODY,
      "bold",
      String(team.rank),
    ),
    svgImage(team.logo, logoX, logoY, ROW_LOGO_SIZE),
    svgText(
      logoX + ROW_LOGO_SIZE + ROW_LOGO_NAME_GAP,
      textY,
      "start",
      SvgReportsColors.TEXT,
      LeagueTableFontSizes.BODY,
      "bold",
      escapeXml(team.teamName.toUpperCase()),
    ),
    svgText(
      cols[2].x + cols[2].w / 2,
      textY,
      "middle",
      SvgReportsColors.YELLOW,
      LeagueTableFontSizes.POINTS,
      "bold",
      String(team.points),
    ),
    ...stats.map((val, si) =>
      svgText(
        cols[3 + si].x + cols[3 + si].w / 2,
        textY,
        "middle",
        SvgReportsColors.TEXT_MUTED,
        LeagueTableFontSizes.BODY,
        "normal",
        String(val),
      ),
    ),
    ...renderFormSquares(team, cols[9], rowY, formLabel),
    svgHLine(rowY + ROW_H, STANDINGS_SVG_W, SvgReportsColors.BORDER),
  ];
}

function renderFooter(teamCount: number): string[] {
  const y = HEADER_H + COL_HEADER_H + teamCount * ROW_H;
  return [
    svgRect(0, y, STANDINGS_SVG_W, FOOTER_H, SvgReportsColors.HEADER_BG),
    svgText(
      STANDINGS_SVG_W / 2,
      y + FOOTER_H / 2 + 5,
      "middle",
      SvgReportsColors.ORANGE,
      LeagueTableFontSizes.FOOTER,
      "bold",
      "futballero.com",
    ),
  ];
}

export function buildStandingsSvgString(
  teams: LeagueTeamInfo[],
  leagueName: string,
  leagueLogo: string | undefined,
  groupLabel: string | undefined,
  cols: SvgLeagueTableColDefinition[],
  formLabel: (result: string) => string,
): string {
  const svgH = getStandingsSvgH(teams.length);

  const elements = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
      ` width="${STANDINGS_SVG_W}" height="${svgH}" viewBox="0 0 ${STANDINGS_SVG_W} ${svgH}">`,
    svgRect(0, 0, STANDINGS_SVG_W, svgH, SvgReportsColors.BG),
    ...renderHeader(leagueName, leagueLogo, groupLabel),
    ...renderColHeaders(cols),
    ...teams.flatMap((team, i) => renderTeamRow(team, i, cols, formLabel)),
    ...renderFooter(teams.length),
    "</svg>",
  ];

  return elements.join("\n");
}
