import axios, { AxiosRequestConfig } from "axios";

export interface Founder {
  id?: number;
  name: string;
  role?: string;
}

export interface Startup {
  id: number;
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  created_at: string;
  description: string;
  website_url: string;
  social_media_url: string;
  project_status: string;
  needs: string;
  sector: string;
  maturity: string;
  founders: Founder[];
}

export interface CreateStartupPayload {
  name: string;
  legal_status: string;
  address: string;
  email: string;
  phone: string;
  created_at: string;
  description: string;
  website_url: string | null;
  social_media_url: string | null;
  project_status: string;
  needs: string;
  sector: string;
  maturity: string;
  founders: { name: string; role: string }[];
}

export async function createStartup(
  startupData: CreateStartupPayload
): Promise<Startup | null> {
  try {
    console.log('Client: Sending request to API route');

    const response = await axios.post<Startup>(
      '/api/startups',
      startupData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    console.log('Client: Response received:', response.data);
    return response.data;

  } catch (error: unknown) {
    console.error('Client Error:', error);
    throw error;
  }
}

export async function getStartups(): Promise<Startup[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await axios.get<Startup[]>(`${baseUrl}/startups`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching startups:', error);
    return [];
  }
}

export async function getStartup(startupId: string): Promise<Startup | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:8000/startups/${startupId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<Startup>(config);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching startup:', error);
    return null;
  }
}

export async function deleteStartup(startupId: number): Promise<boolean> {
  try {
    const response = await axios.delete(`/api/startups/${startupId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    return response.status === 200;
  } catch (error: unknown) {
    console.error("Error deleting startup:", error);
    return false;
  }
}

export async function getFounderImage(startupId: string, founderId: string): Promise<string | null> {
  try {
    const res = await axios.get<ArrayBuffer>(
      `http://localhost:8000/startups/${startupId}/founders/${founderId}/image`,
      {
        headers: {
          "X-Group-Authorization": process.env.GROUP_TOKEN,
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    if (res.status !== 200) return null;

    const contentType = res.headers["content-type"] || "image/png";
    const base64 = Buffer.from(res.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error: unknown) {
    console.error("Error fetching founder image:", error);
    return null;
  }
}
