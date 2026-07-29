import { Bet, ValueBetsResponse } from "../types";

export const valueBetsResponse: ValueBetsResponse = {
  markets: [
    {
      betName: "Match Winner",
      fairOdds: [
        { label: "Home", odd: 1.85 },
        { label: "Draw", odd: 3.60 },
        { label: "Away", odd: 4.20 },
      ],
      bookmakers: [
        {
          name: "Bookmaker A",
          outcomes: [
            { label: "Home", odd: 1.80, isValue: false },
            { label: "Draw", odd: 3.50, isValue: false },
            { label: "Away", odd: 4.50, isValue: true },
          ],
        },
        {
          name: "Bookmaker B",
          outcomes: [
            { label: "Home", odd: 1.90, isValue: true },
            { label: "Draw", odd: 3.70, isValue: true },
            { label: "Away", odd: 4.00, isValue: false },
          ],
        },
      ],
    },
    {
      betName: "Double Chance",
      fairOdds: [
        { label: "Home/Draw", odd: 1.21 },
        { label: "Home/Away", odd: 1.25 },
        { label: "Draw/Away", odd: 2.07 },
      ],
      bookmakers: [
        {
          name: "Bookmaker A",
          outcomes: [
            { label: "Home/Draw", odd: 1.20, isValue: false },
            { label: "Home/Away", odd: 1.28, isValue: true },
            { label: "Draw/Away", odd: 2.10, isValue: true },
          ],
        },
        {
          name: "Bookmaker B",
          outcomes: [
            { label: "Home/Draw", odd: 1.22, isValue: true },
            { label: "Home/Away", odd: 1.22, isValue: false },
            { label: "Draw/Away", odd: 2.05, isValue: false },
          ],
        },
      ],
    },
    {
      betName: "First Half Winner",
      fairOdds: [
        { label: "Home", odd: 2.30 },
        { label: "Draw", odd: 2.28 },
        { label: "Away", odd: 4.40 },
      ],
      bookmakers: [
        {
          name: "Bookmaker A",
          outcomes: [
            { label: "Home", odd: 2.25, isValue: false },
            { label: "Draw", odd: 2.30, isValue: true },
            { label: "Away", odd: 4.50, isValue: true },
          ],
        },
        {
          name: "Bookmaker B",
          outcomes: [
            { label: "Home", odd: 2.35, isValue: true },
            { label: "Draw", odd: 2.25, isValue: false },
            { label: "Away", odd: 4.30, isValue: false },
          ],
        },
      ],
    },
  ],
};

export const bets: Bet[] = [
  {
    betName: "Match Winner",
    values: [
      { label: "Team A", odd: 1.85 },
      { label: "Draw", odd: 3.4 },
      { label: "Team B", odd: 2.1 },
    ],
  },
  {
    betName: "Total Goals Over/Under",
    values: [
      { label: "Over 2.5", odd: 1.95 },
      { label: "Under 2.5", odd: 1.85 },
    ],
  },
  {
    betName: "Both Teams to Score",
    values: [
      { label: "Yes", odd: 1.7 },
      { label: "No", odd: 2.0 },
    ],
  },
  {
    betName: "Correct Score",
    values: [
      { label: "1-0", odd: 7.5 },
      { label: "2-1", odd: 8.0 },
      { label: "0-0", odd: 9.0 },
    ],
  },
  {
    betName: "First Half Result",
    values: [
      { label: "Team A", odd: 2.0 },
      { label: "Draw", odd: 2.2 },
      { label: "Team B", odd: 3.5 },
    ],
  },
];
