import { LeagueFixture, TeamFixture } from "../../../types";
import { getApiFetch } from "../../api-service";

export interface FixtureService {
  fetchLeagueFixture: (leagueId: number) => Promise<LeagueFixture>;
  fetchTeamFixture: (teamId: number) => Promise<TeamFixture>;
}

export const fixtureService: FixtureService = {
  fetchLeagueFixture: async (leagueId: number): Promise<LeagueFixture> => {
    const response = await getApiFetch().get<LeagueFixture>(
      `/api/league/fixture/${leagueId}`
    );
    return response.data;
  },

  fetchTeamFixture: async (teamId: number): Promise<TeamFixture> => {
    const response = await getApiFetch().get<TeamFixture>(
      `/api/teams/fixture/${teamId}`
    );
    return response.data;
  },
};
