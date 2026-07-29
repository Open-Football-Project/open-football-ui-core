import {
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  SvgReportsColors,
  SvgReportsFonts,
} from "../../utils";

export const PLAYER_CARD_SVG_W = 280;

const CX = PLAYER_CARD_SVG_W / 2;
const HEADER_H = 36;
const PHOTO_AREA_H = 130;
const PHOTO_SIZE = 90;
const TEAM_LOGO_SIZE = 26;
const STAT_ROW_H = 22;
const BOTTOM_PAD = 16;
const FOOTER_H = 24;

export enum PlayerSvgLabel {
  AGE = "AGE",
  POSITION = "POSITION",
  PLAYER_NUMBER = "PLAYER_NUMBER",
  GOALS = "GOALS",
  ASSISTS = "ASSISTS",
  YELLOW_CARDS = "YELLOW_CARDS",
  RED_CARDS = "RED_CARDS",
  APPEARANCES = "APPEARANCES",
}

export type PlayerSvgLabels = Map<PlayerSvgLabel, string>;

export interface PlayerCardSvgData {
  playerName: string;
  playerPhoto: string;
  playerAge?: number;
  position?: string;
  playerNumber?: number;
  playerTeamName?: string;
  playerTeamLogo?: string;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  appearances?: number;
  rank?: number;
  label?: string;
}

export const obscurePlayerName = (name: string): string =>
  name.replace(/[^\s]/g, "_");

const hasTeamSection = (data: PlayerCardSvgData): boolean =>
  data.playerTeamLogo !== undefined || data.playerTeamName !== undefined;

const teamSectionH = (data: PlayerCardSvgData): number => {
  if (!hasTeamSection(data)) return 0;
  let height = 8;
  if (data.playerTeamLogo) height += TEAM_LOGO_SIZE + 4;
  if (data.playerTeamName) height += 18;
  height += 8;
  return height;
};

const countStatRows = (data: PlayerCardSvgData): number =>
  [
    data.goals !== undefined || data.assists !== undefined,
    data.yellowCards !== undefined || data.redCards !== undefined,
    data.appearances !== undefined,
  ].filter(Boolean).length;

export const getPlayerCardSvgH = (data: PlayerCardSvgData): number => {
  let height = HEADER_H + PHOTO_AREA_H + 28;
  if (data.playerAge !== undefined) height += 20;
  if (data.position !== undefined) height += 20;
  if (data.playerNumber !== undefined) height += 20;
  height += teamSectionH(data);
  const rows = countStatRows(data);
  if (rows > 0) height += 16 + rows * STAT_ROW_H;
  height += BOTTOM_PAD + FOOTER_H;
  return height;
};

function footerItems(footerY: number): string[] {
  return [
    svgRect(
      0,
      footerY,
      PLAYER_CARD_SVG_W,
      FOOTER_H,
      SvgReportsColors.HEADER_BG,
    ),
    svgText(
      PLAYER_CARD_SVG_W / 2,
      footerY + FOOTER_H / 2 + 5,
      "middle",
      SvgReportsColors.ORANGE,
      14,
      "bold",
      "footballproject.org",
    ),
  ];
}

const svgStatLine = (
  x: number,
  y: number,
  label: string,
  value: string,
): string =>
  `<text x="${x}" y="${y}" font-size="10" font-family="${SvgReportsFonts.DEFAULT}">` +
  `<tspan fill="${SvgReportsColors.TEXT_MUTED}">${escapeXml(label)}: </tspan>` +
  `<tspan fill="${SvgReportsColors.YELLOW}" font-weight="bold">${escapeXml(value)}</tspan>` +
  `</text>`;

const label = (labels: PlayerSvgLabels, key: PlayerSvgLabel): string =>
  labels.get(key) ?? "";

