export type PlayerPosition = "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "ATTACKER";

export type ScoringSignal = "ODDS_IMPLIED" | "SEASON_STAT";

export interface MarketOddsReason {
  markets: string[];
}

export interface SeasonFormReason {
  appearances: number;
  goals: number;
  assists: number;
  rating: number;
}

export type ScoreReason = MarketOddsReason | SeasonFormReason;

export interface TodayPlayerInfo {
  id: number | null;
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string | null;
}

export interface TodayPlayerScore {
  player: TodayPlayerInfo;
  score: number;
  signal: ScoringSignal;
  reason: ScoreReason;
}

export interface FixtureTodayPlayers {
  fixtureId: number;
  leagueId: number;
  leagueName: string;
  homeTeamName: string;
  awayTeamName: string;
  home: Record<PlayerPosition, TodayPlayerScore[]>;
  away: Record<PlayerPosition, TodayPlayerScore[]>;
}
