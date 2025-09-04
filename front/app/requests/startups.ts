import axios, { AxiosRequestConfig } from "axios";

export interface Founder {
  id: number;
  name: string;
  role?: string;
}

export interface Startup {
  id: number;
  name: string,
  legal_status: string,
  address: string,
  email: string,
  phone: string,
  created_at: number,
  description: string,
  website_url: string,
  social_media_url: string,
  project_status: string,
  needs: string,
  sector: string,
  maturity: string,
  founders: Founder[]
}

export async function getStartups(): Promise<Startup[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/startups',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<Startup[]>(config);
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

export async function getStartup(startupId: string): Promise<Startup | null> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/startups/${startupId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<Startup>(config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`error:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

export async function getFounderImage(startupId: string, founderId: string): Promise<string | null> {
  try {
    const res = await axios.get<ArrayBuffer>(
      `https://api.jeb-incubator.com/startups/${startupId}/founders/${founderId}/image`,
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
    if (error instanceof Error) {
      console.error("getFounderImage error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
}
