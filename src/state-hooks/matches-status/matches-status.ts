import { useEffect, useMemo, useState } from "react";
import { ApiService } from "../../api-service";
import { useMatches } from "../../api-hooks";
import { getLocalISODate, isUTCBetweenLocalHours } from "../../utils";

import { useTranslation } from "react-i18next";
import { DayTimeRange } from "../../types";

export const useMatchesStatus = (apiService: ApiService) => {
  const { t } = useTranslation();
  const timeRangeOptions: DayTimeRange[] = [
    { from: 8, to: 12, name: t("common.morning") },
    { from: 12, to: 18, name: t("common.afternoon") },
    { from: 18, to: 21, name: t("common.evening") },
    { from: 21, to: 23, name: t("common.night") },
    { from: 23, to: 8, name: t("common.overnight") },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(getLocalISODate());
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedTimeRange, setSelectedTimeRange] = useState<DayTimeRange>(
    timeRangeOptions[0]
  );

  const [selectedTimeRangeIndex, setSelectedTimeRangeIndex] = useState(0);

  const { loadingMatches, matches } = useMatches(
    apiService,
    selectedDate,
    selectedTimeRange.from
  );

  const countries = useMemo(
    () => Array.from(new Set(matches.map((it) => it.country))),
    [matches]
  );

  const leagueMatches = useMemo(() => {
    if (!selectedCountry) return [];

    const countryMatches = matches.find((m) => m.country === selectedCountry);

    if (!countryMatches?.matchesByLeague) return [];

    const filteredByTime = countryMatches.matchesByLeague.map((league) => {
      const filteredMatches = league.matches.filter((match) => {
        return isUTCBetweenLocalHours(
          match.date,
          selectedTimeRange.from,
          selectedTimeRange.to
        );
      });

      return { ...league, matches: filteredMatches };
    });

    return filteredByTime.filter((league) => league.matches.length > 0);
  }, [matches, selectedCountry, selectedTimeRange]);

  const isLeagueMatchesAvailable = !loadingMatches && leagueMatches.length > 0;

  useEffect(() => {
    if (!matches.length) {
      setSelectedCountry(undefined);
      return;
    }
    setSelectedCountry((prev) => prev || matches[0].country);
  }, [matches]);

  return {
    loadingMatches,
    selectedCountry,
    setSelectedCountry,
    selectedDate,
    setSelectedDate,
    countries,
    leagueMatches,
    isLeagueMatchesAvailable,
    selectedTimeRange,
    setSelectedTimeRange,
    timeRangeOptions,
    selectedTimeRangeIndex,
    setSelectedTimeRangeIndex,
  };
};
