export interface ArgLeagueEntry {
  teamId: number;
  teamLogo?: string;
  teamName: string;
  points?: number;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  promedio?: number;
}

export interface ArgSpecial {
  annualTable: ArgLeagueEntry[];
  promediosTable: ArgLeagueEntry[];
}
