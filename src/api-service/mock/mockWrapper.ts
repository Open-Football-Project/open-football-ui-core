import { ApiService } from "../implementation";
import { fixtureService } from "./fixtureMockService";
import { leagueService } from "./leagueMockService";
import { matchesService } from "./matchesMockService";
import { oddsService } from "./oddsMockService";
import { teamsService } from "./teamsMockService";
import { pollsService } from "./pollsMockService";
import { rankingService } from "./rankingMockService";
import { gameService } from "./gameMockService";
import { playerService } from "./playerMockService";
import { newsService } from "./newsMockService";
import { feedbackService } from "./feedbackMockService";
import { chartsService } from "./chartsMockService";

export const serviceMockWrapper: ApiService = {
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
