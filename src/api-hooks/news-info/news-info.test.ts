import { renderHook, waitFor } from "@testing-library/react";
import { useNewsInfo } from "./news-info";

import { vi, describe, beforeEach, it, expect } from "vitest";

import { mockNewsData } from "../../mock-data";

describe("useNewsInfo", () => {
  const mockFetchNews = vi.fn();

  const mockApiService = {
    newsService: {
      fetchNews: mockFetchNews,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with loading=true", () => {
    mockFetchNews.mockResolvedValueOnce(mockNewsData);

    const { result } = renderHook(() => useNewsInfo(mockApiService, "es"));

    expect(result.current.loadingNews).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    mockFetchNews.mockResolvedValueOnce(mockNewsData);

    const { result } = renderHook(() => useNewsInfo(mockApiService, "es"));

    await waitFor(() => expect(result.current.loadingNews).toBe(false));

    expect(mockFetchNews).toHaveBeenCalled();
    expect(result.current.news).toEqual(mockNewsData);
    expect(result.current.isPlayerNewsAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    mockFetchNews.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useNewsInfo(mockApiService, "es"));

    await waitFor(() => expect(result.current.loadingNews).toBe(false));

    expect(result.current.news).toEqual([]);
    expect(result.current.isPlayerNewsAvailable).toBe(false);
  });

  it("should refetch when language changes", async () => {
    mockFetchNews.mockResolvedValue(mockNewsData);

    const { result, rerender } = renderHook(
      ({ lang }) => useNewsInfo(mockApiService, lang),
      {
        initialProps: { lang: "es" },
      }
    );

    await waitFor(() => expect(result.current.news).toEqual(mockNewsData));

    rerender({ lang: "en" });

    await waitFor(() =>
      expect(result.current.isPlayerNewsAvailable).toBe(true)
    );

    expect(mockFetchNews).toHaveBeenCalledTimes(2);
  });
});
