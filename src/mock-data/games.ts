import { GuessThePlayerGameData, GuessTheTeamGameData } from "../types";

export const mockGuessThePlayerGame: GuessThePlayerGameData = {
  isAvailable: true,
  playerId: 10,
  playerName: "Lionel Messi",
  playerNationality: "Argentina",
  playerPosition: "Forward",
  playerPhoto: "https://example.com/photos/messi.png",
  options: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr", "Luka Modrić"],
  hints: [
    {
      hintKey: "TRANSFER",
      description: "Joined PSG from FC Barcelona in 2021",
      transferFromTeam: "FC Barcelona",
      transferToTeam: "Paris Saint-Germain",
      transferDate: "2021-08-10",
      transferYear: 2021,
    },
    {
      hintKey: "TROPHY",
      description: "Won the FIFA World Cup in 2022",
      trophyCountry: "Argentina",
      trophyLeague: "League 1",
      trophySeason: "2022",
    },
  ],
};

export const mockGuessTheTeamGame: GuessTheTeamGameData = {
  isAvailable: true,
  teamId: 10,
  teamLogo: "https://example.com/logos/barcelona.png",
  teamName: "FC Barcelona",
  venue: "Spotify Camp Nou",
  founded: 1899,
  season: 2025,
  hints: [
    {
      hintKey: "PLAYER",
      description: "team_quiz_goals_scored",
      value: "55",
    },
    {
      hintKey: "STAT",
      description: "team_quiz_clean_sheets_home",
      value: "16",
    },
  ],
  options: [
    "Real Madrid",
    "FC Barcelona",
    "Manchester United",
    "Paris Saint-Germain",
    "Bayern Munich",
  ],
};
