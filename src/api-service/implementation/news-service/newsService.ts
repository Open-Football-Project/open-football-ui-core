import { getApiFetch } from "../../api-service";
import { NewsCardItem } from "../../../types";

export interface NewsService {
  fetchNews: (lang: string) => Promise<NewsCardItem[]>;
}

export const newsService: NewsService = {
  fetchNews: async (lang: string): Promise<NewsCardItem[]> => {
    const response = await getApiFetch().get<NewsCardItem[]>(
      `/api/news/${lang}`
    );
    return response.data;
  },
};
