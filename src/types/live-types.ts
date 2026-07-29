import { MatchEvent } from "./match-types";
import { Poll } from "./polls";

export interface LiveMatchesResponse {
  country: string;
  leagueMatches: LiveLeagueMatches[];
}

export interface LiveLeagueMatches {
  leagueId: number;
  leagueName: string;
  leagueCountry?: string | undefined;
  leagueLogo?: string | undefined;
  matches: LiveMatch[];
}

export interface LiveHomeAwayForm {
  homeForm: string[];
  awayForm: string[];
  isHomeHot: boolean;
  isHomeCold: boolean;
  isAwayHot: boolean;
  isAwayCold: boolean;
  isDisplayable: boolean;
}

export interface LiveMatch {
  id: number;
  homeTeamLogo?: string | undefined;
  awayTeamLogo?: string | undefined;
  homeTeamName: string;
  homeTeamId: number;
  awayTeamName: string;
  awayTeamId: number;
  homeTeamScore: number;
  awayTeamScore: number;
  elapsedTime?: number | undefined;
  extraTime?: number | undefined;
  leagueName: string;
  leagueId: number;
  statusShort: string;
  statusLong: string;
  matchDate: string;
  events: MatchEvent[];
  polls: Poll[];
  homeAwayForm: LiveHomeAwayForm;
}
