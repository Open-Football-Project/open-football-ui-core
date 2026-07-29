import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { gameService } from "./gameService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("gameService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("fetch guess the player", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await gameService.fetchGuessThePlayer(5);

    expect(mockGet).toHaveBeenCalledWith(`/api/game/${5}/player`);
    expect(result).toBeDefined();
  });

  it("fetch guess the team", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    const result = await gameService.fetchGuessTheTeam(10);

    expect(mockGet).toHaveBeenCalledWith(`/api/game/${10}/team`);
    expect(result).toBeDefined();
  });
});
