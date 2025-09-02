import axios from "axios";

export async function getInvestors() {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/investors',
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return [];
  }
}

export async function getInvestor(investorId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/investors/${investorId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error('error:', error.message);
    return null;
  }
}
