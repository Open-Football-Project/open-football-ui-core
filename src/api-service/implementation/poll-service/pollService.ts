import { getApiFetch } from "../../api-service";
import { AvailablePoll, VotingPoll } from "../../../types";

export interface PollsService {
  vote: (votingPoll: VotingPoll) => Promise<void>;
  availablePolls: () => Promise<AvailablePoll[]>;
}

export const pollsService: PollsService = {
  vote: async (votingPoll: VotingPoll): Promise<void> => {
    await getApiFetch().post(`/api/polls/vote`, votingPoll);
  },

  availablePolls: async (): Promise<AvailablePoll[]> => {
    return (await getApiFetch().get(`/api/polls/available`)).data;
  },
};
