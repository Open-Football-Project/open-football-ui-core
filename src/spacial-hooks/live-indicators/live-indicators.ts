import { useMemo } from "react";
import {
  IndicatorResult,
  LiveIndicators,
  TwoTeamsStatistics,
  TeamStatistic,
} from "../../types";
import { getTeamStatistic, IndicatorStats } from "../../utils";

const normalize = (a: number, b: number): [number, number] => {
  const total = a + b;
  if (total === 0) return [50, 50];
  const homePercent = Math.round((a / total) * 100);
  return [homePercent, 100 - homePercent];
};

const MOMENTUM_WEIGHTS = {
  SHOTS_ON_GOAL: 3,
  SHOTS_INSIDEBOX: 2,
  SHOTS_OFF_GOAL: 1,
  CORNER_KICKS: 1,
} as const;

const CONTROL_WEIGHTS = {
  BALL_POSSESSION: 0.7,
  PASSES_PERCENTAGE: 0.3,
} as const;

const GOAL_THREAT_WEIGHTS = {
  EXPECTED_GOALS: 10,
  SHOTS_ON_GOAL: 3,
  SHOTS_INSIDEBOX: 1,
} as const;

const calcMomentum = (
  homeStats: TeamStatistic[],
  awayStats: TeamStatistic[],
  label: string,
): IndicatorResult => {
  const calc = (stats: TeamStatistic[]) =>
    getTeamStatistic(stats, IndicatorStats.SHOTS_ON_GOAL) *
      MOMENTUM_WEIGHTS.SHOTS_ON_GOAL +
    getTeamStatistic(stats, IndicatorStats.SHOTS_INSIDEBOX) *
      MOMENTUM_WEIGHTS.SHOTS_INSIDEBOX +
    getTeamStatistic(stats, IndicatorStats.SHOTS_OFF_GOAL) *
      MOMENTUM_WEIGHTS.SHOTS_OFF_GOAL +
    getTeamStatistic(stats, IndicatorStats.CORNER_KICKS) *
      MOMENTUM_WEIGHTS.CORNER_KICKS;

  const [homePercent, awayPercent] = normalize(
    calc(homeStats),
    calc(awayStats),
  );
  return { emoji: "⚡", label, homePercent, awayPercent };
};

const calcControl = (
  homeStats: TeamStatistic[],
  awayStats: TeamStatistic[],
  label: string,
): IndicatorResult => {
  const calc = (stats: TeamStatistic[]) =>
    getTeamStatistic(stats, IndicatorStats.BALL_POSSESSION) *
      CONTROL_WEIGHTS.BALL_POSSESSION +
    getTeamStatistic(stats, IndicatorStats.PASSES_PERCENTAGE) *
      CONTROL_WEIGHTS.PASSES_PERCENTAGE;

  const [homePercent, awayPercent] = normalize(
    calc(homeStats),
    calc(awayStats),
  );
  return { emoji: "🎮", label, homePercent, awayPercent };
};

const calcGoalThreat = (
  homeStats: TeamStatistic[],
  awayStats: TeamStatistic[],
  label: string,
): IndicatorResult => {
  const calc = (stats: TeamStatistic[]) =>
    getTeamStatistic(stats, IndicatorStats.EXPECTED_GOALS) *
      GOAL_THREAT_WEIGHTS.EXPECTED_GOALS +
    getTeamStatistic(stats, IndicatorStats.SHOTS_ON_GOAL) *
      GOAL_THREAT_WEIGHTS.SHOTS_ON_GOAL +
    getTeamStatistic(stats, IndicatorStats.SHOTS_INSIDEBOX) *
      GOAL_THREAT_WEIGHTS.SHOTS_INSIDEBOX;

  const [homePercent, awayPercent] = normalize(
    calc(homeStats),
    calc(awayStats),
  );
  return { emoji: "🎯", label, homePercent, awayPercent };
};

export const useLiveIndicators = (
  liveStats: TwoTeamsStatistics | undefined,
  momentumLabelKey: string = "indicators.momentum",
  matchControlLabelKey: string = "indicators.match_control",
  goalThreatLabelKey: string = "indicators.goal_threat",
): LiveIndicators => {
  return useMemo(() => {
    const homeStats = liveStats?.teamA?.statistics ?? [];
    const awayStats = liveStats?.teamB?.statistics ?? [];
    const hasData = homeStats.length > 0 && awayStats.length > 0;

    return {
      momentum: calcMomentum(homeStats, awayStats, momentumLabelKey),
      control: calcControl(homeStats, awayStats, matchControlLabelKey),
      goalThreat: calcGoalThreat(homeStats, awayStats, goalThreatLabelKey),
      hasData,
    };
  }, [liveStats]);
};
