import {
  PlayerSvgStrategy,
  SVGItemKind,
  SVGPlayerTrophyItem,
  SVGTransferOrTrophyItem,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import { PlayerHistorySvgLabels } from "../../types";
import { PLAYER_HISTORY_HEADER_H, playerHistorySVGText } from "./player-svg-strategy";

const COL_PLACE = 230;
const COL_SEASON = 360;
const COL_COUNTRY = 470;

export class TrophiesSvgStrategy implements PlayerSvgStrategy {
  readonly rowHeight = 56;
  readonly width = 600;
  readonly headerHeight = PLAYER_HISTORY_HEADER_H;
  readonly showPlayerName = true;

  get photoUrl(): string {
    return this.labels.photoUrl;
  }

  constructor(private readonly labels: PlayerHistorySvgLabels) {}

  filterItems(items: SVGTransferOrTrophyItem[]): SVGTransferOrTrophyItem[] {
    return items.filter(
      (i): i is SVGPlayerTrophyItem => i.kind === SVGItemKind.Trophy,
    );
  }

  renderRow(
    item: SVGTransferOrTrophyItem,
    x: number,
    y: number,
    _w: number,
  ): string {
    if (item.kind !== SVGItemKind.Trophy) return "";
    const { leagueName, place, season, countryName } = item;

    const midY = y + this.rowHeight / 2 + 5;

    return [
      playerHistorySVGText("\u2605", x, midY, {
        fill: SvgReportsColors.TRIVIA_YELLOW,
        size: 16,
      }),
      playerHistorySVGText(leagueName ?? "", x + 22, midY, {
        fill: SvgReportsColors.TRIVIA_YELLOW,
        size: 13,
        weight: "bold",
      }),
      playerHistorySVGText(place ?? "", x + COL_PLACE, midY, {
        fill: SvgReportsColors.TRIVIA_ORANGE,
        size: 13,
        weight: "bold",
      }),
      playerHistorySVGText(season ?? "", x + COL_SEASON, midY, { size: 13 }),
      playerHistorySVGText(countryName, x + COL_COUNTRY, midY, {
        fill: SvgReportsColors.TRIVIA_GRAY,
        size: 13,
      }),
    ].join("");
  }

  getTitle(_playerName: string): string {
    return this.labels.title;
  }

  getFilename(playerName: string): string {
    return `${playerName.replace(/\s+/g, "-").toLowerCase()}-trophies.png`;
  }
}
