import { describe, vi, expect, Mock, beforeEach, it } from "vitest";
import { pollsService } from "./pollService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";
import { get } from "node:http";
import { VotingPoll } from "../../../types";

describe("pollsService", () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();

  beforeEach(() => {
    (getApiFetch as Mock).mockReturnValue({
      get: mockGet,
      post: mockPost,
    });
  });

  it("should be able to vote with a post request", async () => {
    mockPost.mockResolvedValueOnce({});

    const votingPoll: VotingPoll = {
      fixtureId: 1,
      pollKey: "abcd",
      optionName: "zdwd",
    };

    await pollsService.vote(votingPoll);

    expect(mockPost).toHaveBeenCalledWith(`/api/polls/vote`, votingPoll);
  });

  it("should be able to get the available polls", async () => {
    mockGet.mockResolvedValueOnce({ data: {} });

    await pollsService.availablePolls();

    expect(mockGet).toHaveBeenCalledWith(`/api/polls/available`);
  });
});
