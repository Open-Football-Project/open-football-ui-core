import {
  FixtureService,
  fixtureService,
} from "./fixture-service/fixtureService";
import { gameService, GameService } from "./game-service/gameService";
import { LeagueService, leagueService } from "./league-service/leagueService";
import {
  MatchesService,
  matchesService,
} from "./matches-service/matchesService";
import { NewsService, newsService } from "./news-service/newsService";
import { OddsService, oddsService } from "./odds-service/oddsService";
import { PlayerService, playerService } from "./player-service/playerService";
import { pollsService, PollsService } from "./poll-service/pollService";
import {
  feedbackService,
  FeedbackService,
} from "./feedback-service/feedbackService";

import {
  RankingService,
  rankingService,
} from "./rankings-service/rankingsService";

import { TeamsService, teamsService } from "./teams-service/teamsService";

import { ChartsService, chartsService } from "./charts-service/chartsService";

export interface ApiService {
  fixtureService: FixtureService;
  leagueService: LeagueService;
  matchesService: MatchesService;
  oddsService: OddsService;
  teamsService: TeamsService;
  pollsService: PollsService;
  rankingService: RankingService;
  gameService: GameService;
  playerService: PlayerService;
  newsService: NewsService;
  feedbackService: FeedbackService;
  chartsService: ChartsService;
}

export const serviceWrapper = {
  fixtureService: fixtureService,
  leagueService: leagueService,
  matchesService: matchesService,
  oddsService: oddsService,
  teamsService: teamsService,
  pollsService: pollsService,
  rankingService: rankingService,
  gameService: gameService,
  playerService: playerService,
  newsService: newsService,
  feedbackService: feedbackService,
  chartsService: chartsService,
};
