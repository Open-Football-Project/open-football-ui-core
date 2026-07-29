export interface FeedbackRequest {
  favoriteTeam: string;
  league: string;
  liked: string;
  improvements: string;
  wantsAndroidBeta: boolean;
  googleEmail?: string | null;
}
