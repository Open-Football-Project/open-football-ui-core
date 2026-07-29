import { FixtureTodayPlayers, TodayPlayerScore } from "../types";

const emptyPositions = {
  GOALKEEPER: [] as TodayPlayerScore[],
  DEFENDER: [] as TodayPlayerScore[],
  MIDFIELDER: [] as TodayPlayerScore[],
  ATTACKER: [] as TodayPlayerScore[],
};

export const todayPlayersMock: FixtureTodayPlayers[] = [
  {
    fixtureId: 1576804,
    leagueId: 1,
    leagueName: "FIFA World Cup",
    homeTeamName: "Argentina",
    awayTeamName: "Egypt",
    home: {
      ...emptyPositions,
      ATTACKER: [
        {
          player: { id: 154, name: "L. Messi", age: 38, number: 10, position: "Attacker", photo: null },
          score: 0.48,
          signal: "ODDS_IMPLIED",
          reason: { markets: ["Anytime Goal Scorer", "Player Assists"] },
        },
      ],
    },
    away: {
      ...emptyPositions,
      ATTACKER: [
        {
          player: { id: 301, name: "M. Salah", age: 33, number: 11, position: "Attacker", photo: null },
          score: 7.69,
          signal: "SEASON_STAT",
          reason: { appearances: 20, goals: 6, assists: 2, rating: 6.893 },
        },
      ],
    },
  },
];

export const todayPlayersFixtureIdsMock: number[] = [1576804];
