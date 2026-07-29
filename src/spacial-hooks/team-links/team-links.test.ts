import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LeagueBasicInfo } from "../../types";

import { useTeamLinks } from "./team-links";
import { useTranslation } from "react-i18next";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key: string) => key),
  }),
}));

vi.mock("../../utils/main-leagues", () => ({
  default: (ids: number[]) => ids.includes(1),
}));

const mainLeagueTeam: LeagueBasicInfo[] = [
  { id: 1, name: "Premier League", type: "league" },
];
const nonMainLeagueTeam: LeagueBasicInfo[] = [
  { id: 999, name: "Unknown League", type: "league" },
];

describe("useTeamLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const { t } = useTranslation();

  it("returns empty links when data is not ready", () => {
    const { result } = renderHook(() => useTeamLinks(1, true, false, [], t));

    expect(result.current.teamlinks).toEqual([]);
    expect(result.current.canDisplayTeamPlayerGame).toBe(false);
  });

  it("always includes base team link when data is ready", () => {
    const { result } = renderHook(() =>
      useTeamLinks(1, false, true, mainLeagueTeam, t)
    );

    const labels = result.current.teamlinks.map((l) => l.label);

    expect(labels).toContain("common.team");
    expect(result.current.canDisplayTeamPlayerGame).toBe(true);
  });

  it("includes quiz link for main leagues only", () => {
    const { result } = renderHook(() =>
      useTeamLinks(1, false, true, mainLeagueTeam, t)
    );

    expect(result.current.teamlinks).toEqual([
      { label: "common.team", url: "/team/1" },
      { label: "teampage.takequiz", url: "/guess/team/player/1" },
    ]);
    expect(result.current.canDisplayTeamPlayerGame).toBe(true);
  });

  it("does NOT include quiz link for non-main leagues", () => {
    const { result } = renderHook(() =>
      useTeamLinks(1, false, true, nonMainLeagueTeam, t)
    );

    expect(result.current.teamlinks).toEqual([
      { label: "common.team", url: "/team/1" },
    ]);
    expect(result.current.canDisplayTeamPlayerGame).toBe(false);
  });

  it("returns empty array for invalid teamId", () => {
    const { result } = renderHook(() =>
      useTeamLinks(NaN, false, true, mainLeagueTeam, t)
    );

    expect(result.current.teamlinks).toEqual([]);
    expect(result.current.canDisplayTeamPlayerGame).toBe(false);
  });

  it("returns only base link if team leagues are unavailable", () => {
    const { result } = renderHook(() =>
      useTeamLinks(1, false, false, mainLeagueTeam, t)
    );

    expect(result.current.teamlinks).toEqual([
      { label: "common.team", url: "/team/1" },
    ]);
    expect(result.current.canDisplayTeamPlayerGame).toBe(false);
  });
});
