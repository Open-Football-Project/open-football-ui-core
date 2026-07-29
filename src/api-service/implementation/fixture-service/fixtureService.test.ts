import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { fixtureService } from "./fixtureService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("fixtureService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("fetchLeagueFixture calls correct endpoint and returns data", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await fixtureService.fetchLeagueFixture(1);

    expect(mockGet).toHaveBeenCalledWith("/api/league/fixture/1");
    expect(result).toBeDefined();
  });

  it("fetchTeamFixture calls correct endpoint and returns data", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await fixtureService.fetchTeamFixture(10);

    expect(mockGet).toHaveBeenCalledWith("/api/teams/fixture/10");
    expect(result).toBeDefined();
  });
});
