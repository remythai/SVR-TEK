import axios, { AxiosRequestConfig } from "axios";

export interface NewsItem {
  id: number;
  title: string;
  location?: string;
  news_date: string;
  category: string;
  description?: string;
}

export async function getNews(): Promise<NewsItem[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/news',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<NewsItem[]>(config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}
