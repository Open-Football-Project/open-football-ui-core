export interface TwoTeamsStatistics {
  teamA: TeamStats | null;
  teamB: TeamStats | null;
}

export interface TeamStats {
  teamId: number;
  teamLogo: string;
  teamName: string;
  statistics: TeamStatistic[];
}

export interface TeamStatistic {
  name: string;
  value: number;
  total: number;
  isPositive: boolean;
}
