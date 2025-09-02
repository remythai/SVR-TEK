import axios from "axios";

export async function getpartners() {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.jeb-incubator.com/partners',
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

export async function getpartner(partnerId: string) {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.jeb-incubator.com/partners/${partnerId}`,
    headers: {
      'X-Group-Authorization': process.env.GROUP_TOKEN
    }
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error(`error:`, error.message);
    return null;
  }
}
