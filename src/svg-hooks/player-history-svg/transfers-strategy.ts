import {
  PlayerSvgStrategy,
  SVGItemKind,
  SVGPLayerTransferItem,
  SVGTransferOrTrophyItem,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import { PlayerHistorySvgLabels } from "../../types";
import {
  PLAYER_HISTORY_HEADER_H,
  playerHistorySVGImage,
  playerHistorySVGText,
} from "./player-svg-strategy";

const LOGO_SIZE = 24;
const ARROW_GAP = 22;

export class TransfersSvgStrategy implements PlayerSvgStrategy {
  readonly rowHeight = 58;
  readonly width = 600;
  readonly headerHeight = PLAYER_HISTORY_HEADER_H;
  readonly showPlayerName = true;

  get photoUrl(): string {
    return this.labels.photoUrl;
  }

  constructor(private readonly labels: PlayerHistorySvgLabels) {}

  filterItems(items: SVGTransferOrTrophyItem[]): SVGTransferOrTrophyItem[] {
    return items.filter(
      (i): i is SVGPLayerTransferItem => i.kind === SVGItemKind.Transfer,
    );
  }

  renderRow(
    item: SVGTransferOrTrophyItem,
    x: number,
    y: number,
    w: number,
  ): string {
    if (item.kind !== SVGItemKind.Transfer) return "";
    const { date, fromTeamName, fromTeamLogo, toTeamName, toTeamLogo } = item;

    const midY = y + this.rowHeight / 2 + 5;
    const logoY = y + (this.rowHeight - LOGO_SIZE) / 2;
    const arrowX = Math.round(w / 2);
    const fromLogoX = arrowX - ARROW_GAP - LOGO_SIZE;
    const fromNameX = fromLogoX - 8;
    const toLogoX = arrowX + ARROW_GAP;
    const toNameX = toLogoX + LOGO_SIZE + 6;

    return [
      playerHistorySVGText(date ?? "", x, midY, {
        fill: SvgReportsColors.TRIVIA_GRAY,
        size: 11,
      }),
      playerHistorySVGText(fromTeamName ?? "", fromNameX, midY, {
        size: 13,
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
      playerHistorySVGText(toTeamName ?? "", toNameX, midY, { size: 13 }),
    ].join("");
  }

  getTitle(_playerName: string): string {
    return this.labels.title;
  }

  getFilename(playerName: string): string {
    return `${playerName.replace(/\s+/g, "-").toLowerCase()}-transfers.png`;
  }
}
