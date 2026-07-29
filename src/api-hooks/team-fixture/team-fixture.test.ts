import { renderHook, waitFor } from "@testing-library/react";
import { useTeamFixture } from "./team-fixture";
import { vi, describe, beforeEach, expect, it } from "vitest";
import { mockTeamFixture } from "../../mock-data";

describe("useTeamFixture", () => {
  const fetchMock = vi.fn();

  const mockApiService = {
    fixtureService: {
      fetchTeamFixture: fetchMock,
    },
  } as any;

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("should start with loading=true", () => {
    fetchMock.mockResolvedValueOnce(mockTeamFixture);

    const { result } = renderHook(() => useTeamFixture(mockApiService, 2323));

    expect(result.current.isPreviousMatchesAvailable).toBe(false);
    expect(result.current.isUpcommingMatchesAvailable).toBe(false);
  });

  it("should set results after successful fetch", async () => {
    fetchMock.mockResolvedValue(mockTeamFixture);

    const { result } = renderHook(() => useTeamFixture(mockApiService, 2323));

    await waitFor(() => {
      expect(result.current.isPreviousMatchesAvailable).toBe(true);
      expect(result.current.isUpcommingMatchesAvailable).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should handle API error gracefully", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useTeamFixture(mockApiService, 5544));

    await waitFor(() => {
      expect(result.current.isPreviousMatchesAvailable).toBe(false);
      expect(result.current.isUpcommingMatchesAvailable).toBe(false);
    });

    expect(result.current.teamFixture).toEqual(undefined);
  });

  it("should refetch when team IDs change", async () => {
    fetchMock.mockResolvedValue(mockTeamFixture);

    const { result, rerender } = renderHook(
      ({ teamId }) => useTeamFixture(mockApiService, teamId),
      {
        initialProps: { teamId: 2323 },
      }
    );

    await waitFor(() => {
      expect(result.current.teamFixture).toEqual(mockTeamFixture);
    });

    rerender({ teamId: 5544 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
