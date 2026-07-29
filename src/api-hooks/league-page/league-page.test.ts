import { renderHook, waitFor } from "@testing-library/react";
import { useLeaguePage } from "./league-page";
import { vi, describe, expect, it, beforeEach } from "vitest";
import { useLeaguePlayerRankings } from "../league-rankings/league-rankings";

import {
  mockLeagueRankingPlayers,
  mockLeagueFixture,
  mockLeagueInfo,
} from "../../mock-data";
import { useTranslation } from "react-i18next";

vi.mock("../league-rankings/league-rankings", () => ({
  useLeaguePlayerRankings: vi.fn(),
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

describe("useLeaguePage", () => {
  const leagueStandingsMock = vi.fn();
  const leagueRankingsMock = vi.fn();
  const fixturesMock = vi.fn();
  const argSpecialMock = vi.fn();

  const { t } = useTranslation();

  const mockApiService = {
    leagueService: {
      fetchLeagueStanding: leagueStandingsMock,
      fetchLeagueRankings: leagueRankingsMock,
      fetchArgSpecial: argSpecialMock,
    },
    fixtureService: {
      fetchLeagueFixture: fixturesMock,
    },
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    (
      useLeaguePlayerRankings as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      assists: mockLeagueRankingPlayers,
      isAssistsAvailable: true,
      loadingAssists: false,
      redCards: mockLeagueRankingPlayers,
      isRedCardsAvailable: true,
      loadingRedCards: false,
      yellowCards: mockLeagueRankingPlayers,
      isYellowCardsAvailable: true,
      loadingYellowCards: false,
      topScorers: mockLeagueRankingPlayers,
      isTopScorersAvailable: true,
      loadingTopScorers: false,
    });
  });

  it("should start with loading=true", () => {
    leagueStandingsMock.mockResolvedValueOnce({ results: {} });
    fixturesMock.mockResolvedValueOnce({ results: {} });
    argSpecialMock.mockResolvedValueOnce({ results: {} });

    const { result } = renderHook(() => useLeaguePage(mockApiService, 128, t));

    expect(result.current.loadingFixtures).toBe(true);
    expect(result.current.loadingLeagueInfo).toBe(true);
  });

  it("should set results after successful fetch", async () => {
    leagueStandingsMock.mockResolvedValueOnce(mockLeagueInfo);
    fixturesMock.mockResolvedValueOnce(mockLeagueFixture);
    argSpecialMock.mockResolvedValueOnce({ results: {} });

    const { result } = renderHook(() => useLeaguePage(mockApiService, 128, t));

    await waitFor(() => {
      expect(result.current.loadingFixtures).toBe(false);
      expect(result.current.loadingLeagueInfo).toBe(false);
    });

    expect(fixturesMock).toHaveBeenCalledTimes(1);
    expect(leagueStandingsMock).toHaveBeenCalledTimes(1);
    expect(result.current.isLeagueInfoAvailable).toBe(true);
    expect(result.current.topScorers).toEqual(mockLeagueRankingPlayers);
    expect(result.current.isLeaguefixturesAvailable).toBe(true);
  });

  it("should handle API error gracefully", async () => {
    leagueStandingsMock.mockRejectedValueOnce(new Error("network error"));
    fixturesMock.mockRejectedValueOnce(new Error("network error"));
    argSpecialMock.mockResolvedValueOnce({ results: {} });

    const { result } = renderHook(() => useLeaguePage(mockApiService, 128, t));

    await waitFor(() => {
      expect(result.current.loadingFixtures).toBe(false);
      expect(result.current.loadingLeagueInfo).toBe(false);
    });

    expect(result.current.fixtures).toBeUndefined();
    expect(result.current.leagueInfo).toBeUndefined();

    expect(result.current.isLeagueInfoAvailable).toBe(false);
    expect(result.current.isLeaguefixturesAvailable).toBe(false);
  });

  it("should refetch when team IDs change", async () => {
    leagueStandingsMock.mockResolvedValue({ results: {} });
    fixturesMock.mockResolvedValue({ results: {} });
    argSpecialMock.mockResolvedValueOnce({ results: {} });

    const { result, rerender } = renderHook(
      ({ leagueId }) => useLeaguePage(mockApiService, leagueId, t),
      {
        initialProps: { leagueId: 128 },
      }
    );

    await waitFor(() => {
      expect(result.current.loadingFixtures).toBe(false);
      expect(result.current.loadingLeagueInfo).toBe(false);
    });

    rerender({ leagueId: 129 });

    await waitFor(() => {
      expect(result.current.loadingFixtures).toBe(false);
      expect(result.current.loadingLeagueInfo).toBe(false);
    });
    expect(fixturesMock).toHaveBeenCalledTimes(2);

    expect(leagueStandingsMock).toHaveBeenCalledTimes(2);
  });
});
