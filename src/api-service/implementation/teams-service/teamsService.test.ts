import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { teamsService } from "./teamsService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("teamsService", () => {
  const mockedGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getApiFetch as Mock).mockReturnValue({
      get: mockedGet,
    });
  });

  it("should fetch team details", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamDetails(456);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/456/details");
  });

  it("should fetch team players", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamPlayers(456);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/456/players");
  });

  it("should fetch team squad", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamSquad(456);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/squad/456");
  });

  it("should fetch teams score performance", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamsScorePerformance(1, 2, 3);

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/teams/score/performance/1/2/3"
    );
  });

  it("should fetch teams rest status", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamsRestStatus(1, 2, "2024-01-01");

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/teams/rest/status/1/2/2024-01-01"
    );
  });

  it("should fetch last five matches events", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchLastFiveMatchesEvents(1342);

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/teams/matches/events/sum/1342"
    );
  });

  it("should fetch team league stats", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamLeagueStats(1, 2, 3);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/league/stats/1/2/3");
  });

  it("should fetch head to head", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchHeadToHead(1, 2);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/h2h/1/2");
  });

  it("should fetch season stats", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchSeasonStats(1, 2, 3);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/season/stats/1/2/3");
  });

  it("should fetch last five matches", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchLastFiveMatches(1, 2);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/lastfive/1/2");
  });

  it("should fetch team leagues", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = teamsService.fetchTeamLeagues(123);

    expect(mockedGet).toHaveBeenCalledWith("/api/teams/leagues/123");
  });
});
