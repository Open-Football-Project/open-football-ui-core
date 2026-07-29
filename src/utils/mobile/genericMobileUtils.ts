import { SubheaderLink, SubheaderRouteMobile } from "../../types";

export enum MobileRoutes {
  LANDING = 'landing',
  ALL_LEAGUES = 'all-leagues',
  CHARTS = 'charts',
  GAME = 'game',
  GUESS_LEAGUE_TEAM = 'guess-league-team',
  GUESS_TEAM_PLAYER = 'guess-team-player',
  LEAGUE = 'league',
  LEAGUE_SPECIAL_ARG = 'league-special-arg',
  LEAGUE_SPECIAL_GROUPS = 'league-special-groups',
  LEAGUE_SPECIAL_KNOCKOUT = 'league-special-knockout',
  LIVE = 'live',
  MATCH_DETAILS = 'match-details',
  MATCHES = 'matches',
  PLAYER_HISTORY = 'player-history',
  TEAM_DETAILS = 'team-details',
  TODAY_PLAYERS = 'today-players',
}

export function leagueLinksToMobileRoutes(links: SubheaderLink[]): SubheaderRouteMobile[] {
  return links.map(link => {
    const leagueIdMatch = link.url.match(/\/league\/(\w+)/);
    const guessLeagueTeamMatch = link.url.match(/\/guess\/league\/team\/(\w+)/);
    const knockoutMatch = link.url.match(/\/knockout\/league\/(\w+)/);
    const groupsMatch = link.url.match(/\/groups\/league\/(\w+)/);
    const specialMatch = link.url.match(/\/league\/special\/(\w+)/);

    if (guessLeagueTeamMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.GUESS_LEAGUE_TEAM,
        param: { leagueId: guessLeagueTeamMatch[1] }
      };
    }

    if (knockoutMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.LEAGUE_SPECIAL_KNOCKOUT,
        param: { leagueId: knockoutMatch[1] }
      };
    }

    if (groupsMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.LEAGUE_SPECIAL_GROUPS,
        param: { leagueId: groupsMatch[1] }
      };
    }

    if (specialMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.LEAGUE_SPECIAL_ARG,
        param: { leagueId: specialMatch[1] }
      };
    }

    if (leagueIdMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.LEAGUE,
        param: { leagueId: leagueIdMatch[1] }
      };
    }

    return {
      label: link.label,
      routeName: MobileRoutes.LANDING
    };
  });
}

export function teamLinksToMobileRoutes(links: SubheaderLink[]): SubheaderRouteMobile[] {
  return links.map(link => {
    const teamIdMatch = link.url.match(/\/team\/(\w+)/);
    const guessTeamPlayerMatch = link.url.match(/\/guess\/team\/player\/(\w+)/);

    if (guessTeamPlayerMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.GUESS_TEAM_PLAYER,
        param: { teamId: guessTeamPlayerMatch[1] }
      };
    }

    if (teamIdMatch) {
      return {
        label: link.label,
        routeName: MobileRoutes.TEAM_DETAILS,
        param: { teamId: teamIdMatch[1] }
      };
    }

    return {
      label: link.label,
      routeName: MobileRoutes.LANDING
    };
  });
}