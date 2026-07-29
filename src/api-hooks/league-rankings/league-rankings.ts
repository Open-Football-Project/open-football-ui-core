import { useEffect, useState } from "react";
import { LeagueRankingPlayer } from "../../types";
import { ApiService, rankingKey } from "../../api-service";

export const useLeaguePlayerRankings = (
  apiService: ApiService,
  leagueId: number
) => {
  const [topScorers, setTopScorers] = useState<LeagueRankingPlayer[]>([]);
  const [loadingTopScorers, setLoadingTopScorers] = useState(true);

  const isTopScorersAvailable = !loadingTopScorers && topScorers?.length > 0;

  const [yellowCards, setYellowCards] = useState<LeagueRankingPlayer[]>([]);
  const [loadingYellowCards, setLoadingYellowCards] = useState(true);

  const isYellowCardsAvailable = !loadingYellowCards && yellowCards?.length > 0;

  const [redCards, setRedCards] = useState<LeagueRankingPlayer[]>([]);
  const [loadingRedCards, setLoadingRedCards] = useState(true);

  const isRedCardsAvailable = !loadingRedCards && redCards?.length > 0;

  const [assists, setAssists] = useState<LeagueRankingPlayer[]>([]);
  const [loadingAssists, setLoadingAssists] = useState(true);

  const isAssistsAvailable = !loadingAssists && assists?.length > 0;

  const { rankingService } = apiService;

  useEffect(() => {
    setLoadingTopScorers(true);
    setLoadingYellowCards(true);
    setLoadingRedCards(true);
    setLoadingAssists(true);

    rankingService
      .fetchRanking(rankingKey.scorers, leagueId)
      .then((it) => setTopScorers(it))
      .catch(() => setTopScorers([]))
      .finally(() => setLoadingTopScorers(false));

    rankingService
      .fetchRanking(rankingKey.yellowCard, leagueId)
      .then((it) => setYellowCards(it))
      .catch(() => setYellowCards([]))
      .finally(() => setLoadingYellowCards(false));

    rankingService
      .fetchRanking(rankingKey.redCard, leagueId)
      .then((it) => setRedCards(it))
      .catch(() => setRedCards([]))
      .finally(() => setLoadingRedCards(false));

    rankingService
      .fetchRanking(rankingKey.assists, leagueId)
      .then((it) => setAssists(it))
      .catch(() => setAssists([]))
      .finally(() => setLoadingAssists(false));
  }, [leagueId]);

  return {
    topScorers,
    loadingTopScorers,
    isTopScorersAvailable,
    yellowCards,
    loadingYellowCards,
    isYellowCardsAvailable,
    redCards,
    loadingRedCards,
    isRedCardsAvailable,
    assists,
    loadingAssists,
    isAssistsAvailable,
  };
};
