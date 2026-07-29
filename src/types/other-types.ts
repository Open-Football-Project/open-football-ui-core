export interface Venue {
  name?: string;
  city?: string;
}

export interface Goal {
  home?: number;
  away?: number;
}

export interface Score {
  halftime?: Goal;
  fulltime?: Goal;
  extratime?: Goal;
  penalty?: Goal;
}

export interface PositionAndPoints {
  position?: number;
  points?: number;
  description?: string;
}

export interface H2HDetails {
  date: string;
  venue: Venue;
  leagueName: string;
  season: number;
  round?: string;
  winner: string;
  homeHalfTimeGoal: number;
  awayHalfTimeGoal: number;
  homeFullTimeGoal: number;
  awayFullTimeGoal: number;
  homeExtraTimeGoal: number;
  awayExtraTimeGoal: number;
  homePenalty: number;
  awayPenalty: number;
}

export interface LastFiveMatchesEvents {
  penalties: number;
  firstHalfGoals: number;
  secondHalfGoals: number;
  extraTimeGoals: number;
  firstHalfYellowCards: number;
  secondHalfYellowCards: number;
  extraTimeYellowCards: number;
  firstHalfRedCards: number;
  secondHalfRedCards: number;
  extraTimeRedCards: number;
}

export interface PlayerSummary {
  name: string;
  age: number;
  height: string;
  weight: string;
  position: string;
  goals: number;
  yellowCards: number;
  redCards: number;
  penaltiesSaved: number;
  penaltiesScored: number;
}

export interface TeamPlayer {
  playerId: number;
  name: string;
  age?: number;
  playerNumber?: number;
  position?: string;
  photo?: string;
}
