export interface LeagueFixturesMatch {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  date: string;
  homeTeamScore?: number | null | undefined;
  awayTeamScore?: number | null | undefined;
  isFinished: boolean;
  fixtureRound: string;
  statusShort: string;
  statusLong: string;
  isLiveNow: boolean;
}

export interface LeagueFixtureDay {
  date: string;
  matches: LeagueFixturesMatch[];
}

export interface LeagueFixtureRound {
  name: string;
  days: LeagueFixtureDay[];
}

export interface LeagueFixture {
  rounds: LeagueFixtureRound[];
  currentRoundIndex: number;
  totalRounds: number;
}
