import { League } from "./league-types";
import { Goal, Score, Venue } from "./other-types";
import { Team } from "./team-types";
import { VideoContent } from "./video-content";

export interface MatchDetails {
  id: number;
  date: string;
  league: League;
  venue: Venue;
  homeTeam: Team;
  awayTeam: Team;
  goals: Goal;
  score: Score;
  statusShort: string;
  statusLong: string;
  isLiveNow: boolean;
  videos?: VideoContent[];
}

export interface MatchEvent {
  timeElapsed: number;
  timeExtra?: number | undefined;
  teamName: string;
  teamLogo?: string | undefined;
  playerName?: string | undefined;
  eventType: string;
  eventDetails: string;
}
