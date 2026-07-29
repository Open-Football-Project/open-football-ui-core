import { useEffect, useState } from "react";
import { AvailablePoll } from "../../types";
import { ApiService } from "../../api-service";

export const useAvailablePolls = (
  apiService: ApiService,
  fixtureId: number
) => {
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [availablePolls, setAvailablePolls] = useState<AvailablePoll[]>([]);

  const { pollsService } = apiService;

  const isAvailablePollsOn = !loadingPolls && availablePolls.length > 0;

  useEffect(() => {
    setLoadingPolls(true);

    pollsService
      .availablePolls()
      .then((res) => {
        setAvailablePolls(res);
      })
      .catch(() => {
        setAvailablePolls([]);
      })
      .finally(() => setLoadingPolls(false));
  }, [fixtureId]);

  return {
    availablePolls,
    isAvailablePollsOn,
  };
};
