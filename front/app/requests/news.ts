import axios, { AxiosRequestConfig } from "axios";

export interface NewsItem {
  id: number;
  title: string;
  location: string;
  news_date: string;
  category: string;
  description?: string;
}

// ---------- GET ----------
export async function getNews(): Promise<NewsItem[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:8000/news',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<NewsItem[]>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('GET News error:', error);
    return [];
  }
}

// ---------- CREATE ----------
export async function createNews(data: Omit<NewsItem, 'id'>): Promise<NewsItem | null> {
  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'http://localhost:8000/news',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN,
      'Content-Type': 'application/json'
    },
    data
  };

  try {
    const response = await axios.request<NewsItem>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('CREATE News error:', error);
    return null;
  }
}

// ---------- UPDATE ----------
export async function updateNews(id: number, data: Partial<Omit<NewsItem, 'id'>>): Promise<NewsItem | null> {
  const config: AxiosRequestConfig = {
    method: 'put',
    url: `http://localhost:8000/news/${id}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN,
      'Content-Type': 'application/json'
    },
    data
  };

  try {
    const response = await axios.request<NewsItem>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('UPDATE News error:', error);
    return null;
  }
}

// ---------- DELETE ----------
export async function deleteNews(id: number): Promise<boolean> {
  const config: AxiosRequestConfig = {
    method: 'delete',
    url: `http://localhost:8000/news/${id}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    await axios.request(config);
    return true;
  } catch (error: unknown) {
    console.error('DELETE News error:', error);
    return false;
  }
}
