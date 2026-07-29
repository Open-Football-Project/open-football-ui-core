export interface IndicatorResult {
  emoji: string;
  label: string;
  homePercent: number;
  awayPercent: number;
}

export interface LiveIndicators {
  momentum: IndicatorResult;
  control: IndicatorResult;
  goalThreat: IndicatorResult;
  hasData: boolean;
}
