import { NewsService } from "../implementation";
import { NewsCardItem } from "../../types";
import { mockNewsData } from "../../mock-data";

export const newsService: NewsService = {
  fetchNews: async (lang: string): Promise<NewsCardItem[]> => {
    console.log(lang);
    return Promise.resolve(mockNewsData);
  },
};
