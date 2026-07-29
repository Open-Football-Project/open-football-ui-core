import { LeagueService } from "../implementation";
import {
  LeagueInfo,
  ArgSpecial,
  BasicTeamInfo,
  LeaguesGroups,
} from "../../types";

import {
  mockLeaguesGroups,
  mockLeagueInfo,
  mockArgSpecial,
  leagueTeams,
} from "../../mock-data";

export const leagueService: LeagueService = {
  fetchLeaguesGroups: async (): Promise<LeaguesGroups> => {
    return Promise.resolve(mockLeaguesGroups);
  },

  fetchLeagueStanding: async (leagueId: Number): Promise<LeagueInfo> => {
    console.log(leagueId);
    return Promise.resolve(mockLeagueInfo);
  },

  fetchLeagueTeams: async (leagueId: Number): Promise<BasicTeamInfo[]> => {
    console.log(leagueId);
    return Promise.resolve(leagueTeams);
  },

  fetchArgSpecial: async (): Promise<ArgSpecial> => {
    return Promise.resolve(mockArgSpecial);
  },
};
