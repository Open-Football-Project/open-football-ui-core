import { FeedbackService } from "../implementation";
import { FeedbackRequest } from "../../types";

export const feedbackService: FeedbackService = {
  postFeedback: async (feedback: FeedbackRequest): Promise<void> => {
    console.log(feedback);
    return Promise.resolve();
  },
};
