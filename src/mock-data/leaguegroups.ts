import { LeaguesGroups } from "../types";

export const mockLeaguesGroups: LeaguesGroups = {
  internationals: [
    {
      id: 1,
      name: "Champions",
      type: "Cup",
      logo: "https://upload.wikimedia.org/champions-league-logo.png",
    },
    {
      id: 2,
      name: "World Cup",
      type: "International",
      logo: "https://upload.wikimedia.org/fifa-world-cup-logo.png",
    },
  ],
  countryLeagues: [
    {
      country: "England",
      flag: "https://upload.wikimedia.org/flags/england.png",
      leagues: [
        {
          id: 3,
          name: "Premier Liga",
          type: "League",
          logo: "https://upload.wikimedia.org/premier-league-logo.png",
        },
        {
          id: 4,
          name: "FA Cup",
          type: "Cup",
          logo: "https://upload.wikimedia.org/fa-cup-logo.png",
        },
      ],
    },
    {
      country: "Spain",
      flag: "https://upload.wikimedia.org/flags/spain.png",
      leagues: [
        {
          id: 5,
          name: "La Liga",
          type: "League",
          logo: "https://upload.wikimedia.org/la-liga-logo.png",
        },
        {
          id: 6,
          name: "Copa del Rey",
          type: "Cup",
          logo: "https://upload.wikimedia.org/copa-del-rey-logo.png",
        },
      ],
    },
  ],
  others: [
    {
      id: 7,
      name: "MLS",
      type: "League",
      logo: "https://upload.wikimedia.org/mls-logo.png",
    },
    {
      id: 8,
      name: "Saudi Pro League",
      type: "League",
      logo: "https://upload.wikimedia.org/saudi-pro-league-logo.png",
    },
  ],
};
