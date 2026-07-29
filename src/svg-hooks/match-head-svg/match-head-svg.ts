import {
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  SvgReportsColors,
} from "../../utils";

export const MATCH_INFO_SVG_W = 480;

const PADDING = 16;
const LEAGUE_H = 48;
const TEAMS_H = 100;
const SCORES_H = 42;
const INFO_H = 54;
const STATUS_H = 30;
const FOOTER_H = 40;
const LOGO_SIZE = 44;

export const getMatchInfoSvgH = (hasStatus: boolean): number =>
  LEAGUE_H +
  TEAMS_H +
  SCORES_H +
  INFO_H +
  (hasStatus ? STATUS_H : 0) +
  FOOTER_H;

const COL_W = MATCH_INFO_SVG_W / 3;
const CENTER_X = MATCH_INFO_SVG_W / 2;
const HOME_CX = COL_W / 2;
const AWAY_CX = MATCH_INFO_SVG_W - COL_W / 2;

const scoreStr = (home?: number, away?: number): string =>
  `${home ?? "-"} : ${away ?? "-"}`;

const truncate = (s: string, max: number): string =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

export interface ScoreBreakdown {
  halftime?: { home?: number; away?: number };
  fulltime?: { home?: number; away?: number };
  extratime?: { home?: number; away?: number };
  penalty?: { home?: number; away?: number };
}

export interface MatchInfoSvgLabels {
  ht: string;
  ft: string;
  et: string;
  pen: string;
}

export interface MatchInfoSvgData {
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  goalsHome?: number;
  goalsAway?: number;
  score: ScoreBreakdown;
  leagueName: string;
  leagueLogo?: string;
  venueName?: string;
  venueCity?: string;
  formattedDate: string;
  statusLabel?: string; // omit when live
  labels: MatchInfoSvgLabels;
}

