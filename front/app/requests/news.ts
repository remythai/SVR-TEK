import axios from "axios";

export interface NewsItem {
  id: number;
  title: string;
  location?: string;
  news_date: string;
  category: string;
  description?: string;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BACKEND_URL : '';
    const response = await axios.get<NewsItem[]>(`${baseUrl}/api/news`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}
