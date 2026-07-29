import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { DayMatchesResponse } from "../../types";
import { localToUTC } from "../../utils/dateandtime/dateAndTime";

export const useMatches = (
  apiService: ApiService,
  matchLocalISODate: string,
  timeRangeFromHour: number
) => {
  const [matches, setMatches] = useState<DayMatchesResponse[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const { matchesService } = apiService;

  useEffect(() => {
    setLoadingMatches(true);
    matchesService
      .fetchMatches(localToUTC(matchLocalISODate, timeRangeFromHour))
      .then((data) => {
        setMatches(data);
        setLoadingMatches(false);
      })
      .catch(() => {
        setLoadingMatches(false);
        setMatches([]);
      });
  }, [matchLocalISODate, timeRangeFromHour]);

  return {
    loadingMatches,
    matches,
  };
};
