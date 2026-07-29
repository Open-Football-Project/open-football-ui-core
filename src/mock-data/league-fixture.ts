import { LeagueFixture } from "../types";

export const mockLeagueFixture: LeagueFixture = {
  rounds: [
    {
      name: "Round 1",
      days: [
        {
          date: "2025-09-25",
          matches: [
            {
              fixtureId: 101,
              homeTeamId: 1,
              awayTeamId: 2,
              homeTeamName: "FC Alpha",
              awayTeamName: "Beta United",
              homeTeamLogo: "https://example.com/logos/alpha.png",
              awayTeamLogo: "https://example.com/logos/beta.png",
              date: "2025-09-25T18:00:00Z",
              homeTeamScore: 2,
              awayTeamScore: 1,
              isFinished: true,
              fixtureRound: "Round 1",
              statusLong: "NOT STARTED",
              statusShort: "NS",
              isLiveNow: false,
            },
          ],
        },
        {
          date: "2025-09-26",
          matches: [
            {
              fixtureId: 102,
              homeTeamId: 3,
              awayTeamId: 4,
              homeTeamName: "Gamma FC",
              awayTeamName: "Delta City",
              homeTeamLogo: "https://example.com/logos/gamma.png",
              awayTeamLogo: "https://example.com/logos/delta.png",
              date: "2025-09-26T20:00:00Z",
              homeTeamScore: 0,
              awayTeamScore: 0,
              isFinished: false,
              fixtureRound: "Round 1",
              statusLong: "FULL TIME",
              statusShort: "FT",
              isLiveNow: true,
            },
          ],
        },
      ],
    },
    {
      name: "Round 2",
      days: [
        {
          date: "2025-09-27",
          matches: [
            {
              fixtureId: 201,
              homeTeamId: 1,
              awayTeamId: 3,
              homeTeamName: "FC Alpha",
              awayTeamName: "Gamma FC",
              homeTeamLogo: "https://example.com/logos/alpha.png",
              awayTeamLogo: "https://example.com/logos/gamma.png",
              date: "2025-09-27T18:00:00Z",
              homeTeamScore: null,
              awayTeamScore: null,
              isFinished: false,
              fixtureRound: "Round 2",
              statusLong: "NOT STARTED",
              statusShort: "NS",
              isLiveNow: false,
            },
          ],
        },
        {
          date: "2025-09-28",
          matches: [
            {
              fixtureId: 202,
              homeTeamId: 2,
              awayTeamId: 4,
              homeTeamName: "Beta United",
              awayTeamName: "Delta City",
              homeTeamLogo: "https://example.com/logos/beta.png",
              awayTeamLogo: "https://example.com/logos/delta.png",
              date: "2025-09-28T20:00:00Z",
              homeTeamScore: null,
              awayTeamScore: null,
              isFinished: false,
              fixtureRound: "Round 2",
              statusLong: "FULL TIME",
              statusShort: "FT",
              isLiveNow: true,
            },
          ],
        },
      ],
    },
  ],
  currentRoundIndex: 1,
  totalRounds: 2,
};
