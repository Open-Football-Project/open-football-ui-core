import {
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  SvgReportsColors,
  SITE_DOMAIN,
} from "../../utils";

import { TeamStatistic } from "../../types";

export const TEAM_STATS_SVG_W = 400;

const PADDING = 16;
const HEADER_H = 64;
const LOGO_SIZE = 28;
const STAT_ROW_H = 46;
const BAR_H = 10;
const FOOTER_H = 40;

export const getTeamStatsSvgH = (statCount: number): number =>
  HEADER_H + statCount * STAT_ROW_H + FOOTER_H;

const barFillColor = (percent: number, isPositive: boolean): string => {
  if (isPositive && percent <= 20) return SvgReportsColors.DANGER;
  if (isPositive && percent <= 50) return SvgReportsColors.ORANGE;
  if (isPositive) return SvgReportsColors.SUCCESS;
  if (!isPositive && percent <= 20) return SvgReportsColors.SUCCESS;
  if (!isPositive && percent <= 50) return SvgReportsColors.ORANGE;
  return SvgReportsColors.DANGER;
};

const statPercent = (stat: TeamStatistic): number =>
  stat.total > 0 ? Math.min((stat.value / stat.total) * 100, 100) : 0;

export interface TeamStatsSvgData {
  title: string;
  statistics: TeamStatistic[];
  logo?: string;
  statLabel: (statName: string) => string;
}

export function buildTeamStatsSvgString(data: TeamStatsSvgData): string {
  const { title, statistics, logo, statLabel } = data;
  const totalH = getTeamStatsSvgH(statistics.length);
  const barAvailW = TEAM_STATS_SVG_W - PADDING * 2;
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TEAM_STATS_SVG_W}" height="${totalH}">`,
  );

  parts.push(
    svgRect(0, 0, TEAM_STATS_SVG_W, HEADER_H, SvgReportsColors.HEADER_BG),
  );
  if (logo) {
    parts.push(svgImage(logo, PADDING, (HEADER_H - LOGO_SIZE) / 2, LOGO_SIZE));
  }

  const titleX = logo ? PADDING + LOGO_SIZE + 8 : PADDING;
  const titleY = Math.round(HEADER_H / 2) + 6;
  parts.push(
    svgText(
      titleX,
      titleY,
      "start",
      SvgReportsColors.TEXT,
      16,
      "bold",
      escapeXml(title),
    ),
  );
  parts.push(svgHLine(HEADER_H, TEAM_STATS_SVG_W, SvgReportsColors.BORDER));

  statistics.forEach((stat, idx) => {
    const rowY = HEADER_H + idx * STAT_ROW_H;
    const rowBg =
      idx % 2 === 0 ? SvgReportsColors.ROW_ODD : SvgReportsColors.ROW_EVEN;
    const pct = statPercent(stat);
    const barFillW = Math.round((pct / 100) * barAvailW);
    const fillColor = barFillColor(pct, stat.isPositive);
    const labelY = rowY + 18;
    const barY = rowY + 26;

    parts.push(svgRect(0, rowY, TEAM_STATS_SVG_W, STAT_ROW_H, rowBg));
    parts.push(
      svgText(
        PADDING,
        labelY,
        "start",
        SvgReportsColors.TEXT,
        12,
        "normal",
        escapeXml(statLabel(stat.name)),
      ),
    );
    parts.push(
      svgText(
        TEAM_STATS_SVG_W - PADDING,
        labelY,
        "end",
        SvgReportsColors.YELLOW,
        12,
        "bold",
        String(stat.value),
      ),
    );
    parts.push(svgRect(PADDING, barY, barAvailW, BAR_H, SvgReportsColors.BG));
    if (barFillW > 0) {
      parts.push(svgRect(PADDING, barY, barFillW, BAR_H, fillColor));
    }
    parts.push(
      svgHLine(rowY + STAT_ROW_H, TEAM_STATS_SVG_W, SvgReportsColors.BORDER),
    );
  });

  const footerY = HEADER_H + statistics.length * STAT_ROW_H;
  parts.push(
    svgRect(0, footerY, TEAM_STATS_SVG_W, FOOTER_H, SvgReportsColors.HEADER_BG),
  );
  parts.push(
    svgText(
      TEAM_STATS_SVG_W / 2,
      footerY + Math.round(FOOTER_H / 2) + 5,
      "middle",
      SvgReportsColors.ORANGE,
      14,
      "bold",
      SITE_DOMAIN,
    ),
  );

  parts.push("</svg>");
  return parts.join("\n");
}
