import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { leagueService } from "./leagueService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("leagueService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("should fetch Groups of leagues", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await leagueService.fetchLeaguesGroups();

    expect(mockGet).toHaveBeenCalledWith(`/api/league/all`);
    expect(result).toBeDefined();
  });

  it("should fetch A League Standing", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await leagueService.fetchLeagueStanding(11);

    expect(mockGet).toHaveBeenCalledWith(`/api/league/standing/${11}`);
    expect(result).toBeDefined();
  });

  it("should fetch The League Teams", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await leagueService.fetchLeagueTeams(11);

    expect(mockGet).toHaveBeenCalledWith(`/api/league/teams/${11}`);
    expect(result).toBeDefined();
  });

  it("should fetch Arg Special data", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await leagueService.fetchArgSpecial();

    expect(mockGet).toHaveBeenCalledWith(`/api/league/arg/special`);
    expect(result).toBeDefined();
  });
});
