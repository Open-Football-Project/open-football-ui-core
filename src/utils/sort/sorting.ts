import { getFormattedDate } from "../dateandtime/dateAndTime";
import { LeagueFixturesMatch, LiveChartPoint } from "../../types";


export const sanitizeLiveChartPoints = (points: LiveChartPoint[]): LiveChartPoint[] =>
  [...points]
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt))
    .filter((point, index, sorted) => index === 0 || point.minute > sorted[index - 1].minute);

export const sortLeagueFixturesMatch = (
  fixtureMatches: LeagueFixturesMatch[]
): LeagueFixturesMatch[] => {
  return [...fixtureMatches].sort((a, b) => {
    try {
      const timeA = getFormattedDate(a.date, "yyyy-MM-dd HH:mm:ss");
      const timeB = getFormattedDate(b.date, "yyyy-MM-dd HH:mm:ss");
      return timeA.localeCompare(timeB);
    } catch {
      return 0;
    }
  });
};
