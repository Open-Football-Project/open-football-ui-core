import { PlayerMainInfo } from "../types";

export const playerMainInfoMock: PlayerMainInfo = {
  playerId: 2273,
  name: "Kepa",
  age: 31,
  nationality: "Spain",
  position: "Goalkeeper",
  height: "189",
  weight: "84",
  teamId: 42,
  teamName: "Arsenal",
  teamLogo: "https://media.api-sports.io/football/teams/42.png",
  photo: "https://media.api-sports.io/football/players/2273.png",
  injured: false,
  videos: [{ url: "https://www.youtube.com/watch?v=abc123", esLabel: "Resumen del Jugador", enLabel: "Player Highlights", uploadDate: "01/01/2026" }],
};
