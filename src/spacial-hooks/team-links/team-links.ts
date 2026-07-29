import { useMemo } from "react";
import { TFunction } from "i18next";
import { LeagueBasicInfo, SubheaderLink } from "../../types";
import { anyMainLeagueId } from "../../utils/useful/useful";

export const useTeamLinks = (
  teamId: number,
  loadingTeamDetails: boolean,
  isTeamLeaguesAvailable: boolean,
  teamLeagues: LeagueBasicInfo[],
  t: TFunction<"translation", undefined>
) => {
  const isValidTeamId = Number.isFinite(teamId) && teamId > 0;

  const isDataReady = isValidTeamId && !loadingTeamDetails;

  const canDisplayTeamPlayerGame =
    isValidTeamId &&
    isTeamLeaguesAvailable &&
    anyMainLeagueId(teamLeagues?.map((league) => league.id) || []);

  const teamlinks = useMemo(() => {
    if (!isDataReady) return [];

    const links: SubheaderLink[] = [
      {
        label: t("common.team"),
        url: `/team/${teamId}`,
      },
    ];

    if (canDisplayTeamPlayerGame) {
      links.push({
        label: t("teampage.takequiz"),
        url: `/guess/team/player/${teamId}`,
      });
    }
    return links;
  }, [isDataReady, teamId, canDisplayTeamPlayerGame, t]);

  return {
    teamlinks,
    canDisplayTeamPlayerGame,
  };
};
