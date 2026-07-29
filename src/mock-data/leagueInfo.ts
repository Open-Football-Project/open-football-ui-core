import { LeagueInfo, TeamPositionsAndPoints } from "../types";

export const mockLeagueInfo: LeagueInfo = {
  id: 1,
  name: "Premier League",
  country: "England",
  logo: "https://example.com/premier-league-logo.png",
  flag: "https://example.com/england-flag.png",
  season: 2025,
  group: [
    {
      label: "Group A",
      teams: [
        {
          teamId: 1,
          rank: 1,
          teamName: "Manchester United",
          logo: "https://example.com/manu-logo.png",
          points: 45,
          played: 20,
          won: 14,
          draw: 3,
          lost: 3,
          goalsFor: 40,
          goalsAgainst: 20,
          form: "WWDWL",
          update: "2025-02-01T15:30:00Z",
        },
        {
          teamId: 2,
          rank: 2,
          teamName: "Chelsea",
          logo: "https://example.com/chelsea-logo.png",
          points: 42,
          played: 20,
          won: 13,
          draw: 3,
          lost: 4,
          goalsFor: 38,
          goalsAgainst: 22,
          form: "WLWDW",
          update: "2025-02-01T15:30:00Z",
        },
      ],
    },
    {
      label: "Group B",
      teams: [
        {
          teamId: 3,
          rank: 1,
          teamName: "Liverpool",
          logo: "https://example.com/liverpool-logo.png",
          points: 47,
          played: 20,
          won: 15,
          draw: 2,
          lost: 3,
          goalsFor: 44,
          goalsAgainst: 19,
          form: "WWWWW",
          update: "2025-02-01T15:30:00Z",
        },
      ],
    },
  ],
  videos: [{ url: "https://www.youtube.com/watch?v=league1", esLabel: "Resumen de Liga", enLabel: "League Highlights", uploadDate: "01/01/2026" }],
};

export const mockTeamPositionsAndPoints: TeamPositionsAndPoints = {
  homeTeam: [
    {
      position: 1,
      points: 25,
      description: "group B",
    },
    {
      position: 2,
      points: 20,
      description: "group A",
    },
  ],
  awayTeam: [
    {
      position: 1,
      points: 23,
      description: "group B",
    },
    {
      position: 2,
      points: 18,
      description: "group A",
    },
  ],
};
