import { ArgSpecial, ArgLeagueEntry } from "../types";

export const mockAnnualTable: ArgLeagueEntry[] = [
  {
    teamId: 1,
    teamName: "Boca Juniors",
    points: 45,
    played: 20,
    wins: 14,
    draws: 3,
    losses: 3,
    goalsFor: 35,
    goalsAgainst: 15,
    goalDifference: 20,
    promedio: 2.25,
  },
  {
    teamId: 2,
    teamName: "River Plate",
    points: 42,
    played: 20,
    wins: 13,
    draws: 3,
    losses: 4,
    goalsFor: 30,
    goalsAgainst: 12,
    goalDifference: 18,
    promedio: 2.1,
  },
  {
    teamId: 3,
    teamName: "Independiente",
    points: 38,
    played: 20,
    wins: 11,
    draws: 5,
    losses: 4,
    goalsFor: 25,
    goalsAgainst: 18,
    goalDifference: 7,
    promedio: 1.9,
  },
];

export const mockPromediosTable: ArgLeagueEntry[] = [
  {
    teamId: 1,
    teamName: "Boca Juniors",
    promedio: 2.25,
  },
  {
    teamId: 2,
    teamName: "River Plate",
    promedio: 2.1,
  },
  {
    teamId: 3,
    teamName: "Huracán",
    promedio: 1.85,
  },
];

export const mockArgSpecial: ArgSpecial = {
  annualTable: mockAnnualTable,
  promediosTable: mockPromediosTable,
};
