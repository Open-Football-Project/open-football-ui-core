import { TwoTeamsStatistics } from "../types";

export const mockTeamsStatistics: TwoTeamsStatistics = {
  teamA: {
    teamId: 101,
    teamLogo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    teamName: "Arsenal",
    statistics: [
      { name: "Shots on Target", value: 7, isPositive: true, total: 14 },
      { name: "Corners", value: 5, isPositive: true, total: 15 },
      { name: "Fouls", value: 8, isPositive: false, total: 10 },
      { name: "Offsides", value: 2, isPositive: false, total: 10 },
      { name: "Yellow Cards", value: 1, isPositive: false, total: 10 },
      { name: "Red Cards", value: 0, isPositive: false, total: 10 },
      { name: "Pass Accuracy", value: 32, isPositive: true, total: 100 },
    ],
  },
  teamB: {
    teamId: 202,
    teamLogo: "https://upload.wikimedia.org/wikipedia/en/c/c9/Chelsea_FC.svg",
    teamName: "Chelsea",
    statistics: [
      { name: "Shots on Target", value: 3, isPositive: true, total: 10 },

      { name: "Corners", value: 2, isPositive: true, total: 10 },
      { name: "Fouls", value: 12, isPositive: false, total: 10 },
      { name: "Offsides", value: 4, isPositive: false, total: 10 },
      { name: "Yellow Cards", value: 2, isPositive: false, total: 10 },
      { name: "Red Cards", value: 0, isPositive: false, total: 10 },
      { name: "Pass Accuracy", value: 79, isPositive: true, total: 100 },
    ],
  },
};
