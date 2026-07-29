import { MatchDetails } from "../types";

export const mockMatchDetails: MatchDetails = {
  id: 101,
  date: "2025-08-03T16:00:00Z",
  league: {
    id: 1,
    name: "Premier League",
    country: "England",
    logo: "https://example.com/logo.png",
    flag: "https://example.com/flag.png",
    season: 2025,
    round: "Matchday 3",
  },
  venue: {
    name: "Old Trafford",
    city: "Manchester",
  },
  homeTeam: {
    id: 10,
    name: "Manchester United",
    logo: "https://example.com/mu-logo.png",
    winner: false,
    goals: 1,
  },
  awayTeam: {
    id: 20,
    name: "Arsenal",
    logo: "https://example.com/arsenal-logo.png",
    winner: true,
    goals: 2,
  },
  goals: {
    home: 1,
    away: 2,
  },
  score: {
    halftime: {
      home: 0,
      away: 1,
    },
    fulltime: {
      home: 1,
      away: 2,
    },
    extratime: {
      home: 2,
      away: 2,
    },
    penalty: {
      home: 3,
      away: 4,
    },
  },
  statusLong: "NOT STARTED",
  statusShort: "NS",
  isLiveNow: true,
  videos: [{ url: "https://www.youtube.com/watch?v=match1", esLabel: "Resumen del Partido", enLabel: "Match Highlights", uploadDate: "01/01/2026" }],
};
