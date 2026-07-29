import { DayMatchesResponse } from "../types";

export const mockDayMatchesResponse: DayMatchesResponse[] = [
  {
    country: "Spain",
    matchesByLeague: [
      {
        leagueId: 140,
        leagueName: "La Liga",
        leagueLogo: "https://media.api-sports.io/football/leagues/140.png",
        matches: [
          {
            fixtureId: 2001,
            homeTeamId: 529,
            awayTeamId: 530,
            homeTeamName: "Real Madrid",
            awayTeamName: "Barcelona",
            homeTeamLogo: "https://media.api-sports.io/football/teams/529.png",
            awayTeamLogo: "https://media.api-sports.io/football/teams/530.png",
            homeTeamScore: 2,
            awayTeamScore: 2,
            isFinished: true,
            date: "2024-10-05T18:00:00Z",
            statusLong: "FULL TIME",
            statusShort: "FT",
            isLiveNow: true,
          },
          {
            fixtureId: 2002,
            homeTeamId: 531,
            awayTeamId: 532,
            homeTeamName: "Atletico Madrid",
            awayTeamName: "Sevilla",
            homeTeamLogo: "https://media.api-sports.io/football/teams/531.png",
            awayTeamLogo: "https://media.api-sports.io/football/teams/532.png",
            homeTeamScore: null,
            awayTeamScore: null,
            isFinished: false,
            date: "2024-10-05T18:00:00Z",
            statusLong: "NOT STARTED",
            statusShort: "NS",
            isLiveNow: false,
          },
        ],
      },
    ],
  },
];
