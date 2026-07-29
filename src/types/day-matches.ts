export interface DayMatchesResponse {
  country: string;
  matchesByLeague: DayMatches[];
}

export interface DayMatches {
  leagueId: number;
  leagueName: string;
  leagueLogo?: string | null;
  matches: OnDayMatch[];
}

export interface OnDayMatch {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  isFinished: boolean;
  date: string;
  statusShort: string;
  statusLong: string;
  isLiveNow: boolean;
}
