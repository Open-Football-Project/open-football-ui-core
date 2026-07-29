import { renderHook, waitFor } from "@testing-library/react";
import { useTeamDetail } from "./team-details";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { useTranslation } from "react-i18next";

vi.mock("../team-leagues/team-leagues", () => ({
  useTeamLeagues: () => ({
    teamLeagues: [],
    loadingTeamLeagues: false,
    isTeamLeaguesAvailable: false,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn(),
    i18n: {
      language: "en",
      changeLanguage: vi.fn(),
    },
  }),
}));

describe("useTeamDetail", () => {
  const teamDetailsMock = vi.fn();
  const teamPlayersMock = vi.fn();

  const { t } = useTranslation();

  const mockApiService = {
    teamsService: {
      fetchTeamDetails: teamDetailsMock,
      fetchTeamSquad: teamPlayersMock,
    },
  } as any;

  beforeEach(() => {
    teamDetailsMock.mockReset();
    teamPlayersMock.mockReset();
  });

  it("should start with loading=true", () => {
    teamDetailsMock.mockResolvedValueOnce({ results: {} });
    teamPlayersMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTeamDetail(mockApiService, 1234, t));

    expect(result.current.loadingTeamDetails).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    teamDetailsMock.mockResolvedValueOnce({ results: {} });
    teamPlayersMock.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useTeamDetail(mockApiService, 1232, t));

    await waitFor(() => {
      expect(result.current.loadingTeamDetails).toBe(false);
    });

    expect(teamDetailsMock).toHaveBeenCalledTimes(1);
    expect(teamPlayersMock).toHaveBeenCalledTimes(1);
    expect(result.current.teamDetails).toBeDefined();
    expect(result.current.teamPlayers).toEqual([]);
  });

  it("should handle API error gracefully", async () => {
    teamDetailsMock.mockRejectedValueOnce(new Error("network error"));
    teamPlayersMock.mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useTeamDetail(mockApiService, 5457, t));

    await waitFor(() => {
      expect(result.current.loadingTeamDetails).toBe(false);
    });

    expect(result.current.teamDetails).toBeUndefined();
    expect(result.current.teamPlayers).toEqual([]);
  });

  it("should refetch when team IDs change", async () => {
    teamDetailsMock.mockResolvedValue({ results: {} });
    teamPlayersMock.mockResolvedValue([]);

    const { result, rerender } = renderHook(
      ({ teamId }) => useTeamDetail(mockApiService, teamId, t),
      {
        initialProps: { teamId: 134 },
      }
    );

    await waitFor(() => {
      expect(result.current.loadingTeamDetails).toBe(false);
    });

    rerender({ teamId: 5678 });

    await waitFor(() => {
      expect(result.current.loadingTeamDetails).toBeDefined();
    });

    expect(teamDetailsMock).toHaveBeenCalledTimes(2);
    expect(teamPlayersMock).toHaveBeenCalledTimes(2);
  });
});
