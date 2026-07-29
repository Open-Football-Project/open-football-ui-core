import { MatchesService } from "../implementation";
import {
  DayMatchesResponse,
  MatchDetails,
  MatchEvent,
  TwoTeamsStatistics,
  TeamsLineups,
} from "../../types";

import {
  mockDayMatchesResponse,
  mockLineups,
  mockMatchDetails,
  mockTeamsStatistics,
  mockMatchEvents,
} from "../../mock-data";

export const matchesService: MatchesService = {
  fetchMatchDetails: async (matchId: number): Promise<MatchDetails> => {
    console.log(matchId);
    return Promise.resolve(mockMatchDetails);
  },

  fetchMatches: async (status: string): Promise<DayMatchesResponse[]> => {
    console.log(status);
    return Promise.resolve(mockDayMatchesResponse);
  },

  fetchMatchStats: async (fixtureId: number): Promise<TwoTeamsStatistics> => {
    console.log(fixtureId);
    return Promise.resolve(mockTeamsStatistics);
  },

  fetchMatchLineups: async (fixtureId: number): Promise<TeamsLineups> => {
    console.log(fixtureId);
    return Promise.resolve(mockLineups);
  },

  fetchMatchEvents: async (fixtureId: number): Promise<MatchEvent[]> => {
    console.log(fixtureId);
    return Promise.resolve(mockMatchEvents);
  },
};
