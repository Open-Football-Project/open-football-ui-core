import { renderHook, act } from "@testing-library/react";
import { describe, it, vi, Mock, beforeEach, expect } from "vitest";

import { useMatchesStatus } from "./matches-status";
import { ApiService } from "../../api-service";
import { getLocalISODate, isUTCBetweenLocalHours } from "../../utils";
import { useMatches } from "../../api-hooks";

vi.mock("../../api-hooks", async () => {
  return {
    useMatches: vi.fn(),
  };
});

const mockApiService = {} as ApiService;

const morningDate = new Date();
morningDate.setHours(9, 0, 0, 0);
const mockMorningISO = morningDate.toISOString();

const mockMatchesResponse = [
  {
    country: "England",
    matchesByLeague: [
      {
        leagueId: 1,
        leagueName: "Premier League",
        matches: [
          { fixtureId: 101, date: mockMorningISO },
          { fixtureId: 102, date: mockMorningISO },
        ],
      },
      {
        leagueId: 2,
        leagueName: "Championship",
        matches: [{ fixtureId: 103, date: mockMorningISO }],
      },
    ],
  },
  {
    country: "Spain",
    matchesByLeague: [
      {
        leagueId: 3,
        leagueName: "La Liga",
        matches: [{ fixtureId: 201, date: mockMorningISO }],
      },
    ],
  },
];

describe("useMatchesStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default date and empty country if no matches", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: [],
    });

    const { result } = renderHook(() => useMatchesStatus(mockApiService));

    const today = getLocalISODate();

    expect(result.current.selectedDate).toBe(today);
    expect(result.current.selectedCountry).toBeUndefined();
    expect(result.current.countries).toEqual([]);
    expect(result.current.leagueMatches).toEqual([]);
    expect(result.current.isLeagueMatchesAvailable).toBe(false);
  });

  it("sets selectedCountry and countries when matches exist", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    const { result } = renderHook(() => useMatchesStatus(mockApiService));

    expect(result.current.selectedCountry).toBe("England");
    expect(result.current.countries).toEqual(["England", "Spain"]);
    expect(result.current.leagueMatches).toHaveLength(2);
    expect(result.current.isLeagueMatchesAvailable).toBe(true);
  });

  it("updates selectedCountry when changed manually", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    const { result } = renderHook(() => useMatchesStatus(mockApiService));

    act(() => {
      result.current.setSelectedCountry("Spain");
    });

    expect(result.current.selectedCountry).toBe("Spain");
    expect(result.current.leagueMatches).toHaveLength(1);
    expect(result.current.isLeagueMatchesAvailable).toBe(true);
  });

  it("updates selectedDate when changed", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: false,
      matches: mockMatchesResponse,
    });

    const { result } = renderHook(() => useMatchesStatus(mockApiService));

    const newDate = "2025-10-12";

    act(() => {
      result.current.setSelectedDate(newDate);
    });

    expect(result.current.selectedDate).toBe(newDate);
  });

  it("returns loadingMatches correctly", () => {
    (useMatches as unknown as Mock).mockReturnValue({
      loadingMatches: true,
      matches: [],
    });

    const { result } = renderHook(() => useMatchesStatus(mockApiService));

    expect(result.current.loadingMatches).toBe(true);
  });

  describe("timeRangeOptions", () => {
    it("covers all 24 hours of the day, each hour belonging to exactly one bucket", () => {
      (useMatches as unknown as Mock).mockReturnValue({
        loadingMatches: false,
        matches: [],
      });

      const { result } = renderHook(() => useMatchesStatus(mockApiService));
      const { timeRangeOptions } = result.current;

      for (let hour = 0; hour < 24; hour++) {
        const hourDate = new Date();
        hourDate.setHours(hour, 0, 0, 0);
        const isoDate = hourDate.toISOString();

        const matchingBuckets = timeRangeOptions.filter((range) =>
          isUTCBetweenLocalHours(isoDate, range.from, range.to)
        );

        expect(matchingBuckets).toHaveLength(1);
      }
    });
  });
});
