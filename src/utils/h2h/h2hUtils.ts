import { IndicatorResult } from "../../types";
import { H2HDetails } from "../../types";

export const h2hToIndicator = (
  matches: H2HDetails[],
  homeTeam: string,
  awayTeam: string
): IndicatorResult => {
  if (matches.length === 0) {
    return { emoji: "⚔️", label: "indicators.h2h_history", homePercent: 50, awayPercent: 50 };
  }

  const total = matches.length;
  const homeWins = matches.filter((m) => m.winner === homeTeam).length;
  const awayWins = matches.filter((m) => m.winner === awayTeam).length;
  const draws = total - homeWins - awayWins;

  const homePercent = ((homeWins + draws * 0.5) / total) * 100;
  const awayPercent = ((awayWins + draws * 0.5) / total) * 100;

  return { emoji: "⚔️", label: "indicators.h2h_history", homePercent, awayPercent };
};
