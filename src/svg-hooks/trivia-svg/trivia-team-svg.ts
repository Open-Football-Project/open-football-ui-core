import {
  TeamTriviaSvgHint,
  TriviaSvgConfig,
  TriviaSvgResult,
} from "../../types";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import {
  GAME_SVG_PADDING,
  buildTriviaSvg,
  getGameSvgDimensions,
  triviaSVGText,
  wrapGameRow,
} from "./trivia-svg-builder";

const ROW_H = 52;

const VALUE_X = 500;

const renderTeamHintRow = (
  hint: TeamTriviaSvgHint,
  index: number,
  y: number,
): string => {
  const midY = y + Math.round(ROW_H / 2) + 5;

  const content = [
    triviaSVGText(hint.emoji, GAME_SVG_PADDING, midY, { size: 14 }),
    triviaSVGText(hint.label, GAME_SVG_PADDING + 26, midY, {
      fill: SvgReportsColors.TRIVIA_ORANGE,
      size: 13,
    }),
    triviaSVGText(hint.value, VALUE_X, midY, {
      fill: SvgReportsColors.TRIVIA_GRAY,
      size: 13,
      weight: "bold",
    }),
    `<line x1="${VALUE_X - 10}" y1="${y + 12}" x2="${VALUE_X - 10}" y2="${y + ROW_H - 12}" stroke="${SvgReportsColors.TRIVIA_BORDER}" stroke-width="1"/>`,
  ].join("");

  return wrapGameRow(index, y, ROW_H, content);
};

export const buildTeamTriviaSvg = (
  config: TriviaSvgConfig<TeamTriviaSvgHint>,
): TriviaSvgResult => {
  const { title, subtitle, hints, options, filename } = config;
  const svgString = buildTriviaSvg(
    title,
    subtitle,
    hints.length,
    ROW_H,
    (startY) =>
      hints
        .map((hint, i) => renderTeamHintRow(hint, i, startY + i * ROW_H))
        .join(""),
    options,
  );
  const { width, height } = getGameSvgDimensions(hints.length, ROW_H, options);
  return { svgString, width, height, filename };
};
