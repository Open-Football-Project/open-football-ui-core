import { describe, it, expect } from "vitest";
import { leagueLinksToMobileRoutes, teamLinksToMobileRoutes, MobileRoutes } from "./genericMobileUtils";
import { SubheaderLink } from "../../types";

describe("leagueLinksToMobileRoutes", () => {
  it("should return an empty array when given an empty array", () => {
    const result = leagueLinksToMobileRoutes([]);
    expect(result).toEqual([]);
  });

  it("should convert a league link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Premier League", url: "/league/123" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Premier League",
        routeName: MobileRoutes.LEAGUE,
        param: { leagueId: "123" }
      }
    ]);
  });

  it("should convert a guess league team link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Take Quiz", url: "/guess/league/team/456" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Take Quiz",
        routeName: MobileRoutes.GUESS_LEAGUE_TEAM,
        param: { leagueId: "456" }
      }
    ]);
  });

  it("should convert a knockout link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Knockout", url: "/knockout/league/789" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Knockout",
        routeName: MobileRoutes.LEAGUE_SPECIAL_KNOCKOUT,
        param: { leagueId: "789" }
      }
    ]);
  });

  it("should convert a groups link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Groups", url: "/groups/league/101" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Groups",
        routeName: MobileRoutes.LEAGUE_SPECIAL_GROUPS,
        param: { leagueId: "101" }
      }
    ]);
  });

  it("should convert a special (Argentina) link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Argentina Special", url: "/league/special/202" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Argentina Special",
        routeName: MobileRoutes.LEAGUE_SPECIAL_ARG,
        param: { leagueId: "202" }
      }
    ]);
  });

  it("should fallback to LANDING route when URL does not match any pattern", () => {
    const links: SubheaderLink[] = [
      { label: "Unknown", url: "/some/unknown/path" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Unknown",
        routeName: MobileRoutes.LANDING
      }
    ]);
  });

  it("should convert multiple links correctly", () => {
    const links: SubheaderLink[] = [
      { label: "League Cup", url: "/league/1" },
      { label: "Take Quiz", url: "/guess/league/team/1" },
      { label: "Knockout", url: "/knockout/league/1" },
      { label: "Groups", url: "/groups/league/1" },
      { label: "Arg Special", url: "/league/special/1" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result).toHaveLength(5);
    expect(result[0].routeName).toBe(MobileRoutes.LEAGUE);
    expect(result[1].routeName).toBe(MobileRoutes.GUESS_LEAGUE_TEAM);
    expect(result[2].routeName).toBe(MobileRoutes.LEAGUE_SPECIAL_KNOCKOUT);
    expect(result[3].routeName).toBe(MobileRoutes.LEAGUE_SPECIAL_GROUPS);
    expect(result[4].routeName).toBe(MobileRoutes.LEAGUE_SPECIAL_ARG);
  });

  it("should extract leagueId with alphanumeric characters", () => {
    const links: SubheaderLink[] = [
      { label: "League", url: "/league/abc123" }
    ];
    const result = leagueLinksToMobileRoutes(links);
    expect(result[0].param).toEqual({ leagueId: "abc123" });
  });
});

describe("teamLinksToMobileRoutes", () => {
  it("should return an empty array when given an empty array", () => {
    const result = teamLinksToMobileRoutes([]);
    expect(result).toEqual([]);
  });

  it("should convert a team link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Team", url: "/team/123" }
    ];
    const result = teamLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Team",
        routeName: MobileRoutes.TEAM_DETAILS,
        param: { teamId: "123" }
      }
    ]);
  });

  it("should convert a guess team player link to mobile format", () => {
    const links: SubheaderLink[] = [
      { label: "Take Quiz", url: "/guess/team/player/456" }
    ];
    const result = teamLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Take Quiz",
        routeName: MobileRoutes.GUESS_TEAM_PLAYER,
        param: { teamId: "456" }
      }
    ]);
  });

  it("should fallback to LANDING route when URL does not match any pattern", () => {
    const links: SubheaderLink[] = [
      { label: "Unknown", url: "/some/unknown/path" }
    ];
    const result = teamLinksToMobileRoutes(links);
    expect(result).toEqual([
      {
        label: "Unknown",
        routeName: MobileRoutes.LANDING
      }
    ]);
  });

  it("should convert multiple links correctly", () => {
    const links: SubheaderLink[] = [
      { label: "Team", url: "/team/1" },
      { label: "Take Quiz", url: "/guess/team/player/1" }
    ];
    const result = teamLinksToMobileRoutes(links);
    expect(result).toHaveLength(2);
    expect(result[0].routeName).toBe(MobileRoutes.TEAM_DETAILS);
    expect(result[1].routeName).toBe(MobileRoutes.GUESS_TEAM_PLAYER);
  });

  it("should extract teamId with alphanumeric characters", () => {
    const links: SubheaderLink[] = [
      { label: "Team", url: "/team/abc123" }
    ];
    const result = teamLinksToMobileRoutes(links);
    expect(result[0].param).toEqual({ teamId: "abc123" });
  });
});