export const buildPlayerCardSvgString = (
  data: PlayerCardSvgData,
  labels: PlayerSvgLabels,
): string => {
  const W = PLAYER_CARD_SVG_W;
  const H = getPlayerCardSvgH(data);
  const parts: string[] = [];

  parts.push(svgRect(0, 0, W, H, SvgReportsColors.BG));
  parts.push(svgRect(0, 0, W, HEADER_H, SvgReportsColors.HEADER_BG));

  if (data.rank !== undefined) {
    parts.push(
      svgText(
        14,
        HEADER_H / 2 + 5,
        "start",
        SvgReportsColors.YELLOW,
        13,
        "bold",
        `#${data.rank}`,
      ),
    );
  }
  if (data.label) {
    parts.push(
      svgText(
        CX,
        HEADER_H / 2 + 5,
        "middle",
        SvgReportsColors.TEXT,
        11,
        "normal",
        escapeXml(data.label),
      ),
    );
  }

  const imgX = CX - PHOTO_SIZE / 2;
  const imgY = HEADER_H + (PHOTO_AREA_H - PHOTO_SIZE) / 2;
  parts.push(svgImage(data.playerPhoto, imgX, imgY, PHOTO_SIZE));

  let y = HEADER_H + PHOTO_AREA_H + 8;

  parts.push(
    svgText(
      CX,
      y + 14,
      "middle",
      SvgReportsColors.YELLOW,
      13,
      "bold",
      escapeXml(data.playerName),
    ),
  );
  y += 28;

  if (data.playerAge !== undefined) {
    parts.push(
      svgText(
        CX,
        y + 13,
        "middle",
        SvgReportsColors.TEXT_MUTED,
        11,
        "normal",
        `${label(labels, PlayerSvgLabel.AGE)}: ${data.playerAge}`,
      ),
    );
    y += 20;
  }

  if (data.position !== undefined) {
    parts.push(
      svgText(
        CX,
        y + 13,
        "middle",
        SvgReportsColors.TEXT_MUTED,
        11,
        "normal",
        `${label(labels, PlayerSvgLabel.POSITION)}: ${escapeXml(data.position)}`,
      ),
    );
    y += 20;
  }

  if (data.playerNumber !== undefined) {
    parts.push(
      svgText(
        CX,
        y + 13,
        "middle",
        SvgReportsColors.TEXT_MUTED,
        11,
        "normal",
        `${label(labels, PlayerSvgLabel.PLAYER_NUMBER)}: ${data.playerNumber}`,
      ),
    );
    y += 20;
  }

  if (hasTeamSection(data)) {
    y += 8;
    if (data.playerTeamLogo) {
      parts.push(
        svgImage(
          data.playerTeamLogo,
          CX - TEAM_LOGO_SIZE / 2,
          y,
          TEAM_LOGO_SIZE,
        ),
      );
      y += TEAM_LOGO_SIZE + 4;
    }
    if (data.playerTeamName) {
      parts.push(
        svgText(
          CX,
          y + 13,
          "middle",
          SvgReportsColors.TEXT,
          11,
          "normal",
          escapeXml(data.playerTeamName),
        ),
      );
      y += 18;
    }
    y += 8;
  }

  const rows = countStatRows(data);
  if (rows > 0) {
    parts.push(svgHLine(y + 8, W, SvgReportsColors.BORDER));
    y += 16;

    const LEFT_X = 16;
    const RIGHT_X = W / 2 + 8;

    if (data.goals !== undefined || data.assists !== undefined) {
      const rowY = y + 14;
      if (data.goals !== undefined) {
        parts.push(
          svgStatLine(
            LEFT_X,
            rowY,
            label(labels, PlayerSvgLabel.GOALS),
            String(data.goals),
          ),
        );
      }
      if (data.assists !== undefined) {
        parts.push(
          svgStatLine(
            RIGHT_X,
            rowY,
            label(labels, PlayerSvgLabel.ASSISTS),
            String(data.assists),
          ),
        );
      }
      y += STAT_ROW_H;
    }

    if (data.yellowCards !== undefined || data.redCards !== undefined) {
      const rowY = y + 14;
      if (data.yellowCards !== undefined) {
        parts.push(
          svgStatLine(
            LEFT_X,
            rowY,
            label(labels, PlayerSvgLabel.YELLOW_CARDS),
            String(data.yellowCards),
          ),
        );
      }
      if (data.redCards !== undefined) {
        parts.push(
          svgStatLine(
            RIGHT_X,
            rowY,
            label(labels, PlayerSvgLabel.RED_CARDS),
            String(data.redCards),
          ),
        );
      }
      y += STAT_ROW_H;
    }

    if (data.appearances !== undefined) {
      parts.push(
        svgStatLine(
          LEFT_X,
          y + 14,
          label(labels, PlayerSvgLabel.APPEARANCES),
          String(data.appearances),
        ),
      );
      y += STAT_ROW_H;
    }
  }

  footerItems(H - FOOTER_H).forEach((item) => parts.push(item));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${SvgReportsFonts.DEFAULT}">${parts.join("")}</svg>`;
};
