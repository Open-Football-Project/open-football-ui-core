import { renderHook } from "@testing-library/react";
import { describe, it, vi, Mock, beforeEach, expect } from "vitest";
import { useTodayMatches } from "./today-matches";
import { ApiService } from "../../api-service";
import { useMatches } from "../../api-hooks";

vi.mock("../../api-hooks", () => ({
  useMatches: vi.fn(),
}));

const mockApiService = {} as ApiService;

const mockMatchesResponse = [
  {
    country: "England",
    matchesByLeague: [
      {
        leagueId: 39,
        leagueName: "Premier League",
        leagueLogo: "premier.png",
        matches: [
          { fixtureId: 101, homeTeamName: "Arsenal", awayTeamName: "Chelsea", date: new Date().toISOString() },
          { fixtureId: 102, homeTeamName: "Liverpool", awayTeamName: "Man City", date: new Date().toISOString() },
        ],
      },
      {
        leagueId: 9999,
        leagueName: "Unknown League",
        leagueLogo: "unknown.png",
        matches: [
          { fixtureId: 103, homeTeamName: "Team A", awayTeamName: "Team B", date: new Date().toISOString() },
        ],
      },
    ],
  },
  {
    country: "Spain",
    matchesByLeague: [
      {
        leagueId: 140,
        leagueName: "La Liga",
        leagueLogo: "laliga.png",
        matches: [
          { fixtureId: 201, homeTeamName: "Barcelona", awayTeamName: "Real Madrid", date: new Date().toISOString() },
        ],
      },
    ],
  },
];

const allowedLeagueIds = new Map<number, number>([
  [39, 100],   // Premier League - highest weight
  [140, 60],   // La Liga
  [78, 50],    // Bundesliga
]);

describe("useTodayMatches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state while fetching", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: true,
      matches: [],
    });

    const { result } = renderHook(() =>
      useTodayMatches(mockApiService, allowedLeagueIds),
    );

    expect(result.current.loadingMatches).toBe(true);
    expect(result.current.leagueMatches).toEqual([]);
    expect(result.current.isLeagueMatchesAvailable).toBe(false);
  });

  it("returns empty when no matches exist", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: [],
    });

    const { result } = renderHook(() =>
      useTodayMatches(mockApiService, allowedLeagueIds),
    );

    expect(result.current.loadingMatches).toBe(false);
    expect(result.current.leagueMatches).toEqual([]);
    expect(result.current.isLeagueMatchesAvailable).toBe(false);
  });

  it("flattens leagues from all countries into a single list", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    const allIds = new Map<number, number>([[39, 100], [9999, 10], [140, 60]]);
    const { result } = renderHook(() =>
      useTodayMatches(mockApiService, allIds),
    );

    expect(result.current.leagueMatches).toHaveLength(3);
    expect(result.current.isLeagueMatchesAvailable).toBe(true);
  });

  it("filters out leagues not in allowedLeagueIds", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    const { result } = renderHook(() =>
      useTodayMatches(mockApiService, allowedLeagueIds),
    );

    const leagueIds = result.current.leagueMatches.map((l) => l.leagueId);
    expect(leagueIds).toContain(39);
    expect(leagueIds).toContain(140);
    expect(leagueIds).not.toContain(9999);
  });

  it("sorts leagues by weight descending", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    // Premier League (39) comes first in data but La Liga (140) has higher weight
    const weights = new Map<number, number>([[39, 50], [140, 100]]);
    const { result } = renderHook(() =>
      useTodayMatches(mockApiService, weights),
    );

    const leagueIds = result.current.leagueMatches.map((l) => l.leagueId);
    expect(leagueIds).toEqual([140, 39]);
  });

  it("calls useMatches with today's date and current hour", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: [],
    });

    renderHook(() => useTodayMatches(mockApiService, allowedLeagueIds));

    const [, dateArg, hourArg] = (useMatches as unknown as Mock).mock.calls[0];
    expect(dateArg).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof hourArg).toBe("number");
    expect(hourArg).toBeGreaterThanOrEqual(0);
    expect(hourArg).toBeLessThan(24);
  });
});
