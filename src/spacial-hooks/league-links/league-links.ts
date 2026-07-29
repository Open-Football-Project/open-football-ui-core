import { useMemo } from "react";
import { TFunction } from "i18next";
import { LeagueFixture, LeagueInfo, SubheaderLink } from "../../types";
import { ARGENTINA_MAIN_LEAGUE_ID, LEAGUE_CUP_ROUNDS } from "../../values";
import {
  anyMainLeagueId,
  normalizeLeagueRound,
} from "../../utils/useful/useful";

export const useLeagueLinks = (
  leagueId: number,
  leagueInfo: LeagueInfo | undefined,
  loadingFixtures: boolean,
  isLeaguefixturesAvailable: boolean,
  fixtures: LeagueFixture | undefined,
  loadingLeagueInfo: boolean,
  isLeagueInfoAvailable: boolean,
  t: TFunction<"translation", undefined>
) => {
  const isValidLeagueId = Number.isFinite(leagueId) && leagueId > 0;

  const isDataReady = isValidLeagueId && !loadingFixtures && !loadingLeagueInfo;

  const canDisplayGameButtons = useMemo(
    () => isValidLeagueId && anyMainLeagueId([leagueId]),
    [isValidLeagueId, leagueId]
  );

  const hasKnockoutPhase = useMemo(() => {
    if (!isDataReady || !isLeaguefixturesAvailable || !fixtures?.rounds) {
      return false;
    }

    return fixtures.rounds.some((round) =>
      LEAGUE_CUP_ROUNDS.includes(normalizeLeagueRound(round.name))
    );
  }, [isDataReady, isLeaguefixturesAvailable, fixtures]);

  const hasMultipleGroups = useMemo(() => {
    if (!isDataReady || !isLeagueInfoAvailable || !leagueInfo?.group) {
      return false;
    }

    return leagueInfo.group.length > 1;
  }, [isDataReady, isLeagueInfoAvailable, leagueInfo]);

  const leagueLinks = useMemo(() => {
    if (!isDataReady) return [];

    const links: SubheaderLink[] = [
      {
        label: t("common.league_cup"),
        url: `/league/${leagueId}`,
      },
    ];

    if (canDisplayGameButtons) {
      links.push({
        label: t("leagues.takequiz"),
        url: `/guess/league/team/${leagueId}`,
      });
    }

    if (hasKnockoutPhase) {
      links.push({
        label: t("knockout.button"),
        url: `/knockout/league/${leagueId}`,
      });
    }

    if (hasMultipleGroups) {
      links.push({
        label: t("lggroups.button"),
        url: `/groups/league/${leagueId}`,
      });
    }

    if (leagueId === ARGENTINA_MAIN_LEAGUE_ID) {
      links.push({
        label: t("argspecial.button"),
        url: `/league/special/${leagueId}`,
      });
    }
    return links;
  }, [
    isDataReady,
    leagueId,
    canDisplayGameButtons,
    hasKnockoutPhase,
    hasMultipleGroups,
    t,
  ]);

  return {
    leagueLinks,
    hasKnockoutPhase,
    hasMultipleGroups,
    canDisplayGameButtons,
  };
};
