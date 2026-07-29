import {
  PlayerHistoryQuizMixSvgLabels,
  PlayerSvgStrategy,
  SVGItemKind,
  SVGTransferOrTrophyItem,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import {
  PLAYER_HISTORY_HEADER_H,
  playerHistorySVGImage,
  playerHistorySVGText,
} from "./player-svg-strategy";

const MAX_HINTS = 6;
const BADGE_W = 52;
const BADGE_H = 20;
const BADGE_RADIUS = 4;
const LOGO_SIZE = 22;
const ARROW_GAP = 22;

const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export class QuizMixSvgStrategy implements PlayerSvgStrategy {
  readonly rowHeight = 58;
  readonly width = 600;
  readonly headerHeight = PLAYER_HISTORY_HEADER_H;
  readonly showPlayerName = false;

  get photoUrl(): string {
    return this.labels.photoUrl;
  }

  constructor(private readonly labels: PlayerHistoryQuizMixSvgLabels) {}

  filterItems(items: SVGTransferOrTrophyItem[]): SVGTransferOrTrophyItem[] {
    return shuffleArray(items).slice(0, MAX_HINTS);
  }

  renderRow(
    item: SVGTransferOrTrophyItem,
    x: number,
    y: number,
    w: number,
  ): string {
    const midY = y + this.rowHeight / 2 + 5;
    const badgeY = y + (this.rowHeight - BADGE_H) / 2;
    const contentX = x + BADGE_W + 12;

    const isTransfer = item.kind === SVGItemKind.Transfer;
    const badgeColor = isTransfer
      ? SvgReportsColors.TRIVIA_BLUE
      : SvgReportsColors.TRIVIA_YELLOW;
    const badgeLabel = isTransfer
      ? this.labels.transferLabel
      : this.labels.trophyLabel;

    const badge = [
      `<rect x="${x}" y="${badgeY}" width="${BADGE_W}" height="${BADGE_H}" rx="${BADGE_RADIUS}" fill="${badgeColor}"/>`,
      playerHistorySVGText(badgeLabel, x + BADGE_W / 2, badgeY + 14, {
        fill: SvgReportsColors.DARK_BG,
        size: 10,
        weight: "bold",
        anchor: "middle",
      }),
    ].join("");

    let content = "";
    if (item.kind === SVGItemKind.Transfer) {
      const { date, fromTeamName, fromTeamLogo, toTeamName, toTeamLogo } = item;
      const arrowX = Math.round(w / 2);
      const logoY = y + (this.rowHeight - LOGO_SIZE) / 2;
      const fromLogoX = arrowX - ARROW_GAP - LOGO_SIZE;
      const toLogoX = arrowX + ARROW_GAP;
      content = [
        playerHistorySVGText(date ?? "", contentX, midY, {
          fill: SvgReportsColors.TRIVIA_GRAY,
          size: 11,
        }),
        playerHistorySVGText(fromTeamName ?? "", fromLogoX - 8, midY, {
          size: 12,
          anchor: "end",
        }),
        playerHistorySVGImage(fromTeamLogo, fromLogoX, logoY, LOGO_SIZE),
        playerHistorySVGText("\u2192", arrowX, midY, {
          fill: SvgReportsColors.TRIVIA_ORANGE,
          size: 22,
          weight: "bold",
          anchor: "middle",
        }),
        playerHistorySVGImage(toTeamLogo, toLogoX, logoY, LOGO_SIZE),
        playerHistorySVGText(toTeamName ?? "", toLogoX + LOGO_SIZE + 6, midY, {
          size: 12,
        }),
      ].join("");
    } else {
      const { leagueName, place, season } = item;
      content = [
        playerHistorySVGText(leagueName ?? "", contentX, midY, {
          fill: SvgReportsColors.TRIVIA_YELLOW,
          size: 12,
          weight: "bold",
        }),
        playerHistorySVGText(place ?? "", contentX + 200, midY, {
          fill: SvgReportsColors.TRIVIA_ORANGE,
          size: 12,
        }),
        playerHistorySVGText(season ?? "", contentX + 320, midY, { size: 12 }),
      ].join("");
    }

    return badge + content;
  }

  getTitle(_playerName: string): string {
    return this.labels.title;
  }

  getFilename(playerName: string): string {
    return `${playerName.replace(/\s+/g, "-").toLowerCase()}-quiz.png`;
  }
}
