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
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/news',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string
    }
  };

  try {
    const response = await axios.request<NewsItem[]>(config);
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

export async function getNew(newId: string): Promise<NewsItem | null> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/news/${newId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string
    }
  };

  try {
    const response = await axios.request<NewsItem>(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}
