import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLeagueLinks } from "./league-links";
import { useTranslation } from "react-i18next";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
  }),
}));

vi.mock("../../utils/main-leagues", () => ({
  default: (ids: number[]) => ids.includes(1),
}));

vi.mock("../../utils/normalize", () => ({
  LEAGUE_CUP_ROUNDS: ["quarter-finals", "semi-finals", "final"],
  normalizeLeagueRound: (name: string) => name.toLowerCase(),
}));

const baseLeagueInfo = {
  group: ["A"],
} as any;

const multiGroupLeagueInfo = {
  group: ["A", "B"],
} as any;

const knockoutFixtures = {
  rounds: [{ name: "Quarter-Finals" }],
} as any;

const normalFixtures = {
  rounds: [{ name: "Regular Season" }],
} as any;

describe("useLeagueLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const { t } = useTranslation();

  it("returns empty links when data is not ready", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(1, undefined, true, false, undefined, true, false, t)
    );

    expect(result.current.leagueLinks).toEqual([]);
    expect(result.current.hasKnockoutPhase).toBe(false);
    expect(result.current.hasMultipleGroups).toBe(false);
    expect(result.current.canDisplayGameButtons).toBe(true);
  });

  it("always includes base league link when data is ready", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        1,
        baseLeagueInfo,
        false,
        true,
        normalFixtures,
        false,
        true,
        t
      )
    );

    expect(result.current.leagueLinks).toEqual([
      {
        label: "common.league_cup",
        url: "/league/1",
      },
      {
        label: "leagues.takequiz",
        url: "/guess/league/team/1",
      },
    ]);
  });

  it("does NOT include quiz button for non-main leagues", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        999,
        baseLeagueInfo,
        false,
        true,
        normalFixtures,
        false,
        true,
        t
      )
    );

    const labels = result.current.leagueLinks.map((l) => l.label);

    expect(labels).toContain("common.league_cup");
    expect(labels).not.toContain("leagues.teamquiz");
  });

  it("detects knockout phase correctly", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        1,
        baseLeagueInfo,
        false,
        true,
        knockoutFixtures,
        false,
        true,
        t
      )
    );

    expect(result.current.hasKnockoutPhase).toBe(true);

    expect(result.current.leagueLinks).toEqual(
      expect.arrayContaining([
        {
          label: "knockout.button",
          url: "/knockout/league/1",
        },
      ])
    );
  });

  it("detects multiple groups correctly", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        1,
        multiGroupLeagueInfo,
        false,
        true,
        normalFixtures,
        false,
        true,
        t
      )
    );

    expect(result.current.hasMultipleGroups).toBe(true);

    expect(result.current.leagueLinks).toEqual(
      expect.arrayContaining([
        {
          label: "lggroups.button",
          url: "/groups/league/1",
        },
      ])
    );
  });

  it("includes all links when all conditions are met", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        1,
        multiGroupLeagueInfo,
        false,
        true,
        knockoutFixtures,
        false,
        true,
        t
      )
    );

    expect(result.current.leagueLinks).toEqual([
      {
        label: "common.league_cup",
        url: "/league/1",
      },
      {
        label: "leagues.takequiz",
        url: "/guess/league/team/1",
      },
      {
        label: "knockout.button",
        url: "/knockout/league/1",
      },
      {
        label: "lggroups.button",
        url: "/groups/league/1",
      },
    ]);
  });

  it("returns safe defaults when leagueId is invalid", () => {
    const { result } = renderHook(() =>
      useLeagueLinks(
        NaN,
        baseLeagueInfo,
        false,
        true,
        normalFixtures,
        false,
        true,
        t
      )
    );

    expect(result.current.leagueLinks).toEqual([]);
    expect(result.current.hasKnockoutPhase).toBe(false);
    expect(result.current.hasMultipleGroups).toBe(false);
    expect(result.current.canDisplayGameButtons).toBe(false);
  });
});
