import {
  SvgReportsColors,
  SvgReportsFonts,
  escapeXml,
  SITE_DOMAIN,
} from "../../utils/svgreports/svgreports";

export const GAME_SVG_WIDTH = 800;
export const GAME_SVG_HEADER_H = 76;
export const GAME_SVG_FOOTER_H = 32;
export const GAME_SVG_PADDING = 16;

const OPTIONS_PER_ROW = 3;
const OPTION_H = 36;
const OPTION_GAP = 8;
const OPTION_RADIUS = 8;
const OPTIONS_HEADER_H = 28;

export const triviaSVGText = (
  content: string,
  x: number,
  y: number,
  opts: { fill?: string; size?: number; weight?: string; anchor?: string } = {},
): string =>
  `<text x="${x}" y="${y}" fill="${opts.fill ?? SvgReportsColors.WHITE}" font-size="${opts.size ?? 14}" font-weight="${opts.weight ?? "normal"}" text-anchor="${opts.anchor ?? "start"}" font-family="${SvgReportsFonts.DEFAULT}">${escapeXml(content)}</text>`;

export const triviaSVGImage = (
  href: string | null | undefined,
  x: number,
  y: number,
  size: number,
): string =>
  href
    ? `<image href="${escapeXml(href)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`
    : "";

const getOptionsHeight = (options: string[]): number => {
  const rowCount = Math.ceil(options.length / OPTIONS_PER_ROW);
  return OPTIONS_HEADER_H + rowCount * (OPTION_H + OPTION_GAP);
};

const renderGameOptions = (
  options: string[],
  startY: number,
  w: number,
): string => {
  const optW =
    (w - GAME_SVG_PADDING * 2 - OPTION_GAP * (OPTIONS_PER_ROW - 1)) /
    OPTIONS_PER_ROW;

  const divider = `<line x1="${GAME_SVG_PADDING}" y1="${startY + 10}" x2="${w - GAME_SVG_PADDING}" y2="${startY + 10}" stroke="${SvgReportsColors.TRIVIA_BORDER}" stroke-width="1"/>`;

  const boxes = options
    .map((opt, i) => {
      const col = i % OPTIONS_PER_ROW;
      const row = Math.floor(i / OPTIONS_PER_ROW);
      const x = GAME_SVG_PADDING + col * (optW + OPTION_GAP);
      const y = startY + OPTIONS_HEADER_H + row * (OPTION_H + OPTION_GAP);
      return [
        `<rect x="${x}" y="${y}" width="${optW}" height="${OPTION_H}" rx="${OPTION_RADIUS}" fill="${SvgReportsColors.CARD_BG}" stroke="${SvgReportsColors.TRIVIA_BORDER}" stroke-width="1"/>`,
        triviaSVGText(opt, x + optW / 2, y + OPTION_H / 2 + 5, {
          size: 12,
          anchor: "middle",
        }),
      ].join("");
    })
    .join("");

  return divider + boxes;
};

export const getGameSvgDimensions = (
  rowCount: number,
  rowHeight: number,
  options?: string[],
): { width: number; height: number } => ({
  width: GAME_SVG_WIDTH,
  height:
    GAME_SVG_HEADER_H +
    rowCount * rowHeight +
    (options?.length ? getOptionsHeight(options) : 0) +
    GAME_SVG_FOOTER_H,
});

export const wrapGameRow = (
  index: number,
  y: number,
  rowHeight: number,
  content: string,
): string =>
  `<rect x="0" y="${y}" width="${GAME_SVG_WIDTH}" height="${rowHeight}" fill="${index % 2 === 0 ? SvgReportsColors.CARD_BG : SvgReportsColors.DARK_BG}"/>` +
  content;

export const buildTriviaSvg = (
  title: string,
  subtitle: string,
  rowCount: number,
  rowHeight: number,
  renderRows: (startY: number) => string,
  options?: string[],
): string => {
  const { width: w, height: h } = getGameSvgDimensions(
    rowCount,
    rowHeight,
    options,
  );
  const rowsStartY = GAME_SVG_HEADER_H;
  const optionsStartY = rowsStartY + rowCount * rowHeight;

  const header = [
    `<rect width="${w}" height="${h}" fill="${SvgReportsColors.DARK_BG}"/>`,
    `<rect x="0" y="0" width="${w}" height="4" fill="${SvgReportsColors.TRIVIA_YELLOW}"/>`,
    triviaSVGText(title, w / 2, 38, {
      fill: SvgReportsColors.TRIVIA_YELLOW,
      size: 20,
      weight: "bold",
      anchor: "middle",
    }),
    triviaSVGText(subtitle, w / 2, 62, {
      fill: SvgReportsColors.WHITE,
      size: 14,
      anchor: "middle",
    }),
  ].join("");

  const optionsSvg = options?.length
    ? renderGameOptions(options, optionsStartY, w)
    : "";

  const footer = triviaSVGText(SITE_DOMAIN, w / 2, h - 10, {
    fill: SvgReportsColors.TRIVIA_ORANGE,
    size: 14,
    weight: "bold",
    anchor: "middle",
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">${header}${renderRows(rowsStartY)}${optionsSvg}${footer}</svg>`;
};
