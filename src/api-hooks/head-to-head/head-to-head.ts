import { useEffect, useState } from "react";
import { H2HDetails } from "../../types";
import { ApiService } from "../../api-service";

export const useHeadToHead = (
  apiService: ApiService,
  homeTeamId: number,
  awayTeamId: number,
  isFull?: boolean
) => {
  const [h2hDetails, setH2hDetails] = useState<H2HDetails[]>([]);
  const [loadingH2hDetail, setLoadingH2hDetails] = useState(true);

  const isHead2HeadAvailable = !loadingH2hDetail && h2hDetails.length > 0;

  const { teamsService } = apiService;

  useEffect(() => {
    setLoadingH2hDetails(true);

    teamsService
      .fetchHeadToHead(homeTeamId, awayTeamId, isFull)
      .then((result: H2HDetails[]) => {
        setH2hDetails(result);
      })
      .catch(() => {
        setH2hDetails([]);
      })
      .finally(() => setLoadingH2hDetails(false));
  }, [homeTeamId, awayTeamId]);

  return {
    loadingH2hDetail,
    h2hDetails,
    isHead2HeadAvailable,
  };
};
