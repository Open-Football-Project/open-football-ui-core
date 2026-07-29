import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { LeagueFixture, LeagueInfo, ArgSpecial } from "../../types";
import { useLeaguePlayerRankings } from "../league-rankings/league-rankings";
import { ARGENTINA_MAIN_LEAGUE_ID } from "../../values";
import { useLeagueLinks } from "../../spacial-hooks";
import { TFunction } from "i18next";

export const useLeaguePage = (
  apiService: ApiService,
  leagueId: number,
  t: TFunction<"translation", undefined>
) => {
  const [fixtures, setFixtures] = useState<LeagueFixture | undefined>(
    undefined
  );
  const [loadingFixtures, setLoadingFixtures] = useState(true);
  const isLeaguefixturesAvailable = !loadingFixtures && fixtures !== undefined;

  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | undefined>(
    undefined
  );
  const [loadingLeagueInfo, setLoadingLeagueInfo] = useState(true);
  const isLeagueInfoAvailable = !loadingLeagueInfo && leagueInfo !== undefined;

  const [argSpecial, setArgSpecial] = useState<ArgSpecial | undefined>(
    undefined
  );

  const [loadingArgSpecial, setLoadingArgSpecial] = useState(true);
  const isArgSpecialAvailable = !loadingArgSpecial && argSpecial !== undefined;

  const { leagueService, fixtureService } = apiService;

  useEffect(() => {
    setLoadingLeagueInfo(true);
    setLoadingFixtures(true);
    setLoadingArgSpecial(true);

    leagueService
      .fetchLeagueStanding(Number(leagueId))
      .then((info) => {
        if (info.id === -1) setLeagueInfo(undefined);
        else setLeagueInfo(info);
      })
      .catch(() => setLeagueInfo(undefined))
      .finally(() => setLoadingLeagueInfo(false));

    fixtureService
      .fetchLeagueFixture(Number(leagueId))
      .then((data: LeagueFixture) => {
        if (data.rounds.length === 0) setFixtures(undefined);
        else setFixtures(data);
      })
      .catch(() => setFixtures(undefined))
      .finally(() => setLoadingFixtures(false));

    if (leagueId === ARGENTINA_MAIN_LEAGUE_ID) {
      leagueService
        .fetchArgSpecial()
        .then((info) => {
          setArgSpecial(info);
        })
        .catch(() => {
          setArgSpecial(undefined);
        })
        .finally(() => setLoadingArgSpecial(false));
    }
  }, [leagueId]);

  const {
    assists,
    isAssistsAvailable,
    loadingAssists,
    isRedCardsAvailable,
    redCards,
    loadingRedCards,
    isYellowCardsAvailable,
    yellowCards,
    loadingYellowCards,
    isTopScorersAvailable,
    topScorers,
    loadingTopScorers,
  } = useLeaguePlayerRankings(apiService, leagueId);

  const {
    leagueLinks,
    hasKnockoutPhase,
    hasMultipleGroups,
    canDisplayGameButtons,
  } = useLeagueLinks(
    leagueId,
    leagueInfo,
    loadingFixtures,
    isLeaguefixturesAvailable,
    fixtures,
    loadingLeagueInfo,
    isLeagueInfoAvailable,
    t
  );

  return {
    isLeagueInfoAvailable,
    leagueInfo,
    loadingLeagueInfo,
    isLeaguefixturesAvailable,
    fixtures,
    loadingFixtures,
    assists,
    loadingAssists,
    isAssistsAvailable,
    redCards,
    isRedCardsAvailable,
    loadingRedCards,
    isYellowCardsAvailable,
    yellowCards,
    loadingYellowCards,
    isTopScorersAvailable,
    topScorers,
    loadingTopScorers,
    leagueLinks,
    hasKnockoutPhase,
    hasMultipleGroups,
    canDisplayGameButtons,
    isArgSpecialAvailable,
    argSpecial,
    loadingArgSpecial,
  };
};
