import { renderHook, waitFor } from "@testing-library/react";
import { useRestStatus } from "./rest-status";
import { vi, describe, beforeEach, expect, it } from "vitest";

import { teamRestStatus } from "../../mock-data";

describe("useRestStatus", () => {
  const mockFetchTeamsRestStatus = vi.fn();

  const mockApiService = {
    teamsService: {
      fetchTeamsRestStatus: mockFetchTeamsRestStatus,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with loading=true", () => {
    mockFetchTeamsRestStatus.mockResolvedValueOnce(teamRestStatus);

    const { result } = renderHook(() =>
      useRestStatus(mockApiService, 1, 2, "2025-10-06")
    );

    expect(result.current.loadingRestStatus).toBe(true);
  });

  it("sets restStatus after successful fetch", async () => {
    mockFetchTeamsRestStatus.mockResolvedValueOnce(teamRestStatus);

    const { result } = renderHook(() =>
      useRestStatus(mockApiService, 1, 2, "2025-10-06")
    );

    await waitFor(() => expect(result.current.loadingRestStatus).toBe(false));

    expect(result.current.restStatus).toEqual(teamRestStatus);
    expect(result.current.isRestStatusAvailable).toBe(true);
    expect(mockFetchTeamsRestStatus).toHaveBeenCalledWith(1, 2, "2025-10-06");
  });

  it("handles API error gracefully", async () => {
    mockFetchTeamsRestStatus.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() =>
      useRestStatus(mockApiService, 5, 7, "2025-10-07")
    );

    await waitFor(() => expect(result.current.loadingRestStatus).toBe(false));
    expect(result.current.isRestStatusAvailable).toBe(false);
    expect(result.current.restStatus).toBeUndefined();
  });

  it("refetches when dependencies change", async () => {
    mockFetchTeamsRestStatus.mockResolvedValue(teamRestStatus);

    const { result, rerender } = renderHook(
      ({ homeId, awayId, fixture }) =>
        useRestStatus(mockApiService, homeId, awayId, fixture),
      {
        initialProps: { homeId: 1, awayId: 2, fixture: "2025-10-06" },
      }
    );

    await waitFor(() =>
      expect(result.current.restStatus).toEqual(teamRestStatus)
    );

    rerender({ homeId: 9, awayId: 10, fixture: "2025-10-08" });

    await waitFor(() =>
      expect(result.current.restStatus).toEqual(teamRestStatus)
    );

    expect(mockFetchTeamsRestStatus).toHaveBeenNthCalledWith(
      1,
      1,
      2,
      "2025-10-06"
    );
    expect(mockFetchTeamsRestStatus).toHaveBeenNthCalledWith(
      2,
      9,
      10,
      "2025-10-08"
    );
  });
});