export function buildMatchInfoSvgString(data: MatchInfoSvgData): string {
  const {
    homeTeamName,
    homeTeamLogo,
    awayTeamName,
    awayTeamLogo,
    goalsHome,
    goalsAway,
    score,
    leagueName,
    leagueLogo,
    venueName,
    venueCity,
    formattedDate,
    statusLabel,
    labels,
  } = data;

  const hasStatus = !!statusLabel;
  const totalH = getMatchInfoSvgH(hasStatus);
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MATCH_INFO_SVG_W}" height="${totalH}">`,
  );

  parts.push(
    svgRect(0, 0, MATCH_INFO_SVG_W, LEAGUE_H, SvgReportsColors.HEADER_BG),
  );
  if (leagueLogo) {
    parts.push(svgImage(leagueLogo, PADDING, (LEAGUE_H - 28) / 2, 28));
  }
  const leagueNameX = leagueLogo ? PADDING + 28 + 8 : CENTER_X;
  const leagueAnchor = leagueLogo ? "start" : "middle";
  parts.push(
    svgText(
      leagueNameX,
      Math.round(LEAGUE_H / 2) + 5,
      leagueAnchor,
      SvgReportsColors.TEXT,
      12,
      "bold",
      escapeXml(truncate(leagueName, 40)),
    ),
  );
  parts.push(svgHLine(LEAGUE_H, MATCH_INFO_SVG_W, SvgReportsColors.BORDER));

  const teamsY = LEAGUE_H;
  const logoY = teamsY + 10;
  const logoCY = logoY + Math.round(LOGO_SIZE / 2);
  const nameY = logoY + LOGO_SIZE + 14;

  parts.push(
    svgRect(0, teamsY, MATCH_INFO_SVG_W, TEAMS_H, SvgReportsColors.BG),
  );

  if (homeTeamLogo) {
    parts.push(
      svgImage(
        homeTeamLogo,
        Math.round(HOME_CX - LOGO_SIZE / 2),
        logoY,
        LOGO_SIZE,
      ),
    );
  }
  parts.push(
    svgText(
      HOME_CX,
      nameY,
      "middle",
      SvgReportsColors.TEXT,
      12,
      "bold",
      escapeXml(truncate(homeTeamName, 14)),
    ),
  );

  if (awayTeamLogo) {
    parts.push(
      svgImage(
        awayTeamLogo,
        Math.round(AWAY_CX - LOGO_SIZE / 2),
        logoY,
        LOGO_SIZE,
      ),
    );
  }
  parts.push(
    svgText(
      AWAY_CX,
      nameY,
      "middle",
      SvgReportsColors.TEXT,
      12,
      "bold",
      escapeXml(truncate(awayTeamName, 14)),
    ),
  );

  parts.push(
    svgText(
      CENTER_X,
      logoCY + 8,
      "middle",
      SvgReportsColors.YELLOW,
      26,
      "bold",
      scoreStr(goalsHome, goalsAway),
    ),
  );

  parts.push(
    svgHLine(teamsY + TEAMS_H, MATCH_INFO_SVG_W, SvgReportsColors.BORDER),
  );

  const scoresY = teamsY + TEAMS_H;
  const scoreTextY = scoresY + Math.round(SCORES_H / 2);

  parts.push(
    svgRect(0, scoresY, MATCH_INFO_SVG_W, SCORES_H, SvgReportsColors.ROW_ODD),
  );

  const scoreItems: Array<{ label: string; value: string }> = [
    {
      label: labels.ht,
      value: scoreStr(score.halftime?.home, score.halftime?.away),
    },
    {
      label: labels.ft,
      value: scoreStr(score.fulltime?.home, score.fulltime?.away),
    },
    ...(score.extratime
      ? [
          {
            label: labels.et,
            value: scoreStr(score.extratime?.home, score.extratime?.away),
          },
        ]
      : []),
    ...(score.penalty
      ? [
          {
            label: labels.pen,
            value: scoreStr(score.penalty?.home, score.penalty?.away),
          },
        ]
      : []),
  ];

  const colW = MATCH_INFO_SVG_W / scoreItems.length;
  scoreItems.forEach((item, idx) => {
    const cx = Math.round(colW * idx + colW / 2);
    parts.push(
      svgText(
        cx,
        scoreTextY - 4,
        "middle",
        SvgReportsColors.ORANGE,
        10,
        "bold",
        item.label,
      ),
    );
    parts.push(
      svgText(
        cx,
        scoreTextY + 10,
        "middle",
        SvgReportsColors.TEXT,
        11,
        "bold",
        item.value,
      ),
    );
  });

  parts.push(
    svgHLine(scoresY + SCORES_H, MATCH_INFO_SVG_W, SvgReportsColors.BORDER),
  );

  const infoY = scoresY + SCORES_H;
  parts.push(svgRect(0, infoY, MATCH_INFO_SVG_W, INFO_H, SvgReportsColors.BG));

  let infoTextY = infoY + 16;
  if (venueName && venueCity) {
    parts.push(
      svgText(
        CENTER_X,
        infoTextY,
        "middle",
        SvgReportsColors.TEXT_MUTED,
        11,
        "normal",
        escapeXml(`\uD83D\uDCCD ${truncate(venueName, 30)}, ${venueCity}`),
      ),
    );
    infoTextY += 16;
  }
  parts.push(
    svgText(
      CENTER_X,
      infoTextY + 6,
      "middle",
      SvgReportsColors.YELLOW,
      11,
      "normal",
      escapeXml(`\uD83D\uDCC5 ${formattedDate}`),
    ),
  );

  parts.push(
    svgHLine(infoY + INFO_H, MATCH_INFO_SVG_W, SvgReportsColors.BORDER),
  );

  if (hasStatus) {
    const statusY = infoY + INFO_H;
    parts.push(
      svgRect(0, statusY, MATCH_INFO_SVG_W, STATUS_H, SvgReportsColors.ROW_ODD),
    );
    parts.push(
      svgText(
        CENTER_X,
        statusY + Math.round(STATUS_H / 2) + 5,
        "middle",
        SvgReportsColors.ORANGE,
        11,
        "normal",
        escapeXml(statusLabel!),
      ),
    );
    parts.push(
      svgHLine(statusY + STATUS_H, MATCH_INFO_SVG_W, SvgReportsColors.BORDER),
    );
  }

  const footerY = getMatchInfoSvgH(hasStatus) - FOOTER_H;
  parts.push(
    svgRect(0, footerY, MATCH_INFO_SVG_W, FOOTER_H, SvgReportsColors.HEADER_BG),
  );
  parts.push(
    svgText(
      CENTER_X,
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
