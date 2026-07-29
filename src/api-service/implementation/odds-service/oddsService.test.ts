import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import { oddsService } from "./oddsService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("oddsService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getApiFetch as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("should fetch odds by fixtureId", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await oddsService.fetchOdds(1234);

    expect(mockGet).toHaveBeenCalledWith("/api/odds/1234");
    expect(result).toBeDefined();
  });

  it("should fetch odds winner feeling", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await oddsService.fetchOddWinnerFeeling(1234);

    expect(mockGet).toHaveBeenCalledWith("/api/odds/feeling/winner/1234");
    expect(result).toBeDefined();
  });

  it("should fetch value bets by fixtureId", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await oddsService.fetchValueBets(1234);

    expect(mockGet).toHaveBeenCalledWith("/api/odds/value-bets/1234");
    expect(result).toBeDefined();
  });
});
