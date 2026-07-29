import {
  TriviaSvgResult,
  TriviaSvgConfig,
  SVGItemKind,
  SVGPLayerTransferItem,
  SVGPlayerTrophyItem,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import {
  GAME_SVG_PADDING,
  GAME_SVG_WIDTH,
  buildTriviaSvg,
  getGameSvgDimensions,
  triviaSVGImage,
  triviaSVGText,
  wrapGameRow,
} from "./trivia-svg-builder";

const ROW_H = 60;
const LOGO_SIZE = 24;
const ARROW_CENTER_X = Math.round(GAME_SVG_WIDTH / 2);
const ARROW_GAP = 24;

const renderTransferRow = (
  hint: SVGPLayerTransferItem,
  index: number,
  y: number,
): string => {
  const midY = y + Math.round(ROW_H / 2) + 5;
  const logoY = y + Math.round((ROW_H - LOGO_SIZE) / 2);
  const fromLogoX = ARROW_CENTER_X - ARROW_GAP - LOGO_SIZE;
  const toLogoX = ARROW_CENTER_X + ARROW_GAP;

  const content = [
    triviaSVGText("💼", GAME_SVG_PADDING, midY, {
      fill: SvgReportsColors.TRIVIA_BLUE,
      size: 15,
    }),
    triviaSVGText(`${hint.label ?? ""}:`, GAME_SVG_PADDING + 28, midY, {
      fill: SvgReportsColors.TRIVIA_BLUE,
      size: 13,
      weight: "bold",
    }),
    triviaSVGImage(hint.fromTeamLogo, fromLogoX, logoY, LOGO_SIZE),
    triviaSVGText("→", ARROW_CENTER_X, midY, {
      fill: SvgReportsColors.TRIVIA_ORANGE,
      size: 20,
      weight: "bold",
      anchor: "middle",
    }),
    triviaSVGImage(hint.toTeamLogo, toLogoX, logoY, LOGO_SIZE),
    triviaSVGText(hint.description ?? "", toLogoX + LOGO_SIZE + 8, midY, {
      fill: SvgReportsColors.TRIVIA_GRAY,
      size: 12,
    }),
  ].join("");

  return wrapGameRow(index, y, ROW_H, content);
};

const renderTrophyRow = (
  hint: SVGPlayerTrophyItem,
  index: number,
  y: number,
): string => {
  const midY = y + Math.round(ROW_H / 2) + 5;

  const content = [
    triviaSVGText("🏆", GAME_SVG_PADDING, midY, {
      fill: SvgReportsColors.TRIVIA_YELLOW,
      size: 15,
    }),
    triviaSVGText(`${hint.label ?? ""}:`, GAME_SVG_PADDING + 28, midY, {
      fill: SvgReportsColors.TRIVIA_YELLOW,
      size: 13,
      weight: "bold",
    }),
    triviaSVGText(hint.description ?? "", GAME_SVG_PADDING + 110, midY, {
      fill: SvgReportsColors.WHITE,
      size: 13,
    }),
  ].join("");

  return wrapGameRow(index, y, ROW_H, content);
};

export const buildPlayerTriviaSvg = (
  config: TriviaSvgConfig,
): TriviaSvgResult => {
  const { title, subtitle, hints, options, filename } = config;
  const svgString = buildTriviaSvg(
    title,
    subtitle,
    hints.length,
    ROW_H,
    (startY) =>
      hints
        .map((hint, i) => {
          const y = startY + i * ROW_H;
          return hint.kind === SVGItemKind.Transfer
            ? renderTransferRow(hint, i, y)
            : renderTrophyRow(hint, i, y);
        })
        .join(""),
    options,
  );
  const { width, height } = getGameSvgDimensions(hints.length, ROW_H, options);
  return { svgString, width, height, filename };
};
