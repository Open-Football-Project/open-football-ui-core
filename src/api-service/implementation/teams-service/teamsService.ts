import { getApiFetch } from "../../api-service";

import {
  TeamDetails,
  TeamForm,
  TeamsRestStatus,
  TeamsScorePerformance,
  TeamPositionsAndPoints,
  H2HDetails,
  LastFiveMatchesEvents,
  PlayerSummary,
  TeamPlayer,
  LeagueBasicInfo,
  TwoTeamsStatistics,
} from "../../../types";

export interface TeamsService {
  fetchTeamDetails: (teamId: number) => Promise<TeamDetails>;
  fetchTeamPlayers: (teamId: number) => Promise<PlayerSummary[]>;
  fetchTeamSquad: (teamId: number) => Promise<TeamPlayer[]>;
  fetchTeamsScorePerformance: (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ) => Promise<TeamsScorePerformance>;
  fetchTeamsRestStatus: (
    homeTeamId: number,
    awayTeamId: number,
    fixtureDate: string
  ) => Promise<TeamsRestStatus>;

  fetchLastFiveMatchesEvents: (
    teamId: number
  ) => Promise<LastFiveMatchesEvents>;

  fetchTeamLeagueStats: (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ) => Promise<TeamPositionsAndPoints>;

  fetchHeadToHead: (
    homeTeamId: number,
    awayTeamId: number,
    isFull?:boolean 
  ) => Promise<H2HDetails[]>;

  fetchSeasonStats: (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ) => Promise<TwoTeamsStatistics>;

  fetchLastFiveMatches: (
    homeTeamId: number,
    awayTeamId: number
  ) => Promise<TeamForm>;

  fetchTeamLeagues: (teamId: number) => Promise<LeagueBasicInfo[]>;
}

export const teamsService: TeamsService = {
  fetchTeamDetails: async (teamId: number): Promise<TeamDetails> => {
    const response = await getApiFetch().get<TeamDetails>(
      `/api/teams/${teamId}/details`
    );
    return response.data;
  },

  fetchTeamPlayers: async (teamId: number): Promise<PlayerSummary[]> => {
    const response = await getApiFetch().get<PlayerSummary[]>(
      `/api/teams/${teamId}/players`
    );
    return response.data;
  },

  fetchTeamSquad: async (teamId: number): Promise<TeamPlayer[]> => {
    const response = await getApiFetch().get<TeamPlayer[]>(
      `/api/teams/squad/${teamId}`
    );
    return response.data;
  },

  fetchTeamsScorePerformance: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TeamsScorePerformance> => {
    const response = await getApiFetch().get<TeamsScorePerformance>(
      `/api/teams/score/performance/${homeTeamId}/${awayTeamId}/${leagueId}`
    );
    return response.data;
  },

  fetchTeamsRestStatus: async (
    homeTeamId: number,
    awayTeamId: number,
    fixtureDate: string
  ): Promise<TeamsRestStatus> => {
    const response = await getApiFetch().get<TeamsRestStatus>(
      `/api/teams/rest/status/${homeTeamId}/${awayTeamId}/${encodeURIComponent(
        fixtureDate
      )}`
    );
    return response.data;
  },

  fetchLastFiveMatchesEvents: async (
    teamId: number
  ): Promise<LastFiveMatchesEvents> => {
    const response = await getApiFetch().get<LastFiveMatchesEvents>(
      `/api/teams/matches/events/sum/${teamId}`
    );
    return response.data;
  },

  fetchTeamLeagueStats: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TeamPositionsAndPoints> => {
    const response = await getApiFetch().get<TeamPositionsAndPoints>(
      `/api/teams/league/stats/${homeTeamId}/${awayTeamId}/${leagueId}`
    );
    return response.data;
  },

  fetchHeadToHead: async (
    homeTeamId: number,
    awayTeamId: number,
    isFull?:boolean
  ): Promise<H2HDetails[]> => {
    const response = await getApiFetch().get<H2HDetails[]>(
      `/api/teams/h2h/${homeTeamId}/${awayTeamId}${isFull ? "?isFull=true":""}`
    );
    return response.data;
  },

  fetchSeasonStats: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TwoTeamsStatistics> => {
    const response = await getApiFetch().get<TwoTeamsStatistics>(
      `/api/teams/season/stats/${homeTeamId}/${awayTeamId}/${leagueId}`
    );
    return response.data;
  },

  fetchLastFiveMatches: async (
    homeTeamId: number,
    awayTeamId: number
  ): Promise<TeamForm> => {
    const response = await getApiFetch().get<TeamForm>(
      `/api/teams/lastfive/${homeTeamId}/${awayTeamId}`
    );
    return response.data;
  },

  fetchTeamLeagues: async (teamId: number): Promise<LeagueBasicInfo[]> => {
    const response = await getApiFetch().get<LeagueBasicInfo[]>(
      `/api/teams/leagues/${teamId}`
    );
    return response.data;
  },
};
