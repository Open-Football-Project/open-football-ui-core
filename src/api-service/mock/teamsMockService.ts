import { TeamsService } from "../implementation";

import {
  H2HDetails,
  LastFiveMatchesEvents,
  PlayerSummary,
  TeamPlayer,
  LeagueBasicInfo,
  TeamDetails,
  TeamForm,
  TeamsRestStatus,
  TeamsScorePerformance,
  TwoTeamsStatistics,
  TeamPositionsAndPoints,
} from "../../types";

import {
  teamRestStatus,
  teamScorePerformance,
  lastFiveData,
  players,
  teamDetails,
  lastfiveEvents,
  mockTeamPositionsAndPoints,
  mockH2HDetails,
  mockPlayers,
  teamLeagues,
  mockTeamsStatistics,
} from "../../mock-data";

export const teamsService: TeamsService = {
  fetchTeamDetails: async (teamId: number): Promise<TeamDetails> => {
    console.log(teamId);
    return Promise.resolve(teamDetails);
  },

  fetchTeamPlayers: async (teamId: number): Promise<PlayerSummary[]> => {
    console.log(teamId);
    return Promise.resolve(players);
  },

  fetchTeamsScorePerformance: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TeamsScorePerformance> => {
    console.log(homeTeamId, awayTeamId, leagueId);
    return Promise.resolve(teamScorePerformance);
  },

  fetchTeamsRestStatus: async (
    homeTeamId: number,
    awayTeamId: number,
    fixtureDate: string
  ): Promise<TeamsRestStatus> => {
    console.log(homeTeamId, awayTeamId, fixtureDate);
    return Promise.resolve(teamRestStatus);
  },

  fetchLastFiveMatchesEvents: async (
    teamId: number
  ): Promise<LastFiveMatchesEvents> => {
    console.log(teamId);
    return Promise.resolve(lastfiveEvents);
  },

  fetchTeamLeagueStats: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TeamPositionsAndPoints> => {
    console.log(homeTeamId, awayTeamId, leagueId);
    return Promise.resolve(mockTeamPositionsAndPoints);
  },

  fetchHeadToHead: async (
    homeTeamId: number,
    awayTeamId: number,
    isFull?:boolean
  ): Promise<H2HDetails[]> => {
    console.log(homeTeamId, awayTeamId, isFull);
    return Promise.resolve(mockH2HDetails);
  },

  fetchSeasonStats: async (
    homeTeamId: number,
    awayTeamId: number,
    leagueId: number
  ): Promise<TwoTeamsStatistics> => {
    console.log(homeTeamId, awayTeamId, leagueId);
    return Promise.resolve(mockTeamsStatistics);
  },

  fetchLastFiveMatches: async (
    homeTeamId: number,
    awayTeamId: number
  ): Promise<TeamForm> => {
    console.log(homeTeamId, awayTeamId);
    return Promise.resolve(lastFiveData);
  },

  fetchTeamSquad: async (teamId: number): Promise<TeamPlayer[]> => {
    console.log(teamId);
    return Promise.resolve(mockPlayers);
  },

  fetchTeamLeagues: async (teamId: number): Promise<LeagueBasicInfo[]> => {
    console.log(teamId);
    return Promise.resolve(teamLeagues);
  },
};
