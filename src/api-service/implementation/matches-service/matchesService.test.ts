import { describe, it, vi, Mock, expect, beforeEach } from "vitest";
import { matchesService } from "./matchesService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("matchesService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getApiFetch as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("should fetch Match Details", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatchDetails(1234);

    expect(mockGet).toHaveBeenCalledWith(`/api/matches/${1234}/details`);
    expect(result).toBeDefined();
  });

  it("should fetch matches by date", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatches("2024-01-01");

    expect(mockGet).toHaveBeenCalledWith(`/api/matches?date=2024-01-01`);
    expect(result).toBeDefined();
  });

  it("should fetch matches by date", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatches("2024-01-01");

    expect(mockGet).toHaveBeenCalledWith(`/api/matches?date=2024-01-01`);
    expect(result).toBeDefined();
  });

  it("should fetch match stats", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatchStats(5678);

    expect(mockGet).toHaveBeenCalledWith(`/api/matches/stats/${5678}`);
    expect(result).toBeDefined();
  });

  it("should fetch match linups", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatchLineups(5678);

    expect(mockGet).toHaveBeenCalledWith(`/api/matches/lineups/${5678}`);
    expect(result).toBeDefined();
  });

  it("should fetch match events", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await matchesService.fetchMatchEvents(5678);

    expect(mockGet).toHaveBeenCalledWith(`/api/matches/events/${5678}`);
    expect(result).toBeDefined();
  });
});
