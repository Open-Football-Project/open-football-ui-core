import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { rankingService } from "./rankingsService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("rankingService", () => {
  const mockedGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getApiFetch as Mock).mockReturnValue({
      get: mockedGet,
    });
  });

  it("should fetch ranking", () => {
    mockedGet.mockResolvedValueOnce({ data: {} });

    const result = rankingService.fetchRanking("SCORERS", 123);

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/ranking/league?key=SCORERS&leagueId=123"
    );
  });
});
