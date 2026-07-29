import { renderHook, act } from "@testing-library/react";

import { describe, it, vi, Mock, expect, beforeEach } from "vitest";

import { useLiveNowStatus } from "./LiveNowStatus";
import { useLiveMatches } from "../../spacial-hooks";

const mockMatchesResponse = [
  {
    country: "England",
    leagueMatches: [
      {
        leagueId: 1,
        leagueName: "Premier League",
        leagueLogo: "premier.png",
        matches: [{ fixtureId: 101 }, { fixtureId: 102 }],
      },
      {
        leagueId: 2,
        leagueName: "Championship",
        leagueLogo: "champ.png",
        matches: [{ fixtureId: 103 }],
      },
    ],
  },
  {
    country: "Spain",
    leagueMatches: [
      {
        leagueId: 3,
        leagueName: "La Liga",
        leagueLogo: "laliga.png",
        matches: [{ fixtureId: 201 }],
      },
    ],
  },
];

vi.mock("../../spacial-hooks", async () => {
  return {
    useLiveMatches: vi.fn(),
  };
});

describe("useLiveNowStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty state when no matches", () => {
    (useLiveMatches as unknown as Mock).mockReturnValue([]);

    const { result } = renderHook(() => useLiveNowStatus("htp://api", 1));

    expect(result.current.selectedCountry).toBeUndefined();
    expect(result.current.selectedLeagueId).toBeUndefined();
    expect(result.current.leagues).toEqual([]);
    expect(result.current.countries).toEqual([]);
  });

  it("sets initial country and leagues from first match", () => {
    (useLiveMatches as unknown as Mock).mockReturnValue(mockMatchesResponse);

    const { result } = renderHook(() => useLiveNowStatus("htp://api", 1));

    expect(result.current.selectedCountry).toBe("England");
    expect(result.current.countries).toEqual(["England", "Spain"]);
    expect(result.current.leagues).toHaveLength(2);
    expect(result.current.selectedLeagueId).toBe(1);
    expect(result.current.selectedLeague?.leagueName).toBe("Premier League");
    expect(result.current.selectedLeagueMatches).toHaveLength(2);
  });

  it("updates leagues and selectedLeagueId when country changes", () => {
    (useLiveMatches as unknown as Mock).mockReturnValue(mockMatchesResponse);

    const { result } = renderHook(() => useLiveNowStatus("htp://api", 1));

    act(() => {
      result.current.setSelectedCountry("Spain");
    });

    expect(result.current.selectedCountry).toBe("Spain");
    expect(result.current.leagues).toHaveLength(1);
    expect(result.current.selectedLeagueId).toBe(3);
    expect(result.current.selectedLeague?.leagueName).toBe("La Liga");
    expect(result.current.selectedLeagueMatches).toHaveLength(1);
  });

  it("keeps selectedLeagueId if still valid when country stays the same", () => {
    (useLiveMatches as unknown as Mock).mockReturnValue(mockMatchesResponse);

    const { result } = renderHook(() => useLiveNowStatus("htp://api", 1));

    act(() => {
      result.current.setSelectedLeagueId(2);
    });

    act(() => {
      result.current.setSelectedCountry("England");
    });

    expect(result.current.selectedLeagueId).toBe(2);
    expect(result.current.selectedLeague?.leagueName).toBe("Championship");
  });

  it("selects the correct country and league when fixtureId is provided", () => {
    (useLiveMatches as unknown as Mock).mockReturnValue([
      {
        country: "England",
        leagueMatches: [
          {
            leagueId: 1,
            leagueName: "Premier League",
            leagueLogo: "premier.png",
            matches: [{ id: 101 }, { id: 102 }],
          },
        ],
      },
      {
        country: "Spain",
        leagueMatches: [
          {
            leagueId: 3,
            leagueName: "La Liga",
            leagueLogo: "laliga.png",
            matches: [{ id: 201 }],
          },
        ],
      },
    ]);

    const { result } = renderHook(() =>
      useLiveNowStatus("htp://api", 1, "201")
    );

    expect(result.current.selectedCountry).toBe("Spain");
    expect(result.current.selectedLeagueId).toBe(3);
    expect(result.current.selectedLeague?.leagueName).toBe("La Liga");
    expect(result.current.selectedLeagueMatches).toHaveLength(1);
  });
});
