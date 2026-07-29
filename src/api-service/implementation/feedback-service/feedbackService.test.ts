import { describe, vi, expect, Mock, beforeEach, it } from "vitest";
import { feedbackService } from "./feedbackService";

vi.mock("../../api-service", () => {
  return {
    getApiFetch: vi.fn(),
  };
});

import { getApiFetch } from "../../api-service";
import { FeedbackRequest } from "../../../types";

describe("feedbackService", () => {
  const mockPost = vi.fn();

  beforeEach(() => {
    (getApiFetch as Mock).mockReturnValue({
      post: mockPost,
    });
  });

  it("should be able to post new feedback from the user", async () => {
    mockPost.mockResolvedValueOnce({});

    const userFeedback: FeedbackRequest = {
      favoriteTeam: "Arsenal",
      improvements: "too many love!!!",
      league: "Just here for the FA Cup",
      liked: "you have a lovelly app dear.",
      wantsAndroidBeta: true,
      googleEmail: "mrjoe@mail.com",
    };

    await feedbackService.postFeedback(userFeedback);

    expect(mockPost).toHaveBeenCalledWith(`/api/feedback/new`, userFeedback);
  });
});
