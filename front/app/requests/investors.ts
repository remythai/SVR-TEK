import axios from "axios";

export interface Investor {
  id: number;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  description?: string;
}

export async function getInvestors(): Promise<Investor[]> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/investors',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string,
    },
  };

  try {
    const response = await axios.request<Investor[]>(config);
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

export async function getInvestor(investorId: string): Promise<Investor | null> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/investors/${investorId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN as string,
    },
  };

  try {
    const response = await axios.request<Investor>(config);
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
