export interface LeagueBasicInfo {
  id: number;
  name: string;
  type: string;
  logo?: string;
}

export interface CountryLeagues {
  country: string;
  flag?: string;
  leagues: LeagueBasicInfo[];
}

export interface LeaguesGroups {
  internationals: LeagueBasicInfo[];
  countryLeagues: CountryLeagues[];
  others: LeagueBasicInfo[];
}
