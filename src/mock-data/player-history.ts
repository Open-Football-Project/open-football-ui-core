import { PlayerHistory } from "../types";

export const mockPlayerHistory: PlayerHistory = {
  player: {
    id: 276,
    name: "Lionel Messi",
    photo: "https://media.api-sports.io/football/players/276.png",
  },

  trophies: [
    {
      league: "La Liga",
      country: "Spain",
      season: "2020/2021",
      place: "Winner",
    },
    {
      league: "Copa America",
      country: "South America",
      season: "2021",
      place: "Winner",
    },
    {
      league: "FIFA World Cup",
      country: "World",
      season: "2022",
      place: "Winner",
    },
    {
      league: "UEFA Champions League",
      country: "Europe",
      season: "2014/2015",
      place: "Winner",
    },
  ],

  transfers: [
    {
      date: "2004-07-01",
      fromTeamId: null,
      fromTeamName: "Barcelona Youth",
      fromTeamLogo: null,
      toTeamId: 529,
      toTeamName: "FC Barcelona",
      toTeamLogo: "https://media.api-sports.io/football/teams/529.png",
    },
    {
      date: "2021-08-10",
      fromTeamId: 529,
      fromTeamName: "FC Barcelona",
      fromTeamLogo: "https://media.api-sports.io/football/teams/529.png",
      toTeamId: 85,
      toTeamName: "Paris Saint-Germain",
      toTeamLogo: "https://media.api-sports.io/football/teams/85.png",
    },
    {
      date: "2023-07-15",
      fromTeamId: 85,
      fromTeamName: "Paris Saint-Germain",
      fromTeamLogo: "https://media.api-sports.io/football/teams/85.png",
      toTeamId: 956,
      toTeamName: "Inter Miami",
      toTeamLogo: "https://media.api-sports.io/football/teams/956.png",
    },
  ],
};
