export enum SVGItemKind {
  Transfer = "transfer",
  Trophy = "trophy",
}

export interface SVGPLayerTransferItem {
  kind: SVGItemKind.Transfer;
  label?: string;
  description?: string;
  date?: string;
  fromTeamName?: string;
  fromTeamLogo?: string;
  toTeamName?: string;
  toTeamLogo?: string;
}

export interface SVGPlayerTrophyItem {
  kind: SVGItemKind.Trophy;
  label?: string;
  description?: string;
  leagueName?: string;
  countryName: string;
  place?: string;
  season?: string;
}

export type SVGTransferOrTrophyItem =
  | SVGPLayerTransferItem
  | SVGPlayerTrophyItem;

export interface TriviaSvgResult {
  svgString: string;
  width: number;
  height: number;
  filename: string;
}

export interface TriviaSvgConfig<T = SVGTransferOrTrophyItem> {
  title: string;
  subtitle: string;
  hints: T[];
  options: string[];
  filename: string;
}

export interface TeamTriviaSvgHint {
  emoji: string;
  label: string;
  value: string;
}

export interface PlayerHistoryQuizMixSvgLabels {
  title: string;
  photoUrl: string;
  transferLabel: string;
  trophyLabel: string;
}

export interface PlayerHistorySvgLabels {
  title: string;
  photoUrl: string;
}

export interface PlayerSvgStrategy {
  filterItems(items: SVGTransferOrTrophyItem[]): SVGTransferOrTrophyItem[];
  renderRow(
    item: SVGTransferOrTrophyItem,
    x: number,
    y: number,
    width: number,
  ): string;
  getTitle(playerName: string): string;
  getFilename(playerName: string): string;
  readonly rowHeight: number;
  readonly width: number;
  readonly headerHeight: number;
  readonly photoUrl: string;
  readonly showPlayerName: boolean;
}
