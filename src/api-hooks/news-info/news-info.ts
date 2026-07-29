import { useEffect, useState } from "react";

import { ApiService } from "../../api-service";
import { NewsCardItem } from "../../types";

export const useNewsInfo = (apiService: ApiService, lang: string) => {
  const [news, setNews] = useState<NewsCardItem[]>([]);

  const [loadingNews, setLoadingNews] = useState(true);

  const isPlayerNewsAvailable = !loadingNews && news.length > 0;

  const { newsService } = apiService;

  useEffect(() => {
    setLoadingNews(true);
    newsService
      .fetchNews(lang)
      .then((it) => setNews(it))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));
  }, [lang, newsService]);

  return {
    isPlayerNewsAvailable,
    news,
    loadingNews,
  };
};
