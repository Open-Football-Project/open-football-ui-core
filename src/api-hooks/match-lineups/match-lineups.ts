import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { TeamsLineups } from "../../types";

export const useMatchLineups = (apiService: ApiService, fixtureId: number) => {
  const [matchLineups, setMatchLineups] = useState<TeamsLineups | undefined>(
    undefined
  );
  const [loadingMatchLineups, setLoadingMatchLineups] = useState(true);

  const { matchesService } = apiService;

  const isLineupsAvailable =
    !loadingMatchLineups &&
    matchLineups !== undefined &&
    matchLineups.teamA !== null &&
    matchLineups.teamB !== null;

  useEffect(() => {
    setLoadingMatchLineups(true);

    matchesService
      .fetchMatchLineups(fixtureId)
      .then((res) => {
        setMatchLineups(res);
      })
      .catch(() => {
        setMatchLineups(undefined);
      })
      .finally(() => setLoadingMatchLineups(false));
  }, [fixtureId]);

  return {
    loadingMatchLineups,
    matchLineups,
    isLineupsAvailable,
  };
};
