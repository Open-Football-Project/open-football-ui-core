import { describe, vi, beforeEach, expect, Mock, it } from "vitest";
import { playerService } from "./playerService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("playerService", () => {
  const mockedGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as Mock).mockReturnValue({
      get: mockedGet,
    });
  });

  it("should fetch Player History", async () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = await playerService.fetchPlayerHistory(123);

    expect(mockedGet).toHaveBeenCalledWith("/api/player/history/123");
    expect(result).toBeDefined();
  });

  it("should fetch Player info", async () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = await playerService.fetchPlayerInfo(123);

    expect(mockedGet).toHaveBeenCalledWith("/api/player/123");
    expect(result).toBeDefined();
  });

  it("should fetch today players", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] });

    const result = await playerService.fetchTodayPlayers();

    expect(mockedGet).toHaveBeenCalledWith("/api/player/today-players");
    expect(result).toBeDefined();
  });

  it("should fetch today players available fixture ids", async () => {
    mockedGet.mockResolvedValueOnce({ data: [] });

    const result = await playerService.fetchTodayPlayersFixtureIds();

    expect(mockedGet).toHaveBeenCalledWith("/api/player/today-players/fixtures");
    expect(result).toBeDefined();
  });
});
