import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { FutballeroUIStorage } from "../../storage";
import { VotingPoll } from "../../types";

const generatePollKey = (fixtureId: number, pollKey: string) =>
  `${fixtureId}-${pollKey}`;

export const useMatchPollsState = (
  storage: FutballeroUIStorage,
  apiService: ApiService,
  fixtureId: number,
  pollKey: string
) => {
  const [hasVotedState, setHasVotedState] = useState(false);

  const { pollsService } = apiService;

  const hasVoted = async () =>
    (await storage.get(generatePollKey(fixtureId, pollKey))) !== null;

  const setHasVoted = async () => {
    await storage.set(generatePollKey(fixtureId, pollKey), "true");
    setHasVotedState(true);
  };

  const votePoll = async (optionName: string) => {
    const vote: VotingPoll = {
      fixtureId,
      pollKey,
      optionName,
    };

    await pollsService.vote(vote);
    await setHasVoted();
  };

  useEffect(() => {
    let mounted = true;

    const checkVote = async () => {
      const voted = await hasVoted();
      if (mounted) setHasVotedState(voted);
    };

    checkVote();

    return () => {
      mounted = false;
    };
  }, [fixtureId]);

  return { hasVotedState, votePoll };
};
