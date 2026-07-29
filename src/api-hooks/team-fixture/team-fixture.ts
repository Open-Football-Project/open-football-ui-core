import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { TeamFixture } from "../../types";

export const useTeamFixture = (apiService: ApiService, teamId: number) => {
  const [teamFixture, setTeamFixture] = useState<TeamFixture | undefined>(
    undefined
  );
  const [loadingFixture, setLoadingFixture] = useState(true);
  const { fixtureService } = apiService;

  const isPreviousMatchesAvailable =
    !loadingFixture &&
    teamFixture !== undefined &&
    teamFixture?.previous?.length > 0;

  const isUpcommingMatchesAvailable =
    !loadingFixture &&
    teamFixture !== undefined &&
    teamFixture?.upcoming?.length > 0;

  useEffect(() => {
    setLoadingFixture(true);

    fixtureService
      .fetchTeamFixture(teamId)
      .then((result: TeamFixture) => setTeamFixture(result))
      .catch(() => setTeamFixture(undefined))
      .finally(() => setLoadingFixture(false));
  }, [teamId]);

  return {
    isPreviousMatchesAvailable,
    isUpcommingMatchesAvailable,
    teamFixture,
  };
};
