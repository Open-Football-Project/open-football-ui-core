export interface DonutsBrandColor {
  orange: string;
  aqualight: string;
  darkBg: string;
  divider: string;
}

export interface DonutsChartColors {
  homeTeam: string;
  awayTeam: string;
  track: string;
  divider: string;
}

export interface LiveMatchIndicatorsDonut {
  center: number;
  radius: number;
  strokeWidth: number;
  circumference: number;
  size: number;
}

export interface LiveMatchIndicatorsDonutVerdictThresholds {
  dominating: number;
  leading: number;
  trailing: number;
  dominated: number;
}

export interface LiveMatchIndicatorsDonutVerdictColors {
  homeLeading: string;
  awayLeading: string;
  contested: string;
}

export interface LiveMatchIndicatorsDonutTrKeys {
  veredictDominating: string;
  veredictAhead: string;
  veredictEven: string;
  veredictDominated: string;
  veredictNoData: string;
}
