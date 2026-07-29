import {
  SvgReportsColors,
  SvgReportsFonts,
  escapeXml,
} from "../../utils/svgreports/svgreports";
import {
  PlayerSvgStrategy,
  SVGTransferOrTrophyItem,
} from "../../types/svg-reports";

const PHOTO_SIZE = 100;
const PHOTO_Y = 10;
const TEXT_TITLE_Y = PHOTO_Y + PHOTO_SIZE + 24;
const TEXT_NAME_Y = TEXT_TITLE_Y + 26;

export const PLAYER_HISTORY_HEADER_H = TEXT_NAME_Y + 20;
export const PLAYER_HISTORY_FOOTER_H = 32;
export const PLAYER_HISTORY_PADDING = 16;

export const playerHistorySVGText = (
  content: string,
  x: number,
  y: number,
  opts: { fill?: string; size?: number; weight?: string; anchor?: string } = {},
): string =>
  `<text x="${x}" y="${y}" fill="${opts.fill ?? SvgReportsColors.WHITE}" font-size="${opts.size ?? 13}" font-weight="${opts.weight ?? "normal"}" text-anchor="${opts.anchor ?? "start"}" font-family="${SvgReportsFonts.DEFAULT}">${escapeXml(content)}</text>`;

export const playerHistorySVGImage = (
  href: string | null | undefined,
  x: number,
  y: number,
  size: number,
): string =>
  href
    ? `<image href="${escapeXml(href)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`
    : "";

export const getPlayerHistorySvgDimensions = (
  strategy: PlayerSvgStrategy,
  rowCount: number,
): { width: number; height: number } => ({
  width: strategy.width,
  height: strategy.headerHeight + rowCount * strategy.rowHeight + PLAYER_HISTORY_FOOTER_H,
});

export const buildPlayerHistorySvgString = (
  strategy: PlayerSvgStrategy,
  items: SVGTransferOrTrophyItem[],
  playerName: string,
): string => {
  const rows = strategy.filterItems(items);
  const { width: w, height: h } = getPlayerHistorySvgDimensions(
    strategy,
    rows.length,
  );

  const photoX = (w - PHOTO_SIZE) / 2;

  const header = [
    `<rect width="${w}" height="${h}" fill="${SvgReportsColors.DARK_BG}"/>`,
    `<rect x="0" y="0" width="${w}" height="4" fill="${SvgReportsColors.TRIVIA_YELLOW}"/>`,
    playerHistorySVGImage(strategy.photoUrl, photoX, PHOTO_Y, PHOTO_SIZE),
    playerHistorySVGText(strategy.getTitle(playerName), w / 2, TEXT_TITLE_Y, {
      fill: SvgReportsColors.TRIVIA_YELLOW,
      size: 18,
      weight: "bold",
      anchor: "middle",
    }),
    strategy.showPlayerName
      ? playerHistorySVGText(playerName, w / 2, TEXT_NAME_Y, {
          fill: SvgReportsColors.WHITE,
          size: 14,
          anchor: "middle",
        })
      : "",
  ].join("");

  const rowsSvg = rows
    .map((item, idx) => {
      const y = strategy.headerHeight + idx * strategy.rowHeight;
      const bg =
        idx % 2 === 0 ? SvgReportsColors.CARD_BG : SvgReportsColors.DARK_BG;
      return (
        `<rect x="0" y="${y}" width="${w}" height="${strategy.rowHeight}" fill="${bg}"/>` +
        strategy.renderRow(item, PLAYER_HISTORY_PADDING, y, w)
      );
    })
    .join("");

  const footer = playerHistorySVGText("futballero.com", w / 2, h - 10, {
    fill: SvgReportsColors.TRIVIA_ORANGE,
    size: 14,
    weight: "bold",
    anchor: "middle",
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">${header}${rowsSvg}${footer}</svg>`;
};
