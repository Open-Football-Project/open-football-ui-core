import {
  BasicTeamInfo,
  LeagueInfo,
  ArgSpecial,
  LeaguesGroups,
} from "../../../types";

import { getApiFetch } from "../../api-service";

export interface LeagueService {
  fetchLeaguesGroups: () => Promise<LeaguesGroups>;
  fetchLeagueStanding: (leagueId: Number) => Promise<LeagueInfo>;
  fetchLeagueTeams: (leagueId: Number) => Promise<BasicTeamInfo[]>;
  fetchArgSpecial: () => Promise<ArgSpecial>;
}

export const leagueService: LeagueService = {
  fetchLeaguesGroups: async (): Promise<LeaguesGroups> => {
    const response = await getApiFetch().get<LeaguesGroups>(`/api/league/all`);
    return response.data;
  },

  fetchLeagueStanding: async (leagueId: Number): Promise<LeagueInfo> => {
    const response = await getApiFetch().get<LeagueInfo>(
      `/api/league/standing/${leagueId}`
    );
    return response.data;
  },

  fetchLeagueTeams: async (leagueId: Number): Promise<BasicTeamInfo[]> => {
    const response = await getApiFetch().get<BasicTeamInfo[]>(
      `/api/league/teams/${leagueId}`
    );
    return response.data;
  },

  fetchArgSpecial: async (): Promise<ArgSpecial> => {
    const response = await getApiFetch().get<ArgSpecial>(
      `/api/league/arg/special`
    );
    return response.data;
  },
};
