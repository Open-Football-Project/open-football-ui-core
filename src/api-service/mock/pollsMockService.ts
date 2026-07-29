import { PollsService } from "../implementation";
import { AvailablePoll, VotingPoll } from "../../types";
import { availablePolls } from "../../mock-data";

export const pollsService: PollsService = {
  vote: async (votingPoll: VotingPoll): Promise<void> => {
    console.log(votingPoll);
    return Promise.resolve();
  },

  availablePolls: async (): Promise<AvailablePoll[]> => {
    console.log("fetching-polls");
    return Promise.resolve(availablePolls);
  },
};
