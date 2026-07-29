export interface PlayerHistory {
  player?: PlayerHistoryInfo | null;
  trophies: PlayerTrophyInfo[];
  transfers: PlayerTransferInfo[];
}

export interface PlayerHistoryInfo {
  id: number;
  name: string;
  photo?: string | null;
}

export interface PlayerTrophyInfo {
  league: string;
  country: string;
  season?: string | null;
  place: string;
}

export interface PlayerTransferInfo {
  date?: string | null;

  fromTeamId?: number | null;
  fromTeamName: string;
  fromTeamLogo?: string | null;

  toTeamId?: number | null;
  toTeamName: string;
  toTeamLogo?: string | null;
}
