import { LeagueFixture, TeamFixture } from "../../types";
import { mockLeagueFixture, mockTeamFixture } from "../../mock-data";
import { FixtureService } from "../implementation";

export const fixtureService: FixtureService = {
  fetchLeagueFixture: async (leagueId: number): Promise<LeagueFixture> => {
    console.log(leagueId);
    return Promise.resolve(mockLeagueFixture);
  },

  fetchTeamFixture: async (teamId: number): Promise<TeamFixture> => {
    console.log(teamId);
    return Promise.resolve(mockTeamFixture);
  },
};
