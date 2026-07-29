export interface Odd {
  label: string;
  odd: number;
}

export interface Bet {
  betName: string;
  values: Odd[];
}

export interface OddsWinnerFeeling {
  home: string;
  draw: string;
  away: string;
}

export interface ValueBetOutcome {
  label: string;
  odd: number;
  isValue: boolean;
}

export interface BookmakerLine {
  name: string;
  outcomes: ValueBetOutcome[];
}

export interface FairOdd {
  label: string;
  odd: number;
}

export interface ValueBetMarket {
  betName: string;
  fairOdds: FairOdd[];
  bookmakers: BookmakerLine[];
}

export interface ValueBetsResponse {
  markets: ValueBetMarket[];
}
