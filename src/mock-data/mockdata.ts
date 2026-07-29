import {
  TeamsRestStatus,
  TeamsScorePerformance,
  OddsWinnerFeeling,
} from "../types";

export const teamRestStatus: TeamsRestStatus = {
  homeTeamStatus: "Good Rest",
  awayTeamStatus: "Moderate Congestion",
};

export const teamScorePerformance: TeamsScorePerformance = {
  homeTeamPerformance: "Good",
  awayTeamPerformance: "Poor",
};

export const oddsWinnerFeeling: OddsWinnerFeeling = {
  home: "Strong",
  draw: "Weak",
  away: "Weak",
};
