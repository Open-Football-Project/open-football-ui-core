import { PositionAndPoints } from "./other-types";
import { VideoContent } from "./video-content";

export interface TeamDetails {
  teamName: string;
  teamLogo: string;
  teamCountry: string;
  teamFounded: number;
  venueName: string;
  venueCity: string;
  venueCapacity: number;
  coachName: string;
  coachAge: number;
  videos?: VideoContent[];
}

export interface TeamsRestStatus {
  homeTeamStatus: string;
  awayTeamStatus: string;
}

export interface TeamsScorePerformance {
  homeTeamPerformance: string;
  awayTeamPerformance: string;
}

export interface TeamStatsOld {
  goalsFor: number;
  goalsAgainst: number;
  cleanSheet: number;
  scoredIn: number;
  concededIn: number;
}

export interface TeamForm {
  homeTeamLastFive: string[];
  awayTeamLastFive: string[];
}

export interface Team {
  id: number;
  name: string;
  logo?: string;
  winner?: boolean;
  goals?: number;
}

export interface TeamPositionsAndPoints {
  homeTeam: PositionAndPoints[];
  awayTeam: PositionAndPoints[];
}

export interface BasicTeamInfo {
  teamId: number;
  teamName: string;
}
