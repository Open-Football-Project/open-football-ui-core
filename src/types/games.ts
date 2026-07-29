export interface GuessThePlayerGameHint {
  hintKey: "TRANSFER" | "TROPHY";
  description: string;
  transferFromLogo?: string | null;
  transferFromTeam?: string | null;
  transferToLogo?: string | null;
  transferToTeam?: string | null;
  transferDate?: string | null;
  transferYear?: number | null;
  trophyCountry?: string | null;
  trophySeason?: string | null;
  trophyLeague?: string | null;
}

export interface GuessThePlayerGameData {
  isAvailable: boolean;
  playerId: number;
  playerName: string;
  playerNationality: string;
  playerPosition: string;
  playerPhoto?: string | null;
  options: string[];
  hints: GuessThePlayerGameHint[];
}

export interface GuessTheTeamGameHint {
  hintKey: "PLAYER" | "STAT";
  description: string;
  value: string;
}

export interface GuessTheTeamGameData {
  isAvailable: boolean;
  teamId: number;
  teamLogo?: string;
  teamName: string;
  venue: string;
  founded: number;
  season: number;
  hints: GuessTheTeamGameHint[];
  options: string[];
}
