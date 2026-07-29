import { getApiFetch } from "../../api-service";
import { AvailablePoll, FeedbackRequest, VotingPoll } from "../../../types";

export interface FeedbackService {
  postFeedback: (feedback: FeedbackRequest) => Promise<void>;
}

export const feedbackService: FeedbackService = {
  postFeedback: async (feedback: FeedbackRequest): Promise<void> => {
    await getApiFetch().post(`/api/feedback/new`, feedback);
  },
};
