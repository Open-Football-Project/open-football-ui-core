export interface DayTimeRange {
  from: number;
  to: number;
  name: string;
}

export interface SubheaderLink {
  label: string;
  url: string;  
}

export interface SubheaderRouteMobile {
  label: string;
  routeName: string;  
  param?: Record<string, string>;
}
