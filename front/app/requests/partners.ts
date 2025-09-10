import axios, { AxiosRequestConfig } from "axios";

export interface Partner {
  id: number;
  name: string;
  legal_status: string,
  address: string,
  email: string,
  phone: string,
  created_at: string,
  description?: string;
  partnership_type: string
}

export async function getPartners(): Promise<Partner[]> {
  const config: AxiosRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/partners',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request<Partner[]>(config);
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

export async function getPartner(partnerId: number): Promise<Partner | null> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/partners/${partnerId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string
    }
  };

  try {
    const response = await axios.request<Partner>(config);
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
