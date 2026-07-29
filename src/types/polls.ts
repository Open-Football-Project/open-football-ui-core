export interface VotingPoll {
  fixtureId: number;
  pollKey: string;
  optionName: string;
}

export interface AvailablePoll {
  pollKey: string;
  pollTitle: string;
  pollOptions: AvailablePollOption[];
}

export interface AvailablePollOption {
  optionName: string;
  optionTitle: string;
}

export interface Poll {
  pollTitle: string;
  pollKey: String;
  fixtureId: number;
  pollVotingOptions: PollVotingOption[];
}

export interface PollVotingOption {
  optionName: string;
  optionTitle: string;
  value: number;
}
