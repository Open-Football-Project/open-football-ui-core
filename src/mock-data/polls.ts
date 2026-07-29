import { Poll, VotingPoll, AvailablePoll } from "../types";

export const poll: Poll = {
  fixtureId: 1243,
  pollTitle: "Match Winner",
  pollKey: "match-winner",
  pollVotingOptions: [
    { optionName: "home", value: 3, optionTitle: "Home" },
    { optionName: "draw", value: 1, optionTitle: "Draw" },
    { optionName: "away", value: 3, optionTitle: "away" },
  ],
};

export const votingPoll: VotingPoll = {
  fixtureId: 1243,
  pollKey: "match-winner",
  optionName: "home",
};

export const availablePolls: AvailablePoll[] = [
  {
    pollKey: "match-winner",
    pollTitle: "Match Winner?",
    pollOptions: [
      {
        optionName: "Home",
        optionTitle: "Home",
      },
      {
        optionName: "Draw",
        optionTitle: "Draw",
      },
      {
        optionName: "Away",
        optionTitle: "Away",
      },
    ],
  },
  {
    pollKey: "match-winner2",
    pollTitle: "Match Winner 2?",
    pollOptions: [
      {
        optionName: "Home2",
        optionTitle: "Home2",
      },
      {
        optionName: "Draw2",
        optionTitle: "Draw2",
      },
      {
        optionName: "Away2",
        optionTitle: "Away2",
      },
    ],
  },
];
