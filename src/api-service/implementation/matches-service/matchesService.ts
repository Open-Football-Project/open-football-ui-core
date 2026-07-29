import { getApiFetch } from "../../api-service";

import {
  MatchDetails,
  DayMatchesResponse,
  TeamsLineups,
  TwoTeamsStatistics,
  MatchEvent,
} from "../../../types";

export interface MatchesService {
  fetchMatchDetails: (matchId: number) => Promise<MatchDetails>;
  fetchMatches: (date: string) => Promise<DayMatchesResponse[]>;
  fetchMatchStats: (fixtureId: number) => Promise<TwoTeamsStatistics>;
  fetchMatchLineups: (fixtureId: number) => Promise<TeamsLineups>;
  fetchMatchEvents: (fixtureId: number) => Promise<MatchEvent[]>;
}

export const matchesService: MatchesService = {
  fetchMatchDetails: async (matchId: number): Promise<MatchDetails> => {
    const response = await getApiFetch().get<MatchDetails>(
      `/api/matches/${matchId}/details`
    );
    return response.data;
  },

  fetchMatches: async (date: string): Promise<DayMatchesResponse[]> => {
    let endpoint = `/api/matches?date=${date}`;
    const response = await getApiFetch().get<DayMatchesResponse[]>(endpoint);
    return response.data;
  },

  fetchMatchStats: async (fixtureId: number): Promise<TwoTeamsStatistics> => {
    const response = await getApiFetch().get<TwoTeamsStatistics>(
      `/api/matches/stats/${fixtureId}`
    );
    return response.data;
  },

  fetchMatchLineups: async (fixtureId: number): Promise<TeamsLineups> => {
    const response = await getApiFetch().get<TeamsLineups>(
      `/api/matches/lineups/${fixtureId}`
    );

    return response.data;
  },

  fetchMatchEvents: async (fixtureId: number): Promise<MatchEvent[]> => {
    const response = await getApiFetch().get<MatchEvent[]>(
      `/api/matches/events/${fixtureId}`
    );

    return response.data;
  },
};
