import { TeamsLineups } from "../types";

export const mockLineups: TeamsLineups = {
  teamA: {
    teamId: 101,
    teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    teamName: "Arsenal",
    teamFormation: "4-3-3",
    lineup: [
      { name: "David Raya", number: 1, pos: "G", grid: "1:1" },
      { name: "Ben White", number: 4, pos: "D", grid: "2:1" },
      { name: "Gabriel", number: 6, pos: "D", grid: "2:2" },
      { name: "Saliba", number: 12, pos: "D", grid: "2:3" },
      { name: "Zinchenko", number: 3, pos: "D", grid: "2:4" },
      { name: "Rice", number: 41, pos: "M", grid: "3:2" },
      { name: "Odegaard", number: 8, pos: "M", grid: "3:3" },
      { name: "Havertz", number: 29, pos: "M", grid: "3:4" },
      { name: "Saka", number: 7, pos: "F", grid: "4:2" },
      { name: "Jesus", number: 9, pos: "F", grid: "4:3" },
      { name: "Martinelli", number: 11, pos: "F", grid: "4:4" },
    ],
    substitutes: [
      { name: "Turner", number: 30, pos: "G", grid: "0:0" },
      { name: "Smith Rowe", number: 10, pos: "M", grid: "0:0" },
    ],
  },
  teamB: {
    teamId: 202,
    teamLogo: "https://upload.wikimedia.org/wikipedia/en/c/c9/Chelsea_FC.svg",
    teamName: "Chelsea",
    teamFormation: "3-5-2",
    lineup: [
      { name: "Sánchez", number: 1, pos: "G", grid: "1:1" },
      { name: "Thiago Silva", number: 6, pos: "D", grid: "2:2" },
      { name: "Badiashile", number: 5, pos: "D", grid: "2:3" },
      { name: "Disasi", number: 2, pos: "D", grid: "2:4" },
      { name: "Fernández", number: 8, pos: "M", grid: "3:2" },
      { name: "Caicedo", number: 25, pos: "M", grid: "3:3" },
      { name: "Sterling", number: 17, pos: "F", grid: "4:3" },
      { name: "Palmer", number: 20, pos: "F", grid: "4:4" },
    ],
    substitutes: [
      { name: "Petrović", number: 28, pos: "G", grid: "0:0" },
      { name: "Mudryk", number: 10, pos: "F", grid: "0:0" },
    ],
  },
};
