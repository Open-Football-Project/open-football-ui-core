export interface TeamsLineups {
  teamA: TeamLineup | null;
  teamB: TeamLineup | null;
}

export interface TeamLineup {
  teamId: number;
  teamLogo: string;
  teamName: string;
  teamFormation: string;
  lineup: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface LineupPlayer {
  name: string;
  number: number;
  pos: string;
  grid: string;
}
