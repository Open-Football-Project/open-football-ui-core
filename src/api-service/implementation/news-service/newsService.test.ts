import { describe, beforeEach, vi, Mock, it, expect } from "vitest";
import { newsService } from "./newsService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";

describe("newsService", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (getApiFetch as Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("should fetch news", async () => {
    mockGet.mockResolvedValueOnce({
      data: [],
    });

    const result = await newsService.fetchNews("en");

    expect(mockGet).toHaveBeenCalledWith("/api/news/en");
    expect(result).toEqual([]);
  });
});
