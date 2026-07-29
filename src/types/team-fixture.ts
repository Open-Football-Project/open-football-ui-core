export interface TeamFixture {
  previous: TeamFixtureMatch[];
  upcoming: TeamFixtureMatch[];
}

export interface TeamFixtureMatch {
  fixtureId: number;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeTeamScore?: number;
  awayTeamScore?: number;
  isFinished: boolean;
  statusShort: string;
  statusLong: string;
  isLiveNow: boolean;
}
