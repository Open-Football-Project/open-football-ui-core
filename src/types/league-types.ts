import { VideoContent } from "./video-content";

export interface LeagueInfo {
  id: number;
  name?: string;
  country?: string;
  logo?: string;
  flag?: string;
  season: number;
  group: LeagueGroup[];
  videos?: VideoContent[];
}

export interface LeagueGroup {
  label?: string;
  teams: LeagueTeamInfo[];
}

export interface LeagueTeamInfo {
  teamId: number;
  rank: number;
  teamName: string;
  logo: string;
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string;
  update?: string;
}

export interface League {
  id: number;
  name: string;
  country?: string;
  logo?: string;
  flag?: string;
  season: number;
  round?: string;
}

