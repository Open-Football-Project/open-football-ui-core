import { BetOddsPoint, LiveChartPoint } from "./live-charts";

export enum ChartPanelType {
  Momentum = "momentum",
  Control = "control",
  GoalThreat = "goal_threat",
  Odds = "odds",
}

export interface ChartLine {
  label: string;
  points: BetOddsPoint[];
}

export interface ChartPanel {
  type: ChartPanelType;
  points: LiveChartPoint[];
  homeTeamName: string;
  awayTeamName: string;
  id?: number;
  title?: string;
  lines?: ChartLine[];
}
