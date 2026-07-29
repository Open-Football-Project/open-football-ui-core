import { MatchEvent } from "../types";

export const mockMatchEvents: MatchEvent[] = [
  {
    timeElapsed: 23,

    teamName: "Manchester United",
    teamLogo: "https://media.api-sports.io/football/teams/33.png",
    playerName: "Bruno Fernandes",
    eventType: "Goal",
    eventDetails: "Penalty",
  },
  {
    timeElapsed: 55,

    teamName: "Liverpool",
    teamLogo: "https://media.api-sports.io/football/teams/34.png",
    playerName: "Mohamed Salah",
    eventType: "Goal",
    eventDetails: "Normal Goal",
  },
];
